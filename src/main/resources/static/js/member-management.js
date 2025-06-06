document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('member-search-form');
    const tableBody = document.getElementById('member-table-body');
    const badge = document.getElementById('member-count-badge');
    const pagination = document.getElementById('pagination');

    let currentPage = 0;
    let pageSize = 10;
    let currentSort = { key: 'userName', direction: 'asc' };
    let currentKeyword = '';

    function safeValue(val) {
        return (val !== null && val !== undefined && val !== "null") ? val : "정보 없음";
    }

    function fetchMembers() {
        const params = new URLSearchParams({
            page: currentPage,
            size: pageSize,
            sort: `${currentSort.key},${currentSort.direction}`
        });
        if (currentKeyword) {
            params.append('keyword', currentKeyword);
        }

        fetch(`/users/all?${params}`)
            .then(res => res.json())
            .then(renderMembers);
    }

    function renderMembers(data) {
        const members = data.content || [];
        badge.textContent = `총 ${data.totalElements}명`;
        tableBody.innerHTML = '';

        if (members.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 2rem; color: #6c757d;">멤버가 없습니다.</td></tr>`;
            pagination.innerHTML = '';
            return;
        }

        members.forEach(member => {
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

        renderPagination(data.totalPages);
    }

    function renderPagination(totalPages) {
        pagination.innerHTML = '';
        for (let i = 0; i < totalPages; i++) {
            const li = document.createElement('li');
            li.textContent = i + 1;
            li.className = (i === currentPage) ? 'active' : '';
            li.addEventListener('click', () => {
                currentPage = i;
                fetchMembers();
            });
            pagination.appendChild(li);
        }
    }

    function registerEditDeleteEvents(row, member) {
        row.querySelector('.edit-btn').addEventListener('click', function () {
            row.querySelector('.role-cell').innerHTML = `
                <select class="edit-role">
                    <option value="ROLE_MEMBER" ${member.userRole === 'ROLE_MEMBER' ? 'selected' : ''}>일반회원</option>
                    <option value="ROLE_ADMIN" ${member.userRole === 'ROLE_ADMIN' ? 'selected' : ''}>관리자</option>
                </select>`;
            row.querySelector('.action-cell').innerHTML = `
                <button class="btn btn-save">저장</button>
                <button class="btn btn-cancel">취소</button>
                <button class="btn btn-delete">삭제</button>`;

            row.querySelector('.btn-save').addEventListener('click', function () {
                const newRole = row.querySelector('.edit-role').value;
                fetch('/admin/users/roles', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    credentials:'include',
                    body: JSON.stringify({
                        userId: member.userEmail,
                        roleId: newRole
                    })
                }).then(res => {
                    if (res.ok) {
                        alert('권한이 변경되었습니다.');
                        fetchMembers();
                    } else {
                        alert('권한 변경 실패');
                    }
                });
            });

            row.querySelector('.btn-cancel').addEventListener('click', fetchMembers);

            row.querySelector('.btn-delete').addEventListener('click', function () {
                if (confirm('정말 삭제 하시겠습니까?')) {
                    fetch(`/admin/users/${member.userEmail}`, { method: 'DELETE' })
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

    document.querySelectorAll('.member-table th').forEach(th => {
        th.addEventListener('click', function () {
            const key = this.getAttribute('data-sort');
            if (!key) return;
            if (currentSort.key === key) {
                currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
            } else {
                currentSort.key = key;
                currentSort.direction = 'asc';
            }
            fetchMembers();
        });
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        currentKeyword = form.keyword.value.trim();
        currentPage = 0;
        fetchMembers();
    });

    fetchMembers();
});
