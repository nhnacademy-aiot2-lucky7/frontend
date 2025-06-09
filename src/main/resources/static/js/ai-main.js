// datalabels 플러그인 등록
Chart.register(ChartDataLabels);

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('latest-ai-chart-container');

    // 1) 최신 1건만 리스트 조회
    async function fetchLatestItem() {
        const res = await fetch(
            'https://luckyseven.live/api/analysis-results/search?page=0&size=1',
            { credentials: 'include' }
        );
        if (!res.ok) {
            container.innerText = '리스트 조회 실패';
            return null;
        }
        const data = await res.json();
        return data.content?.[0] || null;
    }

    // 2) 상세 데이터 조회
    async function fetchDetail(id) {
        const res = await fetch(
            `https://luckyseven.live/api/analysis-results/${id}`,
            { credentials: 'include' }
        );
        if (!res.ok) {
            container.innerText = '상세 조회 실패';
            return null;
        }
        return res.json();
    }

    // 3) 차트 그리기
    function renderCharts(detail) {
        let result;
        try {
            result = detail.resultJson ? JSON.parse(detail.resultJson) : detail;
        } catch {
            return container.innerText = '파싱 오류';
        }

        // CORRELATION_RISK_PREDICT만 처리
        if (!Array.isArray(result.predictedData)
            || !/CORRELATION[-_]RISK[-_]PREDICT/i.test(result.type)) {
            return container.innerText = '지원하지 않는 분석 타입';
        }

        // 컨테이너 초기화
        container.innerHTML = '';

        // 1) 센서 정보 테이블 생성
        const table = document.createElement('table');
        table.style.borderCollapse = 'collapse';
        table.style.marginBottom = '1rem';
        table.innerHTML = `
    <thead>
      <tr>
        <th style="border:1px solid #ccc; padding:4px 8px;">센서명</th>
        <th style="border:1px solid #ccc; padding:4px 8px;">게이트웨이 ID</th>
        <th style="border:1px solid #ccc; padding:4px 8px;">센서 UUID</th>
        <th style="border:1px solid #ccc; padding:4px 8px;">센서타입</th>
      </tr>
    </thead>
  `;
        const body = document.createElement('tbody');
        result.sensorInfo.forEach((info, idx) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
      <td style="border:1px solid #ccc; padding:4px 8px;">센서${idx+1}</td>
      <td style="border:1px solid #ccc; padding:4px 8px;">${info.gatewayId}</td>
      <td style="border:1px solid #ccc; padding:4px 8px;">${info.sensorId}</td>
      <td style="border:1px solid #ccc; padding:4px 8px;">${info.sensorType}</td>
    `;
            body.appendChild(tr);
        });
        table.appendChild(body);
        container.appendChild(table);

        // 2) 데이터 준비
        const labels = result.predictedData.map(d => d.sensorInfo.sensorType);
        const values = result.predictedData.map(d => d.correlationRiskModel);

        // 3) 캔버스 생성 및 차트 그리기
        // 막대
        const barCanvas = document.createElement('canvas');
        barCanvas.style.flex = '1';
        container.appendChild(barCanvas);

        new Chart(barCanvas, {
            type: 'bar',
            data: { labels, datasets: [{ label: '위험도', data: values }] },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    datalabels: { anchor:'end', align:'end', formatter:v=>v.toFixed(2) }
                }
            },
            plugins: [ChartDataLabels]
        });

        // 원형
        const pieCanvas = document.createElement('canvas');
        pieCanvas.style.width = '200px';
        container.appendChild(pieCanvas);

        new Chart(pieCanvas, {
            type: 'pie',
            data: { labels, datasets:[{ data: values }] },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    datalabels: { formatter:v=>v.toFixed(2) }
                }
            },
            plugins: [ChartDataLabels]
        });
    }

    // 4) 초기 실행
    (async () => {
        container.innerText = '로딩 중…';
        const latest = await fetchLatestItem();
        if (!latest) return;
        const detail = await fetchDetail(latest.id);
        if (!detail) return;
        renderCharts(detail);
    })();
});
