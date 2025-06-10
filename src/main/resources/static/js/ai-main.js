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
        console.log("data: ",data.content);
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

    // 3) 센서 테이블 + 차트 렌더링
    function renderCharts(detail) {
        let result;
        try {
            result = detail.resultJson ? JSON.parse(detail.resultJson) : detail;
        } catch {
            container.innerText = '파싱 오류';
            return;
        }
        const isCorrelation = /CORRELATION[-_]RISK[-_]PREDICT/i.test(result.type);
        if (!isCorrelation || !Array.isArray(result.predictedData)) {
            container.innerText = '지원하지 않는 분석 타입';
            return;
        }

        // 초기화
        container.innerHTML = '';

        // — 센서 정보 테이블
        const tableHtml = `
      <table style="
          margin:0 auto 1rem auto;
          border-collapse:collapse;
          min-width:400px;
          font-size:1rem;
      ">
        <thead>
          <tr style="background:#f3f4f6;">
            <th style="padding:8px 16px; border:1px solid #e5e7eb;">센서명</th>
            <th style="padding:8px 16px; border:1px solid #e5e7eb;">게이트웨이 ID</th>
            <th style="padding:8px 16px; border:1px solid #e5e7eb;">센서 UUID</th>
            <th style="padding:8px 16px; border:1px solid #e5e7eb;">센서타입</th>
          </tr>
        </thead>
        <tbody>
          ${result.sensorInfo.map((info, i) => `
            <tr>
              <td style="padding:8px 16px; border:1px solid #e5e7eb;">센서${i+1}</td>
              <td style="padding:8px 16px; border:1px solid #e5e7eb;">${info.gatewayId}</td>
              <td style="padding:8px 16px; border:1px solid #e5e7eb;">${info.sensorId}</td>
              <td style="padding:8px 16px; border:1px solid #e5e7eb;">${info.sensorType}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
        container.insertAdjacentHTML('beforeend', tableHtml);

        // — 차트 래퍼
        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.gap = '2.5rem';
        wrapper.style.alignItems = 'center';
        wrapper.style.justifyContent = 'center';
        wrapper.style.flexWrap = 'wrap';
        container.appendChild(wrapper);

        // 데이터
        const labels = result.predictedData.map(d => d.sensorInfo.sensorType);
        const values = result.predictedData.map(d => d.correlationRiskModel);

        // — 막대차트
        const barDiv = document.createElement('div');
        barDiv.style.width = '600px';
        barDiv.style.height = '320px';
        const barCanvas = document.createElement('canvas');
        barCanvas.id = 'bar-latest';
        barDiv.appendChild(barCanvas);
        wrapper.appendChild(barDiv);

        new Chart(barCanvas, {
            type: 'bar',
            data: { labels, datasets: [{ label: 'Correlation Risk', data: values }] },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });

        // — 원형차트
        const pieDiv = document.createElement('div');
        pieDiv.style.width = '320px';
        pieDiv.style.height = '320px';
        const pieCanvas = document.createElement('canvas');
        pieCanvas.id = 'pie-latest';
        pieDiv.appendChild(pieCanvas);
        wrapper.appendChild(pieDiv);

        new Chart(pieCanvas, {
            type: 'pie',
            data: { labels, datasets: [{ data: values }] },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top' }
                }
            }
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
