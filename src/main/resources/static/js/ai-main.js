// datalabels 플러그인 등록
Chart.register(ChartDataLabels);

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('latest-ai-chart-container');

    // 1) 최신 1건 조회
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

    // 2) 상세 조회
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

    // 3) 렌더링
    (async () => {
        container.innerText = '로딩 중…';
        const latest = await fetchLatestItem();
        if (!latest) return;
        const detail = await fetchDetail(latest.id);
        if (!detail) return;

        let result;
        try { result = detail.resultJson ? JSON.parse(detail.resultJson) : detail; }
        catch { container.innerText = '파싱 오류'; return; }

        const isCorrelation = /CORRELATION[-_]RISK[-_]PREDICT/i.test(result.type);
        if (!isCorrelation || !Array.isArray(result.predictedData)) {
            container.innerText = '지원하지 않는 분석 타입';
            return;
        }

        // --- 컨테이너 초기화
        container.innerHTML = '';

        // --- 1) 센서 정보 테이블 (원본 showDetail 인라인 스타일 그대로)
        const tableHTML = `
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
          ${result.sensorInfo.map((info, idx) => `
            <tr>
              <td style="padding:8px 16px; border:1px solid #e5e7eb;">센서${idx+1}</td>
              <td style="padding:8px 16px; border:1px solid #e5e7eb;">${info.gatewayId}</td>
              <td style="padding:8px 16px; border:1px solid #e5e7eb;">${info.sensorId}</td>
              <td style="padding:8px 16px; border:1px solid #e5e7eb;">${info.sensorType}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <br><br>
    `;
        container.insertAdjacentHTML('beforeend', tableHTML);

        // --- 2) 차트 래퍼 (원본 showDetail 스타일)
        const wrapper = document.createElement('div');
        wrapper.style.cssText = `
      display:flex;
      gap:2.5rem;
      align-items:center;
      justify-content:center;
      flex-wrap:wrap;
    `;
        container.appendChild(wrapper);

        // 데이터
        const labels = result.predictedData.map(d => d.sensorInfo.sensorType);
        const values = result.predictedData.map(d => d.correlationRiskModel);

        // --- 3) 막대 차트
        const barDiv = document.createElement('div');
        barDiv.style.cssText = 'width:600px; height:auto; display:block; text-align:center;';
        barDiv.innerHTML = `
      <div style="height:320px;">
        <canvas id="bar-latest"></canvas>
      </div>
      <div style="margin-top:1.5rem; min-height:2.5rem;">상관관계 위험도</div>
    `;
        wrapper.appendChild(barDiv);
        new Chart(
            document.getElementById('bar-latest'),
            { type:'bar', data:{labels,datasets:[{label:'Correlation Risk',data:values}]}, options:{responsive:true,maintainAspectRatio:false} }
        );

        // --- 4) 원형 차트
        const pieDiv = document.createElement('div');
        pieDiv.style.cssText = 'width:320px; height:auto; display:block; text-align:center;';
        pieDiv.innerHTML = `
      <div style="height:320px;">
        <canvas id="pie-latest"></canvas>
      </div>
      <div style="margin-top:1.5rem; min-height:2.5rem;">센서별 위험 비율</div>
    `;
        wrapper.appendChild(pieDiv);
        new Chart(
            document.getElementById('pie-latest'),
            { type:'pie', data:{labels,datasets:[{data:values}]}, options:{responsive:true,maintainAspectRatio:false} }
        );
    })();
});
