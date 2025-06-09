document.addEventListener('DOMContentLoaded', function() {
    const tableBody = document.getElementById('ai-table-body');
    let originData = [];
    let filteredData = [];
    let currentPage = 0;
    let totalPages = 1;
    const pageSize = 20;
    let expandedRowId = null;
    let chartInstances = {};

    // 1. 서버에서 전체 데이터 한 번에 받아오기
    async function fetchAllData() {
        // page=0, size=10000 등 충분히 크게 요청 (데이터가 많으면 서버 필터/검색 API 사용 권장)
        const res = await fetch(`https://luckyseven.live/api/analysis-results/search?page=0&size=10000`, {
            method: 'GET',
            credentials: 'include'
        });
        if (!res.ok) {
            tableBody.innerHTML = '<tr><td colspan="4" style="text-align:center;">데이터를 불러올 수 없습니다.</td></tr>';
            return;
        }
        const data = await res.json();
        originData = data.content;
        filterAndRender(0); // 최초 렌더링
    }

    function showDetailLoading() {
        // 확장행이 열릴 자리에 로딩 표시 tr 추가
        const tr = document.createElement('tr');
        tr.className = 'expand-row loading-row';
        tr.innerHTML = `<td colspan="4">
        <div id="detail-loading" style="text-align:center; padding:2rem 0; font-size:1.2rem; color:#39a0ff;">
            <span class="spinner" style="display:inline-block; width:24px; height:24px; border:4px solid #eee; border-top:4px solid #39a0ff; border-radius:50%; animation:spin 1s linear infinite; vertical-align:middle;"></span>
            <span style="margin-left:0.5em;">상세 데이터 로딩중...</span>
        </div>
    </td>`;
        // 현재 클릭된 tr 바로 아래에 추가
        if (window.lastClickedTr) window.lastClickedTr.after(tr);
    }
    function hideDetailLoading() {
        document.querySelectorAll('.loading-row').forEach(tr => tr.remove());
    }

    // 2. 테이블 렌더링
    function renderTable(list) {
        tableBody.innerHTML = '';
        list.forEach(row => {
            const tr = document.createElement('tr');
            tr.style.cursor = "pointer";
            tr.innerHTML = `
                <td>${row.departmentName || '-'}</td>
                <td>${row.type || '-'}</td>
                <td>${row.resultSummary || '-'}</td>
                <td>${formatTimestamp(row.analyzedAt) || '-'}</td>
            `;
            tr.addEventListener('click', async function() {
                window.lastClickedTr = tr; // ★ 이 줄이 반드시 필요!
                if (expandedRowId === row.id) {
                    clearExpandRows();
                    return;
                }
                clearExpandRows();
                showDetailLoading(); // 로딩 표시
                const detail = await fetchDetail(row.id);
                hideDetailLoading(); // 로딩 숨김
                showDetail(detail, tr, row.id);
                expandedRowId = row.id;
            });
            tableBody.appendChild(tr);
        });
    }

    // 3. 상세 데이터 fetch 함수
    async function fetchDetail(id) {
        const res = await fetch(`https://luckyseven.live/api/analysis-results/${id}`, {
            method: 'GET',
            credentials: 'include'
        });
        if (!res.ok) {
            alert('상세 데이터를 불러올 수 없습니다.');
            return null;
        }
        return await res.json();
    }

    // 4. 페이지네이션 UI
    function renderPagination(totalPagesParam, currentPageParam) {
        let paginationDiv = document.getElementById('pagination');
        if (!paginationDiv) {
            paginationDiv = document.createElement('div');
            paginationDiv.id = 'pagination';
            paginationDiv.className = 'pagination-bar';
            tableBody.parentElement.appendChild(paginationDiv);
        }
        const total = totalPagesParam !== undefined ? totalPagesParam : totalPages;
        const page = currentPageParam !== undefined ? currentPageParam : currentPage;

        paginationDiv.innerHTML = `
        <button id="prevPage" ${page === 0 ? 'disabled' : ''}>이전</button>
        <span>${page + 1} / ${total} 페이지</span>
        <button id="nextPage" ${page === total - 1 ? 'disabled' : ''}>다음</button>
    `;
        document.getElementById('prevPage').onclick = () => {
            if (page > 0) filterAndRender(page - 1);
        };
        document.getElementById('nextPage').onclick = () => {
            if (page < total - 1) filterAndRender(page + 1);
        };
    }

    // 5. 밀리초 타임스탬프 변환 함수
    function formatTimestamp(ms) {
        if (!ms) return '-';
        let ts = String(ms);
        if (ts.length > 13) ts = ts.slice(0, 13);
        const date = new Date(Number(ts));
        if (isNaN(date.getTime())) return '-';
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        const hour = ('0' + date.getHours()).slice(-2);
        const min = ('0' + date.getMinutes()).slice(-2);
        const sec = ('0' + date.getSeconds()).slice(-2);
        return `${year}-${month}-${day} ${hour}:${min}:${sec}`;
    }

    function formatDateOnly(ms) {
        if (!ms) return '-';
        let ts = String(ms);
        if (ts.length > 13) ts = ts.slice(0, 13);
        const date = new Date(Number(ts));
        if (isNaN(date.getTime())) return '-';
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        return `${year}-${month}-${day}`;
    }

    // 6. 확장행, 차트 모두 제거
    function clearExpandRows() {
        document.querySelectorAll('.expand-row').forEach(tr => tr.remove());
        Object.values(chartInstances).forEach(inst => inst && inst.destroy && inst.destroy());
        chartInstances = {};
        expandedRowId = null;
    }

    // 7. 클라이언트 필터+페이징
    function filterAndRender(page = 0) {
        const form = document.getElementById('ai-search-form');
        const search = form.sensor.value.trim().toLowerCase();
        const type = form.type.value;
        const startDate = form['start-date'].value;
        const endDate = form['end-date'].value;

        // 필터 적용
        let filtered = originData;
        if (type) {
            filtered = filtered.filter(row => row.type === type);
        }
        if (search) {
            filtered = filtered.filter(row =>
                row.resultSummary && row.resultSummary.toLowerCase().includes(search)
            );
        }
        if (startDate) {
            filtered = filtered.filter(row => {
                const ts = typeof row.analyzedAt === 'number' ? row.analyzedAt : Date.parse(row.analyzedAt);
                return ts >= new Date(startDate).setHours(0,0,0,0);
            });
        }
        if (endDate) {
            filtered = filtered.filter(row => {
                const ts = typeof row.analyzedAt === 'number' ? row.analyzedAt : Date.parse(row.analyzedAt);
                return ts <= new Date(endDate).setHours(23,59,59,999);
            });
        }

        filteredData = filtered;
        const filteredTotalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
        currentPage = page;
        const pageData = filtered.slice(page * pageSize, (page + 1) * pageSize);
        renderTable(pageData);
        renderPagination(filteredTotalPages, currentPage);
    }

    // 8. 상세 보기(showDetail)는 기존 코드 그대로 사용 (paste-4.txt showDetail 포함)
    function showDetail(detail, baseTr, id) {
        if (!detail) return;

        // 1. resultJson 파싱 (JSON 문자열 → 객체)
        let result;
        try {
            result = detail.resultJson ? JSON.parse(detail.resultJson) : detail;
        } catch (e) {
            alert('상세 데이터 파싱 오류');
            return;
        }

        // 2. 분석타입별 분기
        const analysisType = result.type || result.analysisType;
        const isSingle = /SINGLE[-_]SENSOR[-_]PREDICT/i.test(analysisType);
        const isCorrelation = /CORRELATION[-_]RISK[-_]PREDICT/i.test(analysisType);
        const isThreshold = /THRESHOLD[-_]DIFF[-_]ANALYSIS/i.test(analysisType);

        // 3. 센서 정보 테이블
        let sensorInfoTable = '';
        if (isCorrelation && Array.isArray(result.sensorInfo)) {
            sensorInfoTable = `
                <table style="margin:0 auto 1rem auto; border-collapse:collapse; min-width:400px; font-size:1rem;">
                    <thead>
                        <tr style="background:#f3f4f6;">
                            <th style="padding:8px 16px; border:1px solid #e5e7eb;">센서명</th>
                            <th style="padding:8px 16px; border:1px solid #e5e7eb;">게이트웨이 ID</th>
                            <th style="padding:8px 16px; border:1px solid #e5e7eb;">센서 UUID</th>
                            <th style="padding:8px 16px; border:1px solid #e5e7eb;">센서타입</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${result.sensorInfo.map((info, idx) => `
                            <tr>
                                <td style="padding:8px 16px; border:1px solid #e5e7eb;">센서${idx + 1}</td>
                                <td style="padding:8px 16px; border:1px solid #e5e7eb;">${info.gatewayId}</td>
                                <td style="padding:8px 16px; border:1px solid #e5e7eb;">${info.sensorId}</td>
                                <td style="padding:8px 16px; border:1px solid #e5e7eb;">${info.sensorType}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <br><br>
            `;
        } else if ((isSingle || isThreshold) && result.sensorInfo) {
            const info = result.sensorInfo;
            sensorInfoTable = `
                <table style="margin:0 auto 1rem auto; border-collapse:collapse; min-width:400px; font-size:1rem;">
                    <thead>
                        <tr style="background:#f3f4f6;">
                            <th style="padding:8px 16px; border:1px solid #e5e7eb;">게이트웨이 ID</th>
                            <th style="padding:8px 16px; border:1px solid #e5e7eb;">센서 UUID</th>
                            <th style="padding:8px 16px; border:1px solid #e5e7eb;">센서타입</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding:8px 16px; border:1px solid #e5e7eb;">${info.gatewayId}</td>
                            <td style="padding:8px 16px; border:1px solid #e5e7eb;">${info.sensorId}</td>
                            <td style="padding:8px 16px; border:1px solid #e5e7eb;">${info.sensorType}</td>
                        </tr>
                    </tbody>
                </table>
                <br><br>
            `;
        }

        let html = `<td colspan="4">
    ${sensorInfoTable}
    <div style="display:flex; gap:2.5rem; align-items:center; justify-content:center; flex-wrap:wrap;">
`;

        if (isCorrelation && Array.isArray(result.predictedData)) {
            const sensors = result.predictedData.map(d => d.sensorInfo.sensorType);
            const corrRisk = result.predictedData.map(d => d.correlationRiskModel);
            html += `
        <div style="width:600px; height:auto; display:block; text-align:center;">
            <div style="height:320px;">
                <canvas id="bar-${id}" width="600" height="320"></canvas>
            </div>
            <div style="margin-top:1.5rem; min-height:2.5rem;">상관관계 위험도</div>
        </div>
        <div style="width:320px; height:auto; display:block; text-align:center;">
            <div style="height:320px;">
                <canvas id="pie-${id}" width="320" height="320"></canvas>
            </div>
            <div style="margin-top:1.5rem; min-height:2.5rem;">센서별 위험 비율</div>
        </div>
    `;
        } else if (isSingle && Array.isArray(result.predictedData)) {
            html += `
        <div style="width:600px; height:auto; display:block; text-align:center;">
            <div style="height:320px;">
                <canvas id="line-${id}" width="600" height="320"></canvas>
            </div>
            <div style="margin-top:1.5rem; min-height:2.5rem;">예측값 추이</div>
        </div>
    `;
        } else if (isThreshold && typeof result.healthScore === 'number') {
            const score = Math.round(result.healthScore * 100);
            html += `
        <div style="width:320px; height:200px; overflow:hidden; position:relative;">
            <canvas id="gauge-${id}" width="320" height="320"></canvas>
            <div style="position:absolute; left:0; right:0; top:110px; text-align:center; font-size:2.2rem; color:#39a0ff; font-weight:bold;">
                ${score}점
            </div>
            <div style="position:absolute; left:0; right:0; top:150px; text-align:center; color:#888;">healthScore</div>
        </div>
    `;
        }
        html += `</div>
</td>`;

        const expandTr = document.createElement('tr');
        expandTr.className = "expand-row";
        expandTr.innerHTML = html;
        baseTr.after(expandTr);

        setTimeout(() => {
            if (chartInstances[`bar-${id}`]) chartInstances[`bar-${id}`].destroy();
            if (chartInstances[`pie-${id}`]) chartInstances[`pie-${id}`].destroy();
            if (chartInstances[`line-${id}`]) chartInstances[`line-${id}`].destroy();
            if (chartInstances[`gauge-${id}`]) chartInstances[`gauge-${id}`].destroy();

            if (isCorrelation && Array.isArray(result.predictedData)) {
                const sensors = result.predictedData.map(d => d.sensorInfo.sensorType);
                const corrRisk = result.predictedData.map(d => d.correlationRiskModel);

                chartInstances[`bar-${id}`] = new Chart(document.getElementById(`bar-${id}`), {
                    type: 'bar',
                    data: {
                        labels: sensors,
                        datasets: [{
                            label: 'Correlation Risk',
                            data: corrRisk,
                            backgroundColor: 'rgba(255, 99, 132, 0.5)'
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false
                    }
                });

                chartInstances[`pie-${id}`] = new Chart(document.getElementById(`pie-${id}`), {
                    type: 'pie',
                    data: {
                        labels: sensors,
                        datasets: [{
                            data: corrRisk,
                            backgroundColor: ['#FF6384', '#36A2EB', '#4BC0C0', '#FFCE56']
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false
                    }
                });
            } else if (isSingle && Array.isArray(result.predictedData)) {
                const labels = result.predictedData.map(d => formatDateOnly(d.predictedDate));
                const data = result.predictedData.map(d => d.predictedValue);

                chartInstances[`line-${id}`] = new Chart(document.getElementById(`line-${id}`), {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Predicted Value',
                            data: data,
                            borderColor: '#4BC0C0'
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false
                    }
                });
            } else if (isThreshold && typeof result.healthScore === 'number') {
                const score = Math.round(result.healthScore * 100); // 0~100

                chartInstances[`gauge-${id}`] = new Chart(document.getElementById(`gauge-${id}`), {
                    type: 'doughnut',
                    data: {
                        datasets: [{
                            data: [score, 100 - score],
                            backgroundColor: ['#39a0ff', '#e5e7eb'],
                            borderWidth: 0
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        cutout: '70%',
                        rotation: -90,
                        circumference: 180,
                        plugins: {
                            legend: { display: false },
                            tooltip: { enabled: false }
                        }
                    },
                });
            }
        }, 0);
    }

    // 9. 검색 폼 이벤트 등록
    document.getElementById('ai-search-form').addEventListener('submit', function(e) {
        e.preventDefault();
        filterAndRender(0); // 필터 적용 시 항상 첫 페이지로 이동
    });

    // 10. 최초 진입
    fetchAllData();
});
