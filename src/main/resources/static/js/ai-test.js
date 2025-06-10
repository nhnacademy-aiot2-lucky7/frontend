// latest-department-charts.js
Chart.register(ChartDataLabels);

document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('latest-ai-chart-container');
    if (!container) return;

    // 1) departmentId 가져오기
    const departmentId = window.currentUser && window.currentUser.department && window.currentUser.department.departmentId;
    if (!departmentId) {
        container.innerText = '부서 정보가 없습니다.';
        return;
    }

    // 2) 최신 두 타입 결과 가져오기
    let results;
    try {
        const res = await fetch(`https://luckyseven.live/api/analysis-results/${departmentId}/latest`, {
            credentials: 'include'
        });
        if (!res.ok) throw new Error(res.statusText);
        results = await res.json();  // [ AnalysisResultResponse, ... ]
    } catch (e) {
        container.innerText = '최신 결과를 가져오는데 실패했습니다.';
        console.error(e);
        return;
    }

    container.innerHTML = ''; // 초기화

    // 3) 각 결과별로 렌더링
    results.forEach((detail, idx) => {
        // 3-1) parse resultJson
        let result;
        try {
            result = detail.resultJson ? JSON.parse(detail.resultJson) : detail;
        } catch {
            console.error('resultJson 파싱 오류', detail);
            return;
        }

        // 3-2) 분석 타입 판별
        const type = result.type || result.analysisType;
        const isCorrelation = /CORRELATION[-_]RISK[-_]PREDICT/i.test(type);
        const isSingle      = /SINGLE[-_]SENSOR[-_]PREDICT/i.test(type);
        const isThreshold   = /THRESHOLD[-_]DIFF[-_]ANALYSIS/i.test(type);

        // 3-3) 섹션 틀 만들기
        const section = document.createElement('section');
        section.style.margin = '2rem 0';
        section.innerHTML = `<h3 style="text-align:center;">${isCorrelation ? '상관관계 위험도' : isSingle ? '예측값 추이' : 'Threshold 분석'} (최신)</h3>`;
        container.appendChild(section);

        // 3-4) 센서 정보 테이블 (필요 시)
        let tableHtml = '';
        if (isCorrelation && Array.isArray(result.sensorInfo)) {
            tableHtml = `
        <table style="margin:0 auto 1rem; border-collapse:collapse; font-size:0.9rem;">
          <thead>
            <tr style="background:#f3f4f6;">
              <th style="padding:4px 8px;border:1px solid #ddd;">센서명</th>
              <th style="padding:4px 8px;border:1px solid #ddd;">게이트웨이 ID</th>
              <th style="padding:4px 8px;border:1px solid #ddd;">센서 UUID</th>
              <th style="padding:4px 8px;border:1px solid #ddd;">센서타입</th>
            </tr>
          </thead>
          <tbody>
            ${result.sensorInfo.map((info,i) => `
              <tr>
                <td style="padding:4px 8px;border:1px solid #ddd;">센서${i+1}</td>
                <td style="padding:4px 8px;border:1px solid #ddd;">${info.gatewayId}</td>
                <td style="padding:4px 8px;border:1px solid #ddd;">${info.sensorId}</td>
                <td style="padding:4px 8px;border:1px solid #ddd;">${info.sensorType}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
        } else if ((isSingle || isThreshold) && result.sensorInfo) {
            const info = result.sensorInfo;
            tableHtml = `
        <table style="margin:0 auto 1rem; border-collapse:collapse; font-size:0.9rem;">
          <thead>
            <tr style="background:#f3f4f6;">
              <th style="padding:4px 8px;border:1px solid #ddd;">게이트웨이 ID</th>
              <th style="padding:4px 8px;border:1px solid #ddd;">센서 UUID</th>
              <th style="padding:4px 8px;border:1px solid #ddd;">센서타입</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding:4px 8px;border:1px solid #ddd;">${info.gatewayId}</td>
              <td style="padding:4px 8px;border:1px solid #ddd;">${info.sensorId}</td>
              <td style="padding:4px 8px;border:1px solid #ddd;">${info.sensorType}</td>
            </tr>
          </tbody>
        </table>
      `;
        }
        if (tableHtml) section.insertAdjacentHTML('beforeend', tableHtml);

        // 3-5) 차트 컨테이너 생성
        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.gap = '2rem';
        wrapper.style.justifyContent = 'center';
        wrapper.style.flexWrap = 'wrap';
        section.appendChild(wrapper);

        // 3-6) 차트 그리기
        if (isCorrelation && Array.isArray(result.predictedData)) {
            const labels = result.predictedData.map(d => d.sensorInfo.sensorType);
            const values = result.predictedData.map(d => d.correlationRiskModel);

            // Bar
            const barCan = document.createElement('canvas');
            barCan.style.width = '600px'; barCan.style.height = '320px';
            wrapper.appendChild(barCan);
            new Chart(barCan.getContext('2d'), {
                type:'bar',
                data:{ labels, datasets:[{ label:'Risk', data:values }]},
                options:{ responsive:true, maintainAspectRatio:false }
            });

            // Pie
            const pieCan = document.createElement('canvas');
            pieCan.style.width = '320px'; pieCan.style.height = '320px';
            wrapper.appendChild(pieCan);
            new Chart(pieCan.getContext('2d'), {
                type:'pie',
                data:{ labels, datasets:[{ data:values }]},
                options:{
                    responsive:true,
                    maintainAspectRatio:false,
                    plugins:{ legend:{ position:'top' } }
                }
            });

        } else if (isSingle && Array.isArray(result.predictedData)) {
            const labels = result.predictedData.map(d => {
                const dt = new Date(d.predictedDate);
                return `${dt.getFullYear()}-${dt.getMonth()+1}-${dt.getDate()}`;
            });
            const values = result.predictedData.map(d => d.predictedValue);

            const can = document.createElement('canvas');
            can.style.width = '100%'; can.style.height = '320px';
            wrapper.appendChild(can);
            new Chart(can.getContext('2d'), {
                type:'line',
                data:{ labels, datasets:[{ label:'Predicted', data:values, tension:0.3 }]},
                options:{ responsive:true, maintainAspectRatio:false }
            });
        }
        // (Threshold 타입 렌더링 필요 시 이 자리에 추가)
    });
});
