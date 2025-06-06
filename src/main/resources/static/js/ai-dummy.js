document.addEventListener('DOMContentLoaded', function() {
    const tableBody = document.getElementById('ai-table-body');
    let chartInstances = {};
    let expandedRowId = null;

    // window.currentUser에서 부서명, 역할 추출
    const myDepartmentName = window.currentUser && window.currentUser.department && window.currentUser.department.departmentName;
    const myRole = window.currentUser && window.currentUser.userRole; // 예: 'ROLE_ADMIN', 'ROLE_MEMBER'

    // 실제 api 받아오기
    async function fetchList() {
        const res = await fetch('/api/ai-results'); // 실제 API URL로 수정
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

    // 하드코딩된 더미 데이터 (2개)
    const dummyData = [
        {
            id: 1,
            departmentName: "개발",
            type: "CORRELATION-RISK-PREDICT",
            resultSummary: "위험",
            analyzedAt: "2025-06-05 14:10",
            score: 83,
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
            analyzedAt: "2025-06-05 13:10",
            score: 68,
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
        }
    ];

    // 더미데이터에서도 역할에 따라 필터링
    let originData;
    if (myRole === 'ROLE_ADMIN') {
        originData = dummyData.slice();
    } else {
        originData = dummyData.filter(row => row.departmentName === myDepartmentName);
    }

    function getEmoji(score) {
        if(score >= 90) return "😄";
        if(score >= 70) return "🙂";
        if(score >= 50) return "😐";
        if(score >= 30) return "😟";
        return "😱";
    }

    function clearExpandRows() {
        document.querySelectorAll('.expand-row').forEach(tr => tr.remove());
        Object.values(chartInstances).forEach(inst => inst && inst.destroy && inst.destroy());
        chartInstances = {};
        expandedRowId = null;
    }

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

    function showDetail(detail, baseTr, id) {
        const result = detail.resultJson.result;
        const analysisType =
            result.analysisType ||
            detail.resultJson.analysisType ||
            detail.type ||
            detail.analysisType;

        const isCorrelation = /CORRELATION[-_]RISK[-_]PREDICT/i.test(analysisType);
        const isSingle = /SINGLE[-_]SENSOR[-_]PREDICT/i.test(analysisType);

        // 센서 정보 테이블 추가
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
            `;
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
            `;
        }

        let html = `<td colspan="4">
    ${sensorInfoTable}
    <div style="display:flex; gap:2.5rem; align-items:center; justify-content:center; flex-wrap:wrap;">
`;

        if (isCorrelation && result.predictedData) {
            html += `
        <div style="width:600px; height:320px; display:flex; flex-direction:column; align-items:center;">
            <canvas id="bar-${id}" width="600" height="320"></canvas>
            <div style="text-align:center; margin-top:0.5rem;">상관관계 위험도</div>
        </div>
        <div style="width:320px; height:320px; display:flex; flex-direction:column; align-items:center;">
            <canvas id="pie-${id}" width="320" height="320"></canvas>
            <div style="text-align:center; margin-top:0.5rem;">센서별 위험 비율</div>
        </div>
    `;
        } else if (isSingle && result.predictedData) {
            html += `
        <div style="width:600px; height:320px; display:flex; flex-direction:column; align-items:center;">
            <canvas id="line-${id}" width="600" height="320"></canvas>
            <div style="text-align:center; margin-top:0.5rem;">예측값 추이</div>
        </div>
    `;
        }

        html += `</div>
    <div style="margin-top:2rem; text-align:center; width:100%; font-size:1.5rem;">
        점수: ${detail.score} <span style="font-size:2rem;">${getEmoji(detail.score)}</span>
    </div>
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

    // 실제 API 사용 시: fetchList() 호출
    // fetchList();

    // 더미데이터 사용 시: 역할에 따라 필터링된 데이터만 렌더링
    renderTable(originData);
});
