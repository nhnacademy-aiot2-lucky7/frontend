document.addEventListener('DOMContentLoaded', function() {
    const tableBody = document.getElementById('ai-table-body');
    let chartInstances = {};
    let expandedRowId = null;

    // window.currentUser에서 부서명, 역할 추출
    const myDepartmentName = window.currentUser && window.currentUser.department && window.currentUser.department.departmentName;
    const myRole = window.currentUser && window.currentUser.userRole; // 예: 'ROLE_ADMIN', 'ROLE_MEMBER'

    // 실제 api 받아오기
    async function fetchList() {
        const res = await fetch(`https://luckyseven.live/api/analysis-results/search`, {
            method: 'GET',
            credentials: 'include'
        });
        if (!res.ok) {
            tableBody.innerHTML = '<tr><td colspan="4" style="text-align:center;">데이터를 불러올 수 없습니다.</td></tr>';
            return;
        }
        const data = await res.json();
        // 역할에 따라 필터링
        if (myRole === 'ROLE_ADMIN') {
            originData = data;
        } else {
            originData = data.filter(row => row.departmentName === myDepartmentName);
        }
        renderTable(originData);
    }

    // 하드코딩된 더미 데이터
    const dummyData = [
        {
            id: 1,
            departmentName: "개발",
            type: "CORRELATION-RISK-PREDICT",
            resultSummary: "위험",
            analyzedAt: "2025-06-05 13:10",
            resultJson: {
                analysisType: "CORRELATION-RISK-PREDICT",
                result: {
                    sensorInfo: {
                        sensorA: {
                            gatewayId: "58",
                            sensorId: "sensorA123",
                            sensorType: "temperature"
                        },
                        sensorB: {
                            gatewayId: "58",
                            sensorId: "sensorB456",
                            sensorType: "humidity"
                        }
                    },
                    predictedData: {
                        sensorA: { SingleRiskModel: 0.23, CorrelationRiskModel: 0.41 },
                        sensorB: { SingleRiskModel: 0.18, CorrelationRiskModel: 0.37 }
                    },
                    analyzedAt: 1717318290000
                }
            }
        },
        {
            id: 2,
            departmentName: "마케팅",
            type: "SINGLE_SENSOR_PREDICT",
            resultSummary: "경고",
            analyzedAt: "2025-06-05 14:10",
            resultJson: {
                analysisType: "SINGLE_SENSOR_PREDICT",
                result: {
                    sensorInfo: {
                        gatewayId: "58",
                        sensorId: "s39fd3dfd32",
                        sensorType: "temperature"
                    },
                    predictedData: [
                        { predictedValue: 60, predictedDate: "2025-05-31" },
                        { predictedValue: 50, predictedDate: "2025-06-01" },
                        { predictedValue: 38, predictedDate: "2025-06-02" },
                        { predictedValue: 42, predictedDate: "2025-06-03" }
                    ],
                    analyzedAt: "2025-05-30"
                }
            }
        },
        {
            id: 3,
            departmentName: "연구팀",
            type: "THRESHOLD_DIFF_ANALYSIS",
            resultSummary: "정상",
            analyzedAt: "2025-06-05 15:10",
            resultJson: {
                analysisType: "THRESHOLD_DIFF_ANALYSIS",
                result: {
                    sensorInfo: {
                        gatewayId: "58",
                        sensorId: "s39fd3dfd32",
                        sensorType: "temperature"
                    },
                    healthScore: 0.3,
                    analyzedAt: "2025-05-30"
                }
            }
        },
        {
            id: 4,
            departmentName: "개발",
            type: "CORRELATION-RISK-PREDICT",
            resultSummary: "위험",
            analyzedAt: "2025-06-05 16:10",
            resultJson: {
                analysisType: "CORRELATION-RISK-PREDICT",
                result: {
                    sensorInfo: {
                        sensorA: {
                            gatewayId: "58",
                            sensorId: "sensorA123",
                            sensorType: "temperature"
                        },
                        sensorB: {
                            gatewayId: "58",
                            sensorId: "sensorB456",
                            sensorType: "humidity"
                        }
                    },
                    predictedData: {
                        sensorA: { SingleRiskModel: 0.83, CorrelationRiskModel: 0.81 },
                        sensorB: { SingleRiskModel: 0.18, CorrelationRiskModel: 0.57 }
                    },
                    analyzedAt: 1717318290000
                }
            }
        },
        {
            id: 5,
            departmentName: "마케팅",
            type: "SINGLE_SENSOR_PREDICT",
            resultSummary: "경고",
            analyzedAt: "2025-06-05 17:10",
            resultJson: {
                analysisType: "SINGLE_SENSOR_PREDICT",
                result: {
                    sensorInfo: {
                        gatewayId: "58",
                        sensorId: "s39fd3dfd32",
                        sensorType: "temperature"
                    },
                    predictedData: [
                        { predictedValue: 90, predictedDate: "2025-05-31" },
                        { predictedValue: 40, predictedDate: "2025-06-01" },
                        { predictedValue: 78, predictedDate: "2025-06-02" },
                        { predictedValue: 32, predictedDate: "2025-06-03" }
                    ],
                    analyzedAt: "2025-05-30"
                }
            }
        },
        {
            id: 6,
            departmentName: "연구팀",
            type: "THRESHOLD_DIFF_ANALYSIS",
            resultSummary: "정상",
            analyzedAt: "2025-06-05 18:10",
            resultJson: {
                analysisType: "THRESHOLD_DIFF_ANALYSIS",
                result: {
                    sensorInfo: {
                        gatewayId: "58",
                        sensorId: "s39fd3dfd32",
                        sensorType: "temperature"
                    },
                    healthScore: 0.8,
                    analyzedAt: "2025-05-30"
                }
            }
        },
        {
            id: 7,
            departmentName: "개발",
            type: "CORRELATION-RISK-PREDICT",
            resultSummary: "경고",
            analyzedAt: "2025-06-05 16:10",
            resultJson: {
                analysisType: "CORRELATION-RISK-PREDICT",
                result: {
                    sensorInfo: {
                        sensorA: {
                            gatewayId: "12",
                            sensorId: "sensorA789",
                            sensorType: "temperature"
                        },
                        sensorB: {
                            gatewayId: "12",
                            sensorId: "sensorB987",
                            sensorType: "humidity"
                        }
                    },
                    predictedData: {
                        sensorA: { SingleRiskModel: 0.35, CorrelationRiskModel: 0.59 },
                        sensorB: { SingleRiskModel: 0.28, CorrelationRiskModel: 0.52 }
                    },
                    analyzedAt: 1717318390000
                }
            }
        },
        {
            id: 8,
            departmentName: "마케팅",
            type: "SINGLE_SENSOR_PREDICT",
            resultSummary: "위험",
            analyzedAt: "2025-06-05 17:10",
            resultJson: {
                analysisType: "SINGLE_SENSOR_PREDICT",
                result: {
                    sensorInfo: {
                        gatewayId: "21",
                        sensorId: "mktg1122",
                        sensorType: "co2"
                    },
                    predictedData: [
                        { predictedValue: 45, predictedDate: "2025-06-04" },
                        { predictedValue: 55, predictedDate: "2025-06-05" },
                        { predictedValue: 67, predictedDate: "2025-06-06" },
                        { predictedValue: 60, predictedDate: "2025-06-07" }
                    ],
                    analyzedAt: "2025-06-03"
                }
            }
        },
        {
            id: 9,
            departmentName: "연구팀",
            type: "THRESHOLD_DIFF_ANALYSIS",
            resultSummary: "정상",
            analyzedAt: "2025-06-05 18:10",
            resultJson: {
                analysisType: "THRESHOLD_DIFF_ANALYSIS",
                result: {
                    sensorInfo: {
                        gatewayId: "33",
                        sensorId: "labtemp01",
                        sensorType: "temperature"
                    },
                    healthScore: 0.82,
                    analyzedAt: "2025-06-04"
                }
            }
        },
        {
            id: 10,
            departmentName: "개발",
            type: "CORRELATION-RISK-PREDICT",
            resultSummary: "위험",
            analyzedAt: "2025-06-05 19:10",
            resultJson: {
                analysisType: "CORRELATION-RISK-PREDICT",
                result: {
                    sensorInfo: {
                        sensorA: {
                            gatewayId: "15",
                            sensorId: "devA001",
                            sensorType: "temperature"
                        },
                        sensorB: {
                            gatewayId: "15",
                            sensorId: "devB002",
                            sensorType: "humidity"
                        }
                    },
                    predictedData: {
                        sensorA: { SingleRiskModel: 0.67, CorrelationRiskModel: 0.85 },
                        sensorB: { SingleRiskModel: 0.61, CorrelationRiskModel: 0.81 }
                    },
                    analyzedAt: 1717318490000
                }
            }
        },
        {
            id: 11,
            departmentName: "마케팅",
            type: "SINGLE_SENSOR_PREDICT",
            resultSummary: "정상",
            analyzedAt: "2025-06-05 20:10",
            resultJson: {
                analysisType: "SINGLE_SENSOR_PREDICT",
                result: {
                    sensorInfo: {
                        gatewayId: "22",
                        sensorId: "marketingSensor2",
                        sensorType: "co2"
                    },
                    predictedData: [
                        { predictedValue: 35, predictedDate: "2025-06-04" },
                        { predictedValue: 30, predictedDate: "2025-06-05" },
                        { predictedValue: 28, predictedDate: "2025-06-06" },
                        { predictedValue: 25, predictedDate: "2025-06-07" }
                    ],
                    analyzedAt: "2025-06-03"
                }
            }
        },
        {
            id: 12,
            departmentName: "연구팀",
            type: "THRESHOLD_DIFF_ANALYSIS",
            resultSummary: "경고",
            analyzedAt: "2025-06-05 21:10",
            resultJson: {
                analysisType: "THRESHOLD_DIFF_ANALYSIS",
                result: {
                    sensorInfo: {
                        gatewayId: "34",
                        sensorId: "labhum01",
                        sensorType: "humidity"
                    },
                    healthScore: 0.55,
                    analyzedAt: "2025-06-04"
                }
            }
        },
        {
            id: 13,
            departmentName: "개발",
            type: "CORRELATION-RISK-PREDICT",
            resultSummary: "정상",
            analyzedAt: "2025-06-05 22:10",
            resultJson: {
                analysisType: "CORRELATION-RISK-PREDICT",
                result: {
                    sensorInfo: {
                        sensorA: {
                            gatewayId: "11",
                            sensorId: "devA003",
                            sensorType: "temperature"
                        },
                        sensorB: {
                            gatewayId: "11",
                            sensorId: "devB004",
                            sensorType: "humidity"
                        }
                    },
                    predictedData: {
                        sensorA: { SingleRiskModel: 0.15, CorrelationRiskModel: 0.22 },
                        sensorB: { SingleRiskModel: 0.13, CorrelationRiskModel: 0.18 }
                    },
                    analyzedAt: 1717318590000
                }
            }
        },
        {
            id: 14,
            departmentName: "마케팅",
            type: "SINGLE_SENSOR_PREDICT",
            resultSummary: "위험",
            analyzedAt: "2025-06-05 23:10",
            resultJson: {
                analysisType: "SINGLE_SENSOR_PREDICT",
                result: {
                    sensorInfo: {
                        gatewayId: "23",
                        sensorId: "mktg3344",
                        sensorType: "co2"
                    },
                    predictedData: [
                        { predictedValue: 80, predictedDate: "2025-06-04" },
                        { predictedValue: 70, predictedDate: "2025-06-05" },
                        { predictedValue: 60, predictedDate: "2025-06-06" },
                        { predictedValue: 50, predictedDate: "2025-06-07" }
                    ],
                    analyzedAt: "2025-06-03"
                }
            }
        },
        {
            id: 15,
            departmentName: "연구팀",
            type: "THRESHOLD_DIFF_ANALYSIS",
            resultSummary: "위험",
            analyzedAt: "2025-06-06 00:10",
            resultJson: {
                analysisType: "THRESHOLD_DIFF_ANALYSIS",
                result: {
                    sensorInfo: {
                        gatewayId: "35",
                        sensorId: "labco201",
                        sensorType: "co2"
                    },
                    healthScore: 0.12,
                    analyzedAt: "2025-06-05"
                }
            }
        },
        {
            id: 16,
            departmentName: "개발",
            type: "CORRELATION-RISK-PREDICT",
            resultSummary: "경고",
            analyzedAt: "2025-06-06 01:10",
            resultJson: {
                analysisType: "CORRELATION-RISK-PREDICT",
                result: {
                    sensorInfo: {
                        sensorA: {
                            gatewayId: "16",
                            sensorId: "devA999",
                            sensorType: "temperature"
                        },
                        sensorB: {
                            gatewayId: "16",
                            sensorId: "devB888",
                            sensorType: "humidity"
                        }
                    },
                    predictedData: {
                        sensorA: { SingleRiskModel: 0.41, CorrelationRiskModel: 0.53 },
                        sensorB: { SingleRiskModel: 0.36, CorrelationRiskModel: 0.48 }
                    },
                    analyzedAt: 1717318690000
                }
            }
        }
    ];

    // 더미데이터에서도 역할에 따라 필터링
    let originData;
    if (myRole === 'ROLE_ADMIN') {
        originData = dummyData.slice();
    } else {
        originData = dummyData.filter(row => row.departmentName === myDepartmentName);
    }

    // 결과값에 따른 이모지
    function getEmoji(score) {
        if(score >= 90) return "😄";
        if(score >= 70) return "🙂";
        if(score >= 50) return "😐";
        if(score >= 30) return "😟";
        return "😱";
    }

    // 테이블에서 확장된 상세/차트 행(tr.expand-row)을 모두 제거하고
    // 생성된 Chart.js 차트 인스턴스도 destroy()로 메모리 해제 및 상태 초기화
    // (확장행/차트 중복 생성, 메모리 누수, 스크롤 무한 증가 방지)
    function clearExpandRows() {
        document.querySelectorAll('.expand-row').forEach(tr => tr.remove());
        Object.values(chartInstances).forEach(inst => inst && inst.destroy && inst.destroy());
        chartInstances = {};
        expandedRowId = null;
    }

    // 테이블 생성
    function renderTable(list) {
        tableBody.innerHTML = '';
        list.forEach(row => {
            const tr = document.createElement('tr');
            tr.style.cursor = "pointer";
            tr.innerHTML = `
                <td>${row.departmentName || '-'}</td>
                <td>${row.type || '-'}</td>
                <td>${row.resultSummary || '-'}</td>
                <td>${row.analyzedAt || '-'}</td>
            `;
            tr.addEventListener('click', function() {
                if(expandedRowId === row.id) {
                    clearExpandRows();
                    return;
                }
                clearExpandRows();
                showDetail(row, tr, row.id);
                expandedRowId = row.id;
            });
            tableBody.appendChild(tr);
        });
    }

    // 상세 보기
    function showDetail(detail, baseTr, id) {
        const result = detail.resultJson.result;
        const analysisType =
            result.analysisType ||
            detail.resultJson.analysisType ||
            detail.type ||
            detail.analysisType;

        const isCorrelation = /CORRELATION[-_]RISK[-_]PREDICT/i.test(analysisType);
        const isSingle = /SINGLE[-_]SENSOR[-_]PREDICT/i.test(analysisType);
        const isThreshold = /THRESHOLD[-_]DIFF[-_]ANALYSIS/i.test(analysisType);

        // 센서 정보 테이블 추가
        // CORRELATION_RISK_PREDICT 정보 표
        let sensorInfoTable = '';
        if (isCorrelation && result.sensorInfo) {
            sensorInfoTable = `
                <table style="margin:0 auto 1rem auto; border-collapse:collapse; min-width:400px; font-size:1rem;">
                    <thead>
                        <tr style="background:#f3f4f6;">
                            <th style="padding:8px 16px; border:1px solid #e5e7eb;">센서명</th>
                            <th style="padding:8px 16px; border:1px solid #e5e7eb;">gatewayId</th>
                            <th style="padding:8px 16px; border:1px solid #e5e7eb;">sensorId</th>
                            <th style="padding:8px 16px; border:1px solid #e5e7eb;">sensorType</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.entries(result.sensorInfo).map(([key, info]) => `
                            <tr>
                                <td style="padding:8px 16px; border:1px solid #e5e7eb;">${key}</td>
                                <td style="padding:8px 16px; border:1px solid #e5e7eb;">${info.gatewayId}</td>
                                <td style="padding:8px 16px; border:1px solid #e5e7eb;">${info.sensorId}</td>
                                <td style="padding:8px 16px; border:1px solid #e5e7eb;">${info.sensorType}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <br><br>
            `;
            // SINGLE_SENSOR_PREDICT 정보 표
        } else if (isSingle && result.sensorInfo) {
            const info = result.sensorInfo;
            sensorInfoTable = `
                <table style="margin:0 auto 1rem auto; border-collapse:collapse; min-width:400px; font-size:1rem;">
                    <thead>
                        <tr style="background:#f3f4f6;">
                            <th style="padding:8px 16px; border:1px solid #e5e7eb;">gatewayId</th>
                            <th style="padding:8px 16px; border:1px solid #e5e7eb;">sensorId</th>
                            <th style="padding:8px 16px; border:1px solid #e5e7eb;">sensorType</th>
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
            // THRESHOLD_DIFF_ANALYSIS 정보 표
        } else if (isThreshold && result.sensorInfo) {
            const info = result.sensorInfo;
            sensorInfoTable = `
                <table style="margin:0 auto 1rem auto; border-collapse:collapse; min-width:400px; font-size:1rem;">
                    <thead>
                        <tr style="background:#f3f4f6;">
                            <th style="padding:8px 16px; border:1px solid #e5e7eb;">gatewayId</th>
                            <th style="padding:8px 16px; border:1px solid #e5e7eb;">sensorId</th>
                            <th style="padding:8px 16px; border:1px solid #e5e7eb;">sensorType</th>
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

        if (isCorrelation && result.predictedData) {
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
        } else if (isSingle && result.predictedData) {
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

            if (isCorrelation && result.predictedData) {
                const sensors = Object.keys(result.predictedData);
                const data = sensors.map(sensor => result.predictedData[sensor].CorrelationRiskModel);

                chartInstances[`bar-${id}`] = new Chart(document.getElementById(`bar-${id}`), {
                    type: 'bar',
                    data: {
                        labels: sensors,
                        datasets: [{
                            label: 'Correlation Risk',
                            data: data,
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
                            data: data,
                            backgroundColor: ['#FF6384', '#36A2EB']
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false
                    }
                });
            } else if (isSingle && result.predictedData) {
                const labels = result.predictedData.map(d => d.predictedDate);
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

    // 검색 폼 이벤트 등록
    document.getElementById('ai-search-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const search = this.search.value.trim().toLowerCase();
        if (!search) {
            renderTable(originData);
            return;
        }
        const filtered = originData.filter(row => {
            if (
                (row.departmentName && row.departmentName.toLowerCase().includes(search)) ||
                (row.type && row.type.toLowerCase().includes(search)) ||
                (row.resultSummary && row.resultSummary.toLowerCase().includes(search)) ||
                (row.analyzedAt && row.analyzedAt.toLowerCase().includes(search))
            ) return true;
            if (row.type && row.type.includes('CORRELATION')) {
                const info = row.resultJson.result.sensorInfo;
                return Object.entries(info).some(([sensorName, sensor]) =>
                    sensorName.toLowerCase().includes(search) ||
                    (sensor.gatewayId && String(sensor.gatewayId).toLowerCase().includes(search)) ||
                    (sensor.sensorId && sensor.sensorId.toLowerCase().includes(search)) ||
                    (sensor.sensorType && sensor.sensorType.toLowerCase().includes(search))
                );
            }
            if (row.type && row.type.includes('SINGLE_SENSOR_PREDICT')) {
                const sensor = row.resultJson.result.sensorInfo;
                return (
                    (sensor.gatewayId && String(sensor.gatewayId).toLowerCase().includes(search)) ||
                    (sensor.sensorId && sensor.sensorId.toLowerCase().includes(search)) ||
                    (sensor.sensorType && sensor.sensorType.toLowerCase().includes(search))
                );
            }
            return false;
        });
        renderTable(filtered);
    });

    // // 실제 API 사용 시: fetchList() 호출
    // fetchList();

    // 더미데이터 사용 시: 역할에 따라 필터링된 데이터만 렌더링
    renderTable(originData);
});
