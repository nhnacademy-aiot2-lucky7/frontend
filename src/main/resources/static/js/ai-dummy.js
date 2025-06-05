document.addEventListener('DOMContentLoaded', function() {
    const tableBody = document.getElementById('ai-table-body');
    let chartInstances = {};
    let expandedRowId = null; // 현재 확장된 행의 id

    // 더미 데이터
    const dummyData = [
        {
            id: 1,
            userName: "백동호",
            type: "CORRELATION_RISK_PREDICT",
            resultSummary: "정상",
            analyzedAt: "2025-06-05 14:10",
            score: Math.floor(Math.random() * 100),
            resultJson: {
                type: "CORRELATION_RISK_PREDICT",
                predictedData: Array.from({ length: 4 }, () => ({
                    correlationRiskModel: +(Math.random() * 1).toFixed(2)
                }))
            }
        },
        {
            id: 2,
            userName: "박준영",
            type: "SINGLE_SENSOR_PREDICT",
            resultSummary: "경고",
            analyzedAt: "2025-06-05 13:10",
            score: Math.floor(Math.random() * 100),
            resultJson: {
                type: "SINGLE_SENSOR_PREDICT",
                predictedData: Array.from({ length: 4 }, () => ({
                    predictedValue: Math.floor(Math.random() * 10)
                }))
            }
        },
        {
            id: 3,
            userName: "이동현",
            type: "THRESHOLD_DIFF_ANALYSIS",
            resultSummary: "위험",
            analyzedAt: "2025-06-05 12:10",
            score: Math.floor(Math.random() * 100),
            resultJson: {
                type: "THRESHOLD_DIFF_ANALYSIS",
                healthScore: Math.floor(Math.random() * 100)
            }
        },
        {
            id: 4,
            userName: "김송빈",
            type: ["CORRELATION_RISK_PREDICT", "SINGLE_SENSOR_PREDICT", "THRESHOLD_DIFF_ANALYSIS"][Math.floor(Math.random() * 3)],
            resultSummary: ["정상", "경고", "위험"][Math.floor(Math.random() * 3)],
            analyzedAt: "2025-06-05 11:10",
            score: Math.floor(Math.random() * 100),
            resultJson: (() => {
                const type = ["CORRELATION_RISK_PREDICT", "SINGLE_SENSOR_PREDICT", "THRESHOLD_DIFF_ANALYSIS"][Math.floor(Math.random() * 3)];
                return {
                    type: type,
                    ...(type === "CORRELATION_RISK_PREDICT" ? {
                        predictedData: Array.from({ length: 4 }, () => ({
                            correlationRiskModel: +(Math.random() * 1).toFixed(2)
                        }))
                    } : type === "SINGLE_SENSOR_PREDICT" ? {
                        predictedData: Array.from({ length: 4 }, () => ({
                            predictedValue: Math.floor(Math.random() * 10)
                        }))
                    } : {
                        healthScore: Math.floor(Math.random() * 100)
                    })
                }
            })()
        },
        {
            id: 5,
            userName: "문찬희",
            type: ["CORRELATION_RISK_PREDICT", "SINGLE_SENSOR_PREDICT", "THRESHOLD_DIFF_ANALYSIS"][Math.floor(Math.random() * 3)],
            resultSummary: ["정상", "경고", "위험"][Math.floor(Math.random() * 3)],
            analyzedAt: "2025-06-05 10:10",
            score: Math.floor(Math.random() * 100),
            resultJson: (() => {
                const type = ["CORRELATION_RISK_PREDICT", "SINGLE_SENSOR_PREDICT", "THRESHOLD_DIFF_ANALYSIS"][Math.floor(Math.random() * 3)];
                return {
                    type: type,
                    ...(type === "CORRELATION_RISK_PREDICT" ? {
                        predictedData: Array.from({ length: 4 }, () => ({
                            correlationRiskModel: +(Math.random() * 1).toFixed(2)
                        }))
                    } : type === "SINGLE_SENSOR_PREDICT" ? {
                        predictedData: Array.from({ length: 4 }, () => ({
                            predictedValue: Math.floor(Math.random() * 10)
                        }))
                    } : {
                        healthScore: Math.floor(Math.random() * 100)
                    })
                }
            })()
        },
        {
            id: 6,
            userName: "송영찬",
            type: ["CORRELATION_RISK_PREDICT", "SINGLE_SENSOR_PREDICT", "THRESHOLD_DIFF_ANALYSIS"][Math.floor(Math.random() * 3)],
            resultSummary: ["정상", "경고", "위험"][Math.floor(Math.random() * 3)],
            analyzedAt: "2025-06-05 09:10",
            score: Math.floor(Math.random() * 100),
            resultJson: (() => {
                const type = ["CORRELATION_RISK_PREDICT", "SINGLE_SENSOR_PREDICT", "THRESHOLD_DIFF_ANALYSIS"][Math.floor(Math.random() * 3)];
                return {
                    type: type,
                    ...(type === "CORRELATION_RISK_PREDICT" ? {
                        predictedData: Array.from({ length: 4 }, () => ({
                            correlationRiskModel: +(Math.random() * 1).toFixed(2)
                        }))
                    } : type === "SINGLE_SENSOR_PREDICT" ? {
                        predictedData: Array.from({ length: 4 }, () => ({
                            predictedValue: Math.floor(Math.random() * 10)
                        }))
                    } : {
                        healthScore: Math.floor(Math.random() * 100)
                    })
                }
            })()
        },
        {
            id: 7,
            userName: "강부식",
            type: ["CORRELATION_RISK_PREDICT", "SINGLE_SENSOR_PREDICT", "THRESHOLD_DIFF_ANALYSIS"][Math.floor(Math.random() * 3)],
            resultSummary: ["정상", "경고", "위험"][Math.floor(Math.random() * 3)],
            analyzedAt: "2025-06-05 08:10",
            score: Math.floor(Math.random() * 100),
            resultJson: (() => {
                const type = ["CORRELATION_RISK_PREDICT", "SINGLE_SENSOR_PREDICT", "THRESHOLD_DIFF_ANALYSIS"][Math.floor(Math.random() * 3)];
                return {
                    type: type,
                    ...(type === "CORRELATION_RISK_PREDICT" ? {
                        predictedData: Array.from({ length: 4 }, () => ({
                            correlationRiskModel: +(Math.random() * 1).toFixed(2)
                        }))
                    } : type === "SINGLE_SENSOR_PREDICT" ? {
                        predictedData: Array.from({ length: 4 }, () => ({
                            predictedValue: Math.floor(Math.random() * 10)
                        }))
                    } : {
                        healthScore: Math.floor(Math.random() * 100)
                    })
                }
            })()
        }
    ];

    function getEmoji(score) {
        if(score >= 90) return "😄";
        if(score >= 70) return "🙂";
        if(score >= 50) return "😐";
        if(score >= 30) return "😟";
        return "😱";
    }

    function clearExpandRows() {
        document.querySelectorAll('.expand-row').forEach(tr => tr.remove());
        Object.values(chartInstances).forEach(inst => inst && inst.destroy());
        chartInstances = {};
        expandedRowId = null;
    }

    function renderTable(data) {
        tableBody.innerHTML = '';
        data.forEach((row) => {
            const tr = document.createElement('tr');
            tr.style.cursor = "pointer";
            tr.innerHTML = `
                <td>${row.userName || '-'}</td>
                <td>${row.type || '-'}</td>
                <td>${row.resultSummary || '-'}</td>
                <td>${row.analyzedAt || '-'}</td>
            `;
            tr.addEventListener('click', function() {
                if(expandedRowId === row.id) {
                    // 이미 확장된 행이면 접기
                    clearExpandRows();
                } else {
                    // 다른 행 클릭 시 기존 확장 닫고 새로 확장
                    clearExpandRows();
                    const expandTr = document.createElement('tr');
                    expandTr.className = "expand-row";
                    expandTr.innerHTML = `
                        <td colspan="4">
                            <div style="display:flex; gap:2rem; align-items:stretch;">
                                <div style="flex:2; min-width:320px;">
                                    <canvas id="bar-chart-${row.id}" style="width:100%;height:320px;max-width:600px;max-height:400px;"></canvas>
                                    <div style="text-align:center;">막대그래프</div>
                                </div>
                                <div style="flex:1; display:flex; flex-direction:column; gap:1rem; min-width:220px;">
                                    <div style="flex:1;">
                                        <canvas id="line-chart-${row.id}" style="width:100%;height:140px;max-height:180px;"></canvas>
                                        <div style="text-align:center;">선그래프</div>
                                    </div>
                                    <div style="flex:1;">
                                        <canvas id="pie-chart-${row.id}" style="width:100%;height:140px;max-height:180px;"></canvas>
                                        <div style="text-align:center;">원그래프</div>
                                    </div>
                                </div>
                            </div>
                            <div style="margin-top:1.5rem; font-size:1.3rem;">점수: <span id="score-${row.id}"></span></div>
                            <div id="emoji-${row.id}" style="font-size:2.5rem;"></div>
                        </td>
                    `;
                    tr.after(expandTr);
                    showDetail(row.resultJson, row.id);
                    expandedRowId = row.id;
                }
            });
            tableBody.appendChild(tr);
        });
    }

    function showDetail(result, id) {
        let chartData = [];
        let score = null;
        let chartLabel = "AI 분석값";

        // score를 dummyData에서 직접 가져옴
        const row = dummyData.find(r => r.id === id);
        if (row && typeof row.score === 'number') {
            score = row.score;
        }

        if(result.type === "CORRELATION_RISK_PREDICT") {
            chartData = (result.predictedData || []).map(d => d.correlationRiskModel);
            if(score === null) {
                score = Math.round((chartData.reduce((a,b)=>a+b,0) / (chartData.length || 1)) * 100);
            }
            chartLabel = "상관관계 위험도";
        } else if(result.type === "SINGLE_SENSOR_PREDICT") {
            chartData = (result.predictedData || []).map(d => d.predictedValue);
            if(score === null) {
                score = Math.round((chartData.reduce((a,b)=>a+b,0) / (chartData.length || 1)));
            }
            chartLabel = "예측값";
        } else if(result.type === "THRESHOLD_DIFF_ANALYSIS") {
            chartData = [result.healthScore || 0];
            if(score === null) {
                score = result.healthScore || 0;
            }
            chartLabel = "헬스스코어";
        } else {
            chartData = [0];
            if(score === null) {
                score = 0;
            }
        }
        // 차트 그리기
        const barCtx = document.getElementById(`bar-chart-${id}`).getContext('2d');
        chartInstances.bar = new Chart(barCtx, {
            type: 'bar',
            data: {
                labels: chartData.map((_,i) => `#${i+1}`),
                datasets: [{
                    label: chartLabel,
                    data: chartData,
                    backgroundColor: 'rgba(54,162,235,0.5)'
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
        const lineCtx = document.getElementById(`line-chart-${id}`).getContext('2d');
        chartInstances.line = new Chart(lineCtx, {
            type: 'line',
            data: {
                labels: chartData.map((_,i) => `#${i+1}`),
                datasets: [{
                    label: chartLabel,
                    data: chartData,
                    borderColor: 'rgba(255,99,132,0.8)',
                    backgroundColor: 'rgba(255,99,132,0.2)',
                    fill: false,
                    tension: 0.3
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
        const pieCtx = document.getElementById(`pie-chart-${id}`).getContext('2d');
        chartInstances.pie = new Chart(pieCtx, {
            type: 'doughnut',
            data: {
                labels: chartData.map((_,i) => `#${i+1}`),
                datasets: [{
                    label: chartLabel,
                    data: chartData,
                    backgroundColor: [
                        'rgba(54,162,235,0.5)',
                        'rgba(255,99,132,0.5)',
                        'rgba(255,206,86,0.5)',
                        'rgba(75,192,192,0.5)',
                        'rgba(153,102,255,0.5)',
                        'rgba(255,159,64,0.5)'
                    ]
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
        document.getElementById(`score-${id}`).textContent = score;
        document.getElementById(`emoji-${id}`).textContent = getEmoji(score);
    }

    renderTable(dummyData);
});
