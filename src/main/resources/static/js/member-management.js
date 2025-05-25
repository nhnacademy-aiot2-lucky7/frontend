document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('member-search-form');
    const tableBody = document.getElementById('member-table-body');
    let members = window.members || []; // 서버에서 내려주는 전체 멤버 데이터
    let currentSort = { key: null, asc: true };

    function renderTable(data) {
        tableBody.innerHTML = '';
        if (data.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: 2rem; color: #6c757d;">멤버가 없습니다.</td></tr>`;
            return;
        }
        data.forEach(member => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${member.name}</td>
                <td>${member.email}</td>
                <td>${member.departmentName}</td>
                <td>${member.phone}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    // 정렬
    document.querySelectorAll('.member-table th').forEach(th => {
        th.addEventListener('click', function() {
            const key = this.getAttribute('data-sort');
            if (!key) return;
            currentSort.asc = currentSort.key === key ? !currentSort.asc : true;
            currentSort.key = key;
            members.sort((a, b) => {
                if (a[key] < b[key]) return currentSort.asc ? -1 : 1;
                if (a[key] > b[key]) return currentSort.asc ? 1 : -1;
                return 0;
            });
            renderTable(members);
        });
    });

    // 검색/필터
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const keyword = form.keyword.value.toLowerCase();
        const department = form.department.value;
        let filtered = members.filter(m =>
            (!department || m.departmentId === department) &&
            (m.name.toLowerCase().includes(keyword) ||
                m.email.toLowerCase().includes(keyword) ||
                m.phone.replace(/-/g, '').includes(keyword.replace(/-/g, '')))
        );
        renderTable(filtered);
    });

    // 최초 렌더링
    renderTable(members);
});
