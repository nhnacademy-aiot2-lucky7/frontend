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

    container.innerHTML = '';
    const wrapper = document.createElement('div');
    Object.assign(wrapper.style, {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',         // 👉 가운데 정렬
        gap: '2rem',
        minHeight: '800px'                // 👉 wrapper 높이 확장
    });
    container.appendChild(wrapper);

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

        const card = document.createElement('div');
        card.className = 'chart-box';
        Object.assign(card.style, {
            flex: '1 1 90%',
            display: 'flex',
            flexDirection: 'column',
            padding: '1rem',
            boxSizing: 'border-box',
            border: '1px solid #ddd',
            borderRadius: '8px',
            background: '#fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            minWidth: '600px',
            maxWidth: '1200px',
            marginBottom: '1rem'
        });
        wrapper.appendChild(card);

        const h4 = document.createElement('h4');
        h4.style.textAlign = 'center';
        h4.style.marginBottom = '1rem';
        h4.textContent = isCorr
            ? '상관관계 위험도 (최신)'
            : isSingle
                ? '예측값 추이 (최신)'
                : '지원되지 않는 분석 타입';
        card.appendChild(h4);

        // 테이블 공통 스타일
        const tableStyle = {
            margin: '0 auto 1rem',
            borderCollapse: 'collapse',
            fontSize: '0.9rem',
            width: '100%'
        };

        // 센서 테이블 생성
        if (isCorr && Array.isArray(result.sensorInfo)) {
            const table = document.createElement('table');
            Object.assign(table.style, tableStyle);
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
            Object.assign(table.style, tableStyle);
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

        // 차트 wrapper
        const chartWrapper = document.createElement('div');
        Object.assign(chartWrapper.style, {
            display: 'flex',
            flexDirection: isCorr ? 'row' : 'column',   // 👉 Corr: row / Single: column
            gap: '1.5rem',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            flexWrap: 'wrap'
        });
        card.appendChild(chartWrapper);

        // Corr 차트 (bar + pie 좌우 배치)
        if (isCorr && Array.isArray(result.predictedData)) {
            const labels = result.predictedData.map(d => d.sensorInfo.sensorType);
            const data   = result.predictedData.map(d => d.correlationRiskModel);

            const barDiv = document.createElement('div');
            Object.assign(barDiv.style, {
                width: '100%',
                maxWidth: '500px',
                height: '320px'
            });
            const barCan = document.createElement('canvas');
            barDiv.appendChild(barCan);
            chartWrapper.appendChild(barDiv);

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

            const pieDiv = document.createElement('div');
            Object.assign(pieDiv.style, {
                width: '100%',
                maxWidth: '400px',
                height: '320px'
            });
            const pieCan = document.createElement('canvas');
            pieDiv.appendChild(pieCan);
            chartWrapper.appendChild(pieDiv);

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

            // Single 차트 (line 하나만 위아래 배치)
        } else if (isSingle && Array.isArray(result.predictedData)) {
            const labels = result.predictedData.map(d => {
                const dt = new Date(d.predictedDate);
                return `${dt.getFullYear()}-${dt.getMonth()+1}-${dt.getDate()}`;
            });
            const data = result.predictedData.map(d => d.predictedValue);

            const lineDiv = document.createElement('div');
            Object.assign(lineDiv.style, {
                width: '100%',
                height: '320px'
            });
            const lineCan = document.createElement('canvas');
            lineDiv.appendChild(lineCan);
            chartWrapper.appendChild(lineDiv);

            new Chart(lineCan.getContext('2d'), {
                type: 'line',
                data: { labels, datasets: [{ label: 'Predicted', data, tension: 0.3 }] },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        datalabels: {
                            align: 'top',
                            anchor: 'end',
                            formatter: v => v.toFixed(1)
                        }
                    }
                },
                plugins: [ChartDataLabels]
            });
        }
    });
});
