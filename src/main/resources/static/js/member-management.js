document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('member-search-form');
    const tableBody = document.getElementById('member-table-body');
    let members = window.members || [];
    let currentSort = {key: null, asc: true};

    function safeValue(val) {
        return (val !== null && val !== undefined && val !== "null") ? val : "정보 없음";
    }

    function registerEditDeleteEvents(row, member) {
        row.querySelector('.edit-btn').addEventListener('click', function () {
            // 권한 칸만 드롭다운으로 변경
            row.querySelector('.role-cell').innerHTML = `
            <select class="edit-role">
                <option value="ROLE_MEMBER" ${member.userRole === 'ROLE_MEMBER' ? 'selected' : ''}>일반회원</option>
                <option value="ROLE_ADMIN" ${member.userRole === 'ROLE_ADMIN' ? 'selected' : ''}>관리자</option>
            </select>
        `;
            // "관리" 칸을 통째로 교체: 수정 버튼 → 저장/취소/삭제
            row.querySelector('.action-cell').innerHTML = `
            <button class="btn btn-save" data-id="${member.userNo}">저장</button>
            <button class="btn btn-cancel" data-id="${member.userNo}">취소</button>
            <button class="btn btn-delete" data-id="${member.userNo}">삭제</button>
        `;

            // 저장/취소/삭제 이벤트 등록
            row.querySelector('.btn-save').addEventListener('click', function () {
                const newRole = row.querySelector('.edit-role').value;
                fetch('/admin/users/roles', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: member.userEmail,
                        roleId: newRole
                    })
                })
                    .then(res => {
                        if (res.ok) {
                            alert('권한이 변경되었습니다.');
                            location.reload();
                        } else {
                            alert('권한 변경 실패');
                        }
                    });
            });

            row.querySelector('.btn-cancel').addEventListener('click', function () {
                renderTable(members);
            });

            row.querySelector('.btn-delete').addEventListener('click', function () {
                if (confirm('정말 삭제 하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
                    fetch(`/admin/users/${member.userEmail}`, {method: 'DELETE'})
                        .then(res => {
                            if (res.ok) {
                                alert('삭제되었습니다.');
                                location.reload();
                            } else {
                                alert('삭제 실패');
                            }
                        });
                }
            });
        });
    }

    function renderTable(data) {
        tableBody.innerHTML = '';
        document.getElementById('member-count-badge').textContent = `총 ${data.length}명`;
        if (data.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 2rem; color: #6c757d;">멤버가 없습니다.</td></tr>`;
            return;
        }
        data.forEach(member => {
            const row = document.createElement('tr');
            row.innerHTML = `
            <td class="name-cell">${safeValue(member.userName)}</td>
            <td class="email-cell">${safeValue(member.userEmail)}</td>
            <td class="department-cell">${safeValue(member.department?.departmentName)}</td>
            <td class="phone-cell">${safeValue(member.userPhone)}</td>
            <td class="role-cell">${member.userRole === 'ROLE_ADMIN' ? '관리자' : '일반회원'}</td>
            <td class="action-cell">
                <button class="btn btn-edit edit-btn" data-id="${member.userNo}">수정</button>
            </td>
        `;
            tableBody.appendChild(row);
            registerEditDeleteEvents(row, member);
        });
    }

    // 정렬
    document.querySelectorAll('.member-table th').forEach(th => {
        th.addEventListener('click', function () {
            const key = this.getAttribute('data-sort');
            if (!key) return;
            currentSort.asc = currentSort.key === key ? !currentSort.asc : true;
            currentSort.key = key;
            members.sort((a, b) => {
                let aValue, bValue;
                if (key === "department") {
                    aValue = a.department?.departmentName || "";
                    bValue = b.department?.departmentName || "";
                } else if (key === "userRole") {
                    // 권한 한글 정렬을 위해 변환
                    const roleMap = { "ROLE_ADMIN": "관리자", "ROLE_MEMBER": "일반회원" };
                    aValue = roleMap[a.userRole] || "";
                    bValue = roleMap[b.userRole] || "";
                } else {
                    aValue = a[key] || "";
                    bValue = b[key] || "";
                }
                if (aValue < bValue) return currentSort.asc ? -1 : 1;
                if (aValue > bValue) return currentSort.asc ? 1 : -1;
                return 0;
            });
            renderTable(members);
        });
    });

    // 검색/필터
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const keyword = form.keyword.value.toLowerCase();
        let filtered = members.filter(m =>
            (m.userName && m.userName.toLowerCase().includes(keyword)) ||
            (m.userEmail && m.userEmail.toLowerCase().includes(keyword)) ||
            (m.userPhone && m.userPhone.replace(/-/g, '').includes(keyword.replace(/-/g, '')))
        );
        renderTable(filtered);
    });

    // 최초 렌더링
    renderTable(members);
});
