document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('latest-ai-chart-container');
    if (!container) return;

    const departmentId = window.currentUser?.department?.departmentId;
    if (!departmentId) {
        container.innerText = '부서 정보가 없습니다.';
        return;
    }

    let list;
    try {
        const res = await fetch(
            `https://luckyseven.live/api/analysis-results/${departmentId}/latest`,
            { credentials: 'include' }
        );
        if (!res.ok) throw new Error(res.statusText);
        list = await res.json();
        console.log("list : ", list);
    } catch (err) {
        console.error(err);
        container.innerText = '최신 결과 조회에 실패했습니다.';
        return;
    }

    // single·correlation 분리
    const items = [
        {
            key: 'single',
            title: 'Single Sensor 예측',
            data: list.find(i => {
                try {
                    return JSON.parse(i.resultJson).type === 'SINGLE_SENSOR_PREDICT';
                } catch {
                    return false;
                }
            })
        },
        {
            key: 'corr',
            title: 'Correlation Risk 예측',
            data: list.find(i => {
                try {
                    return JSON.parse(i.resultJson).type === 'CORRELATION_RISK_PREDICT';
                } catch {
                    return false;
                }
            })
        }
    ];

    items.forEach(({ key, title, data }) => {
        if (data) renderCard(data, key, title);
    });

    // — 카드 생성 + showDetail 호출
    function renderCard(detail, prefix, title) {
        // 카드 뼈대 만들기
        const card = document.createElement('div');
        card.className = 'analysis-card';
        card.innerHTML = `
      <div class="card-header">${title}</div>
      <div class="card-body" id="card-body-${prefix}">
        <!-- loading 표시 -->
        <div class="loading">데이터 로딩 중...</div>
      </div>
    `;
        container.appendChild(card);

        // 실제 내용 렌더
        showDetail(detail, prefix, document.getElementById(`card-body-${prefix}`));
    }

    // — 데이터 파싱 후 HTML 삽입 + 차트 그리기
    function showDetail(detail, prefix, bodyEl) {
        let result;
        try {
            result = detail.resultJson ? JSON.parse(detail.resultJson) : detail;
        } catch (e) {
            bodyEl.innerHTML = `<div class="error">데이터 파싱 오류</div>`;
            return;
        }

        // 1) 표 HTML
        let tableHtml = '';
        const si = result.sensorInfo;
        if (Array.isArray(si)) {
            tableHtml = `
        <table class="sensor-table">
          <thead>
            <tr><th>센서명</th><th>게이트웨이</th><th>UUID</th><th>타입</th></tr>
          </thead>
          <tbody>
            ${si.map((info,i)=>`
              <tr>
                <td>센서${i+1}</td>
                <td>${info.gatewayId}</td>
                <td>${info.sensorId}</td>
                <td>${info.sensorType}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>`;
        } else if (si) {
            tableHtml = `
        <table class="sensor-table">
          <thead>
            <tr><th>게이트웨이</th><th>UUID</th><th>타입</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>${si.gatewayId}</td>
              <td>${si.sensorId}</td>
              <td>${si.sensorType}</td>
            </tr>
          </tbody>
        </table>`;
        }

        // 2) 차트 캔버스 HTML
        let chartsHtml = '';
        if (/SINGLE_SENSOR_PREDICT/i.test(result.type) && Array.isArray(result.predictedData)) {
            chartsHtml = `
        <div class="chart-wrapper">
          <canvas id="${prefix}-line" width="800" height="250"></canvas>
          <div class="chart-label">예측값 추이</div>
        </div>`;
        } else if (/CORRELATION_RISK_PREDICT/i.test(result.type) && Array.isArray(result.predictedData)) {
            chartsHtml = `
        <div class="chart-wrapper">
          <canvas id="${prefix}-bar" width="500" height="200"></canvas>
          <div class="chart-label">상관관계 위험도</div>
        </div>
        <div class="chart-wrapper">
          <canvas id="${prefix}-pie" width="300" height="300"></canvas>
          <div class="chart-label">센서별 위험 비율</div>
        </div>`;
        }

        // 3) 본문에 삽입
        bodyEl.innerHTML = `
      ${tableHtml}
      <div class="charts-container">
        ${chartsHtml}
      </div>
    `;

        // 4) 차트 생성 (setTimeout 없이도 잘 된다면 빼셔도 OK)
        setTimeout(() => {
            if (chartsHtml.includes(`${prefix}-line`)) {
                const data = result.predictedData.slice(0, 210);
                new Chart(document.getElementById(`${prefix}-line`), {
                    type: 'line',
                    data: {
                        labels: data.map(d=>formatDate(d.predictedDate)),
                        datasets: [{ label:'Predicted', data: data.map(d=>d.predictedValue), borderWidth:2, pointRadius:2 }]
                    },
                    options: { scales:{ x:{ ticks:{ autoSkip:true, maxTicksLimit:10 } } } }
                });
            }
            if (chartsHtml.includes(`${prefix}-bar`)) {
                const pd = result.predictedData;
                const labels = pd.map(d=>d.sensorInfo.sensorType);
                const values = pd.map(d=>d.singleRiskModel);
                new Chart(document.getElementById(`${prefix}-bar`), {
                    type:'bar',
                    data:{ labels, datasets:[{ label:'Risk', data:values }] },
                    options:{ responsive:true }
                });
                new Chart(document.getElementById(`${prefix}-pie`), {
                    type:'pie',
                    data:{ labels, datasets:[{ data: pd.map(d=>d.correlationRiskModel) }] },
                    options:{ responsive:true }
                });
            }
        }, 0);
    }

    function formatDate(iso) {
        const d = new Date(iso);
        return `${d.getFullYear()}-${('0'+(d.getMonth()+1)).slice(-2)}-${('0'+d.getDate()).slice(-2)}`;
    }
});
