document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('event-search-form');
    const tableBody = document.getElementById('event-table-body');
    const pagination = document.getElementById('pagination');
    let lastSearchRequest = null;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);

        const keyword = formData.get('keyword')?.trim();
        const departmentId = formData.get('departmentId');
        const startAt = formData.get('start-date');
        const endAt = formData.get('end-date');
        const levels = formData.getAll('event-level');

        lastSearchRequest = {
            keyword: keyword || null,
            departmentId: departmentId || null,
            startAt: startAt ? `${startAt}T00:00:00` : null,
            endAt: endAt ? `${endAt}T23:59:59` : null,
            eventLevels: levels.length > 0 ? levels : null,
            sourceId: null,
            sourceType: null
        };

        loadPage(0);
    });

    async function loadPage(page) {
        if (!lastSearchRequest) return;

        try {
            const response = await fetch(`http://team1-eureka-gateway:10232/events/search?page=${page}&size=10`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(lastSearchRequest)
            });

            if (!response.ok) throw new Error('데이터 요청 실패');

            const result = await response.json();
            renderTable(result.content);
            renderPagination(result.number, result.totalPages);
        } catch (err) {
            console.error(err);
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; color: red; padding: 2rem;">데이터 로딩 실패</td>
                </tr>`;
        }
    }

    function renderTable(events) {
        if (!events || events.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 2rem; color: #6c757d;">
                        이벤트 내역이 없습니다.
                    </td>
                </tr>`;
            return;
        }

        tableBody.innerHTML = events.map(event => `
            <tr data-event-no="${event.eventNo}">
                <td>${event.departmentId}</td>
                <td>${event.eventLevel}</td>
                <td>${event.eventSource.sourceId}</td>
                <td>${event.eventDetails}</td>
                <td>${formatDateTime(event.eventAt)}</td>
                <td><button class="delete-btn">삭제</button></td>
            </tr>
        `).join('');

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', async (e) => {
                const row = e.target.closest('tr');
                const eventNo = row.getAttribute('data-event-no');
                if (confirm('정말 삭제하시겠습니까?')) {
                    await deleteEvent(eventNo);
                    loadPage(0);
                }
            });
        });
    }

    async function deleteEvent(eventNo) {
        try {
            const res = await fetch(`http://team1-eureka-gateway:10232/admin/events/${eventNo}`, {
                method: 'DELETE'
            });
            if (!res.ok) throw new Error('삭제 실패');
        } catch (e) {
            alert('이벤트 삭제 중 오류 발생');
            console.error(e);
        }
    }

    function renderPagination(currentPage, totalPages) {
        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }

        let html = '';
        for (let i = 0; i < totalPages; i++) {
            html += `<button class="page-btn${i === currentPage ? ' active' : ''}" data-page="${i}">${i + 1}</button>`;
        }
        pagination.innerHTML = html;

        document.querySelectorAll('.page-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const page = parseInt(e.target.getAttribute('data-page'), 10);
                loadPage(page);
            });
        });
    }

    function formatDateTime(datetimeStr) {
        const date = new Date(datetimeStr);
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
    }

    function pad(n) {
        return n.toString().padStart(2, '0');
    }

    // 첫 로드 시 검색 실행
    loadPage(0);
});
