function getRoleName(roleId) {
    if (roleId === 'ROLE_ADMIN') return '관리자';
    if (roleId === 'ROLE_MEMBER') return '일반회원';
    return roleId;
}

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('member-search-form');
    const tableBody = document.getElementById('member-table-body');
    let members = [];
    let currentSort = {key: null, asc: true};

    // 멤버 목록 API로 불러오기
    function fetchMembers() {
        fetch('http://localhost:10232/admin/users', {
            headers: {
                'Accept': 'application/json'
            },
            credentials: 'include'
        })
            .then(res => {
                if (!res.ok) throw new Error('멤버 목록 조회 실패');
                return res.json();
            })
            .then(data => {
                if (!Array.isArray(data)) {
                    alert('API 응답이 배열이 아닙니다: ' + JSON.stringify(data));
                    return;
                }
                members = data;
                renderTable(members);
            })
            .catch(err => {
                alert(err.message);
            });
    }

    // 테이블 렌더링 (user-service 응답 필드에 맞게)
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
                <td class="name-cell">${member.userName}</td>
                <td class="email-cell">${member.userEmail}</td>
                <td class="department-cell">${member.department?.departmentName || ''}</td>
                <td>${member.userPhone}</td>
                <td>${getRoleName(member.userRole)}</td>
                <td>
                    <button class="btn btn-edit edit-btn" data-id="${member.userNo}">수정</button>
                </td>
            `;
            tableBody.appendChild(row);
            registerEditDeleteEvents(row, member);
        });
    }

    function registerEditDeleteEvents(row, member) {
        row.querySelector('.edit-btn').addEventListener('click', function () {
            // 권한 드롭다운
            row.querySelector('td:nth-child(5)').innerHTML = `
                <select class="edit-role">
                    <option value="ROLE_MEMBER" ${member.userRole === 'ROLE_MEMBER' ? 'selected' : ''}>일반회원</option>
                    <option value="ROLE_ADMIN" ${member.userRole === 'ROLE_ADMIN' ? 'selected' : ''}>관리자</option>
                </select>
            `;
            row.querySelector('td:last-child').innerHTML = `
            <button class="btn btn-save" data-id="${member.userNo}">저장</button>
            <button class="btn btn-cancel" data-id="${member.userNo}">취소</button>
            <button class="btn btn-delete delete-btn" data-id="${member.userNo}">삭제</button>
        `;

            // 저장(권한 변경)
            const adminEmail = window.currentUser?.userEmail || localStorage.getItem('adminEmail'); // 관리자 이메일

            row.querySelector('.btn-save').addEventListener('click', async function () {
                const newRole = row.querySelector('.edit-role').value;
                const encrypted = await encryptEmailGCM(adminEmail, AES_KEY); // 관리자 이메일 암호화!
                fetch('http://localhost:10232/admin/users/roles', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-User-Id': encrypted
                    },
                    body: JSON.stringify({
                        userId: member.userEmail, // 대상 유저
                        roleId: newRole
                    })
                })
                    .then(res => {
                        if (res.ok) {
                            alert('권한이 수정되었습니다.');
                            fetchMembers();
                        } else {
                            alert('권한 수정 실패');
                        }
                    });
            });

            // 취소
            row.querySelector('.btn-cancel').addEventListener('click', function () {
                renderTable(members);
            });

            // 삭제
            row.querySelector('.btn-delete').addEventListener('click', async function () {
                if (confirm('정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
                    const encrypted = await encryptEmailGCM(member.userEmail, AES_KEY);
                    fetch(`http://localhost:10232/admin/users/${member.userEmail}`, {
                        method: 'DELETE',
                        headers: {
                            'X-User-Id': encrypted
                        }
                    })
                        .then(res => {
                            if (res.ok) {
                                alert('삭제되었습니다.');
                                fetchMembers();
                            } else {
                                alert('삭제 실패');
                            }
                        });
                }
            });
        });
    }

    // 검색/필터
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const keyword = form.keyword.value.toLowerCase();
        let filtered = members.filter(m =>
            m.userName.toLowerCase().includes(keyword) ||
            m.userEmail.toLowerCase().includes(keyword) ||
            m.userPhone.replace(/-/g, '').includes(keyword.replace(/-/g, ''))
        );
        renderTable(filtered);
    });

    // 정렬
    document.querySelectorAll('.member-table th').forEach(th => {
        th.addEventListener('click', function () {
            const key = this.getAttribute('data-sort');
            if (!key) return;
            currentSort.asc = currentSort.key === key ? !currentSort.asc : true;
            currentSort.key = key;
            members.sort((a, b) => {
                let aValue, bValue;
                if (key === "departmentName") {
                    aValue = a.department?.departmentName || "";
                    bValue = b.department?.departmentName || "";
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

    fetchMembers();
});
