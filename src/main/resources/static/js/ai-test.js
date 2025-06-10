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

    // 2) 최신 두 타입 결과 호출
    let list;
    try {
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

    // 3) 화면 초기화 및 wrapper 생성
    container.innerHTML = '';
    const wrapper = document.createElement('div');
    Object.assign(wrapper.style, {
        display: 'flex',
        gap: '2rem',
        justifyContent: 'space-around',
        flexWrap: 'wrap'
    });
    container.appendChild(wrapper);

    // 4) 각 결과별 카드 렌더링
    list.forEach(detail => {
        let result;
        try {
            result = detail.resultJson ? JSON.parse(detail.resultJson) : detail;
        } catch {
            console.warn('파싱 오류', detail);
            return;
        }

        const type = result.type || result.analysisType;
        const isCorr   = /CORRELATION[-_]RISK[-_]PREDICT/i.test(type);
        const isSingle = /SINGLE[-_]SENSOR[-_]PREDICT/i.test(type);

        // 카드 컨테이너
        const card = document.createElement('div');
        card.className = 'chart-box';
        Object.assign(card.style, {
            width: '48%',
            maxWidth: '600px',
            padding: '1rem',
            boxSizing: 'border-box'
        });
        wrapper.appendChild(card);

        // 제목
        const h4 = document.createElement('h4');
        h4.style.textAlign = 'center';
        h4.style.marginBottom = '1rem';
        h4.textContent = isCorr
            ? '상관관계 위험도 (최신)'
            : isSingle
                ? '예측값 추이 (최신)'
                : '지원되지 않는 분석 타입';
        card.appendChild(h4);

        // 센서 정보 테이블
        if (isCorr && Array.isArray(result.sensorInfo)) {
            const table = document.createElement('table');
            Object.assign(table.style, {
                margin: '0 auto 1rem',
                borderCollapse: 'collapse',
                fontSize: '0.9rem',
                width: '100%'
            });
            table.innerHTML = `
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
      `;
            card.appendChild(table);
        } else if (isSingle && result.sensorInfo) {
            const info = result.sensorInfo;
            const table = document.createElement('table');
            Object.assign(table.style, {
                margin: '0 auto 1rem',
                borderCollapse: 'collapse',
                fontSize: '0.9rem',
                width: '100%'
            });
            table.innerHTML = `
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
      `;
            card.appendChild(table);
        }

        // 차트 영역
        const chartWrapper = document.createElement('div');
        Object.assign(chartWrapper.style, {
            display: 'flex',
            gap: '2rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
        });
        card.appendChild(chartWrapper);

        // Bar + Pie (Correlation)
        if (isCorr && Array.isArray(result.predictedData)) {
            const labels = result.predictedData.map(d => d.sensorInfo.sensorType);
            const data   = result.predictedData.map(d => d.correlationRiskModel);

            // Bar
            const barCan = document.createElement('canvas');
            Object.assign(barCan.style, { width: '600px', height: '320px' });
            chartWrapper.appendChild(barCan);
            new Chart(barCan.getContext('2d'), {
                type: 'bar',
                data: { labels, datasets: [{ label: 'Risk', data }] },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        datalabels: {
                            anchor: 'end',
                            align: 'end',
                            formatter: v => v.toFixed(2),
                            font: { weight: 'bold' }
                        }
                    }
                },
                plugins: [ChartDataLabels]
            });

            // Pie
            const pieCan = document.createElement('canvas');
            Object.assign(pieCan.style, { width: '320px', height: '320px' });
            chartWrapper.appendChild(pieCan);
            new Chart(pieCan.getContext('2d'), {
                type: 'pie',
                data: { labels, datasets: [{ data }] },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'top' },
                        datalabels: {
                            color: '#fff',
                            formatter: v => v.toFixed(2),
                            font: { weight: 'bold' }
                        }
                    }
                },
                plugins: [ChartDataLabels]
            });

            // Line (Single)
        } else if (isSingle && Array.isArray(result.predictedData)) {
            const labels = result.predictedData.map(d => {
                const dt = new Date(d.predictedDate);
                return `${dt.getFullYear()}-${dt.getMonth()+1}-${dt.getDate()}`;
            });
            const data = result.predictedData.map(d => d.predictedValue);

            const lineCan = document.createElement('canvas');
            Object.assign(lineCan.style, { width: '100%', height: '320px' });
            chartWrapper.appendChild(lineCan);
            new Chart(lineCan.getContext('2d'), {
                type: 'line',
                data: { labels, datasets: [{ label: 'Predicted', data, tension: 0.3 }] },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                        // datalabels 옵션 없으므로 라벨이 표시되지 않음
                    }
                }
                // plugins 배열에 ChartDataLabels 없음
            });
        }
    });
});