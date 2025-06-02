document.addEventListener('DOMContentLoaded', function() {
    const tableBody = document.getElementById('ai-table-body');
    const form = document.getElementById('ai-search-form');
    const isAdmin = currentUser?.userRole === 'ROLE_ADMIN';
    const apiBase = isAdmin ? '/admin/analysis-result/search' : '/analysis-results/search';

    // AI 분석 결과 불러오기
    async function fetchAiResults(params = {}) {
        const searchParams = new URLSearchParams(params);
        const res = await fetch(`${apiBase}?${searchParams.toString()}`);
        if (!res.ok) {
            tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:#dc2626;">AI 분석 결과를 불러오지 못했습니다.</td></tr>`;
            return;
        }
        const data = await res.json();
        renderTable(data.content || data);
    }

    // 테이블 렌더링
    function renderTable(data) {
        tableBody.innerHTML = '';
        if (!data || data.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:#6c757d;">AI 분석 내역이 없습니다.</td></tr>`;
            return;
        }
        data.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.user_name || '-'}</td>
                <td>${row.analysis_type || '-'}</td>
                <td>${row.result_summary || '-'}</td>
                <td>${row.analyzed_at ? row.analyzed_at.substring(0, 16).replace('T', ' ') : '-'}</td>
            `;
            tableBody.appendChild(tr);
        });
    }

    // 검색/필터 이벤트
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const sensor = form.sensor.value.trim();
        const startDate = form['start-date'].value;
        const endDate = form['end-date'].value;
        const params = {};
        if (sensor) params.sensor = sensor;
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
        fetchAiResults(params);
    });

    // 최초 로딩 시 전체 목록 조회
    fetchAiResults();
});
