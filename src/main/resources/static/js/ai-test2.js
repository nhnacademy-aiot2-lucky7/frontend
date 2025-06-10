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
        // 백틱으로 감싸기
        const res = await fetch(`https://luckyseven.live/api/analysis-results/${departmentId}/latest`, {
            credentials: 'include'
        });
        if (!res.ok) throw new Error(res.statusText);
        list = await res.json();
    } catch (err) {
        console.error(err);
        container.innerText = '최신 결과 조회에 실패했습니다.';
        return;
    }

    const single = list.find(item => item.analysisType === "SINGLE_SENSOR_PREDICT");
    const correlation = list.find(item => item.analysisType === "CORRELATION_RISK_PREDICT");

    if (single) showDetail(single, 'single');
    if (correlation) showDetail(correlation, 'corr');

    function showDetail(detail, prefix) {
        let result;
        try {
            result = detail.resultJson ? JSON.parse(detail.resultJson) : detail;
        } catch (e) {
            console.error('파싱 오류', e);
            return;
        }

        // 2) 센서 정보 표 만들기
        let sensorInfoHtml = '';
        if (Array.isArray(result.sensorInfo)) {
            sensorInfoHtml = `
        <table class="sensor-table">
          <thead>
            <tr>
              <th>센서명</th><th>게이트웨이 ID</th>
              <th>센서 UUID</th><th>타입</th>
            </tr>
          </thead>
          <tbody>
            ${result.sensorInfo.map((info,i) => `
              <tr>
                <td>센서${i+1}</td>
                <td>${info.gatewayId}</td>
                <td>${info.sensorId}</td>
                <td>${info.sensorType}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
        } else if (result.sensorInfo) {
            const info = result.sensorInfo;
            sensorInfoHtml = `
        <table class="sensor-table">
          <thead>
            <tr>
              <th>게이트웨이 ID</th><th>센서 UUID</th><th>타입</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${info.gatewayId}</td>
              <td>${info.sensorId}</td>
              <td>${info.sensorType}</td>
            </tr>
          </tbody>
        </table>
      `;
        }

        // 3) 차트 캔버스 영역 추가
        let chartsHtml = '';
        if (/SINGLE_SENSOR_PREDICT/i.test(result.analysisType) && Array.isArray(result.predictedData)) {
            chartsHtml = `
                <div class="chart-wrapper">
                    <canvas id="${prefix}-line" width="1300" height="320"></canvas>
                    <div class="chart-label">예측값 추이</div>
                </div>
            `;
        } else if (/CORRELATION_RISK_PREDICT/i.test(result.analysisType) && Array.isArray(result.predictedData)) {
            chartsHtml = `
                <div class="chart-wrapper">
                    <canvas id="${prefix}-bar" width="600" height="320"></canvas>
                    <div class="chart-label">상관관계 위험도</div>
                </div>
                <div class="chart-wrapper">
                    <canvas id="${prefix}-pie" width="320" height="320"></canvas>
                    <div class="chart-label">센서별 위험 비율</div>
                </div>
            `;
        } else if (/THRESHOLD_DIFF_ANALYSIS/i.test(result.analysisType) && typeof result.healthScore === 'number') {
            const score = Math.round(result.healthScore * 100);
            chartsHtml = `
                <div class="chart-wrapper gauge-container">
                    <canvas id="${prefix}-gauge" width="320" height="320"></canvas>
                    <div class="gauge-label">${score}점</div>
                </div>
            `;
        }

        // 4) container에 한번에 붙이기
        container.insertAdjacentHTML('beforeend', `
          <section class="analysis-block">
            ${sensorInfoHtml}
            <div class="charts-container">
              ${chartsHtml}
            </div>
      </section>
    `);

        // 5) 차트 생성
        setTimeout(() => {
            if (/SINGLE_SENSOR_PREDICT/i.test(result.analysisType)) {
                const weekData = result.predictedData.slice(0, 210);
                const labels = weekData.map(d => formatDateOnly(d.predictedDate));
                const data = weekData.map(d => d.predictedValue);
                new Chart(document.getElementById(`${prefix}-line`), {
                    type: 'line',
                    data: {
                        labels,
                        datasets: [{ label: 'Predicted', data, borderWidth: 2, pointRadius: 2 }]
                    },
                    options: { scales: { x: { ticks: { autoSkip: true, maxTicksLimit: 10 } } } }
                });
            }
            if (/CORRELATION_RISK_PREDICT/i.test(result.analysisType)) {
                const sensors = result.predictedData.map(d => d.sensorInfo.sensorType);
                const singleRisk = result.predictedData.map(d => d.singleRiskModel);
                const corrRisk = result.predictedData.map(d => d.correlationRiskModel);

                new Chart(document.getElementById(`${prefix}-bar`), {
                    type: 'bar',
                    data: { labels: sensors, datasets: [{ label: 'Correlation Risk', data: singleRisk }] },
                    options: {}
                });
                new Chart(document.getElementById(`${prefix}-pie`), {
                    type: 'pie',
                    data: { labels: sensors, datasets: [{ data: corrRisk }] },
                    options: {}
                });
            }
            if (/THRESHOLD_DIFF_ANALYSIS/i.test(result.analysisType)) {
                const score = Math.round(result.healthScore * 100);
                new Chart(document.getElementById(`${prefix}-gauge`), {
                    type: 'doughnut',
                    data: { datasets: [{ data: [score, 100 - score] }] },
                    options: { cutout: '70%', rotation: -90, circumference: 180, plugins: { legend: { display: false } } }
                });
            }
        }, 0);
    }

    // 날짜 포맷 헬퍼
    function formatDateOnly(iso) {
        const d = new Date(iso);
        return `${d.getFullYear()}-${('0'+(d.getMonth()+1)).slice(-2)}-${('0'+d.getDate()).slice(-2)}`;
    }
});
