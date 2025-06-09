document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('ai-table-body');
    let originData = [];
    let chartInstances = {};
    let expandedRowId = null;

    // --- 1) 전체 데이터 fetch + 테이블 렌더 + 첫번째(최신) 차트 표시
    async function fetchAllData() {
        const res = await fetch(
            '/api/analysis-results/search?page=0&size=10000',
            { credentials: 'include' }
        );
        if (!res.ok) {
            tableBody.innerHTML = '<tr><td colspan="4">데이터를 불러올 수 없습니다.</td></tr>';
            return;
        }
        const data = await res.json();
        // 이미 최신순이라면 정렬 생략. 아니라면 아래처럼:
        // originData = data.content.sort((a,b)=>b.analyzedAt - a.analyzedAt);
        originData = data.content;

        renderTable(originData);
        // === 페이지 로드 직후, 첫 번째 아이템 디테일 보여주기
        if (originData.length > 0) {
            const latest = originData[0];
            const firstTr = tableBody.querySelector('tr');
            window.lastClickedTr = firstTr;      // 로딩 표시용
            showDetailLoading();
            const detail = await fetchDetail(latest.id);
            hideDetailLoading();
            showDetail(detail, firstTr, latest.id);
            expandedRowId = latest.id;
        }
    }

    // --- 2) 테이블 렌더 (간단하게 departmentName, type, summary, time)
    function renderTable(list) {
        tableBody.innerHTML = '';
        list.forEach(row => {
            const tr = document.createElement('tr');
            tr.style.cursor = 'pointer';
            tr.innerHTML = `
        <td>${row.departmentName||'-'}</td>
        <td>${row.type||'-'}</td>
        <td>${row.resultSummary||'-'}</td>
        <td>${formatTimestamp(row.analyzedAt)||'-'}</td>
      `;
            tr.addEventListener('click', async () => {
                // 사용자가 클릭해도 동일하게 동작
                window.lastClickedTr = tr;
                if (expandedRowId === row.id) {
                    clearExpandRows(); return;
                }
                clearExpandRows();
                showDetailLoading();
                const detail = await fetchDetail(row.id);
                hideDetailLoading();
                showDetail(detail, tr, row.id);
                expandedRowId = row.id;
            });
            tableBody.appendChild(tr);
        });
    }

    // --- 3) 상세 데이터 fetch
    async function fetchDetail(id) {
        const res = await fetch(`/api/analysis-results/${id}`, { credentials: 'include' });
        if (!res.ok) {
            alert('상세 데이터를 불러올 수 없습니다.');
            return null;
        }
        return res.json();
    }

    // --- 로딩 스피너
    function showDetailLoading() {
        const tr = document.createElement('tr');
        tr.className = 'expand-row loading-row';
        tr.innerHTML = `<td colspan="4" style="text-align:center; padding:1rem;">
      <span>로딩 중…</span>
    </td>`;
        window.lastClickedTr.after(tr);
    }
    function hideDetailLoading() {
        document.querySelectorAll('.loading-row').forEach(el => el.remove());
    }

    // --- 확장행/차트 초기화
    function clearExpandRows() {
        document.querySelectorAll('.expand-row').forEach(el => el.remove());
        Object.values(chartInstances).forEach(c=>c.destroy&&c.destroy());
        chartInstances = {};
        expandedRowId = null;
    }

    // --- 4) 차트 렌더 함수 (예: 단일센서 라인 차트 예시)
    function showDetail(detail, baseTr, id) {
        if (!detail) return;
        let result;
        try { result = detail.resultJson ? JSON.parse(detail.resultJson) : detail; }
        catch { return alert('파싱 오류'); }

        // (여기선 예시로 SINGLE_SENSOR만)
        if (!Array.isArray(result.predictedData)) return;

        const labels = result.predictedData.map(d=>new Date(d.predictedDate).toLocaleDateString());
        const data   = result.predictedData.map(d=>d.predictedValue);

        const html = `
      <td colspan="4">
        <canvas id="chart-${id}" width="600" height="300"></canvas>
      </td>
    `;
        const expandTr = document.createElement('tr');
        expandTr.className = 'expand-row';
        expandTr.innerHTML = html;
        baseTr.after(expandTr);

        // 다음 이벤트 루프에 차트 생성
        setTimeout(()=>{
            chartInstances[`chart-${id}`] = new Chart(
                document.getElementById(`chart-${id}`),
                {
                    type: 'line',
                    data: { labels, datasets: [{ label: '예측값', data }] },
                    options: { responsive:true, maintainAspectRatio:false }
                }
            );
        }, 0);
    }

    // --- 유틸: timestamp → "YYYY-MM-DD HH:mm:ss"
    function formatTimestamp(ms) {
        if (!ms) return '-';
        const d = new Date(Number(ms));
        return `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,'0')}-`+
            `${d.getDate().toString().padStart(2,'0')} `+
            `${d.getHours().toString().padStart(2,'0')}:`+
            `${d.getMinutes().toString().padStart(2,'0')}:`+
            `${d.getSeconds().toString().padStart(2,'0')}`;
    }

    fetchAllData();
});
