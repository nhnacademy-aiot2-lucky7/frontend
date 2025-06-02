document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('member-search-form');
    const tableBody = document.getElementById('member-table-body');
    let members = window.members || [];
    let currentSort = {key: null, asc: true};

    function registerEditDeleteEvents(row, member) {
        // 수정 버튼
        row.querySelector('.edit-btn').addEventListener('click', function () {
            const origName = member.name;
            const origEmail = member.email;
            const origDeptName = member.departmentName;

            row.querySelector('.name-cell').innerHTML = `<input type="text" value="${member.name}" class="edit-name"/>`;
            row.querySelector('.email-cell').innerHTML = `<input type="email" value="${member.email}" class="edit-email"/>`;
            row.querySelector('.department-cell').textContent = origDeptName;

            row.querySelector('td:last-child').innerHTML = `
        <button class="btn btn-save" data-id="${member.id}">저장</button>
        <button class="btn btn-cancel" data-id="${member.id}">취소</button>
        <button class="btn btn-delete" data-id="${member.id}">삭제</button>
    `;

            // 저장 버튼 이벤트
            row.querySelector('.btn-save').addEventListener('click', function () {
                const newName = row.querySelector('.edit-name').value;
                const newEmail = row.querySelector('.edit-email').value;
                fetch(`/admin/member/edit/${member.id}`, {
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ name: newName, email: newEmail })
                })
                    .then(res => {
                        if (res.ok) {
                            alert('수정되었습니다.');
                            location.reload();
                        } else {
                            alert('수정 실패');
                        }
                    });
            });

            // 취소 버튼 이벤트
            row.querySelector('.btn-cancel').addEventListener('click', function () {
                row.querySelector('.name-cell').textContent = origName;
                row.querySelector('.email-cell').textContent = origEmail;
                row.querySelector('.department-cell').textContent = origDeptName;
                row.querySelector('td:last-child').innerHTML = `
            <button class="btn btn-edit edit-btn" data-id="${member.id}">수정</button>
        `;
                registerEditDeleteEvents(row, member);
            });

            // 삭제 버튼 이벤트
            row.querySelector('.btn-delete').addEventListener('click', function () {
                if (confirm('정말 삭제 하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
                    fetch(`/admin/member/${member.id}`, {method: 'DELETE'})
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
            <td class="name-cell">${member.name}</td>
            <td class="email-cell">${member.email}</td>
            <td class="department-cell">${member.departmentName}</td>
            <td>${member.phone}</td>
            <td>${member.createdAt ? member.createdAt.substring(0, 10) : ''}</td>
            <td>
                <button class="btn btn-edit edit-btn" data-id="${member.id}">수정</button>
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
                    // 실제 데이터 구조에 맞게 필드명 선택
                    aValue = a.departmentName || (a.department?.departmentName) || "";
                    bValue = b.departmentName || (b.department?.departmentName) || "";
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
        // department 관련 코드 삭제!
        let filtered = members.filter(m =>
            m.name.toLowerCase().includes(keyword) ||
            m.email.toLowerCase().includes(keyword) ||
            m.phone.replace(/-/g, '').includes(keyword.replace(/-/g, ''))
        );
        renderTable(filtered);
    });

    // 최초 렌더링
    renderTable(members);
});
