document.addEventListener('DOMContentLoaded', function() {
    const tableBody = document.getElementById('ai-table-body');
    let chartInstances = {};
    let expandedRowId = null;
    let currentPage = 0;
    const pageSize = 20; // 원하는 페이지당 행 수
    let filteredData = [];
    // let originData;

    // window.currentUser에서 부서명, 역할 추출
    const myDepartmentName = window.currentUser && window.currentUser.department && window.currentUser.department.departmentName;
    const myRole = window.currentUser && window.currentUser.userRole;

    // 더미데이터 (paste.txt에서 복사)
    const dummyData = [
        // CORRELATION_RISK_PREDICT 10개
        {
            id: 1,
            departmentName: "개발",
            type: "CORRELATION_RISK_PREDICT",
            resultSummary: "센서 [1:24e124136d151368] (temperature) 와 [1:24e124136d151368] (humidity)의 상관관계 및 위험도 분석 결과",
            analyzedAt: "2025-06-01 10:10",
            resultJson: {
                analysisType: "CORRELATION_RISK_PREDICT",
                result: {
                    sensorInfo: {
                        sensorA: { gatewayId: "58", sensorId: "sensorA123", sensorType: "temperature" },
                        sensorB: { gatewayId: "58", sensorId: "sensorB456", sensorType: "humidity" }
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
            departmentName: "연구팀",
            type: "CORRELATION_RISK_PREDICT",
            resultSummary: "센서 [1:24e124136d151368] (humidity) 와 [1:24e124136d151368] (activity)의 상관관계 및 위험도 분석 결과",
            analyzedAt: "2025-06-02 11:00",
            resultJson: {
                analysisType: "CORRELATION_RISK_PREDICT",
                result: {
                    sensorInfo: {
                        sensorA: { gatewayId: "59", sensorId: "sensorA789", sensorType: "humidity" },
                        sensorB: { gatewayId: "59", sensorId: "sensorB987", sensorType: "activity" }
                    },
                    predictedData: {
                        sensorA: { SingleRiskModel: 0.10, CorrelationRiskModel: 0.12 },
                        sensorB: { SingleRiskModel: 0.22, CorrelationRiskModel: 0.18 }
                    },
                    analyzedAt: 1717404690000
                }
            }
        },
        {
            id: 3,
            departmentName: "마케팅",
            type: "CORRELATION_RISK_PREDICT",
            resultSummary: "센서 [1:24e124136d151368] (activity) 와 [1:24e124136d151368] (temperature)의 상관관계 및 위험도 분석 결과",
            analyzedAt: "2025-06-03 09:30",
            resultJson: {
                analysisType: "CORRELATION_RISK_PREDICT",
                result: {
                    sensorInfo: {
                        sensorA: { gatewayId: "60", sensorId: "sensorA222", sensorType: "activity" },
                        sensorB: { gatewayId: "60", sensorId: "sensorB333", sensorType: "temperature" }
                    },
                    predictedData: {
                        sensorA: { SingleRiskModel: 0.55, CorrelationRiskModel: 0.21 },
                        sensorB: { SingleRiskModel: 0.39, CorrelationRiskModel: 0.44 }
                    },
                    analyzedAt: 1717491090000
                }
            }
        },
        {
            id: 4,
            departmentName: "개발",
            type: "CORRELATION_RISK_PREDICT",
            resultSummary: "센서 [1:24e124136d151368] (temperature) 와 [1:24e124136d151368] (humidity)의 상관관계 및 위험도 분석 결과",
            analyzedAt: "2025-06-04 14:20",
            resultJson: {
                analysisType: "CORRELATION_RISK_PREDICT",
                result: {
                    sensorInfo: {
                        sensorA: { gatewayId: "62", sensorId: "sensorA555", sensorType: "temperature" },
                        sensorB: { gatewayId: "62", sensorId: "sensorB666", sensorType: "humidity" }
                    },
                    predictedData: {
                        sensorA: { SingleRiskModel: 0.07, CorrelationRiskModel: 0.09 },
                        sensorB: { SingleRiskModel: 0.15, CorrelationRiskModel: 0.11 }
                    },
                    analyzedAt: 1717577490000
                }
            }
        },
        {
            id: 5,
            departmentName: "연구팀",
            type: "CORRELATION_RISK_PREDICT",
            resultSummary: "센서 [1:24e124136d151368] (activity) 와 [1:24e124136d151368] (temperature)의 상관관계 및 위험도 분석 결과",
            analyzedAt: "2025-06-05 13:10",
            resultJson: {
                analysisType: "CORRELATION_RISK_PREDICT",
                result: {
                    sensorInfo: {
                        sensorA: { gatewayId: "63", sensorId: "sensorA888", sensorType: "activity" },
                        sensorB: { gatewayId: "63", sensorId: "sensorB999", sensorType: "temperature" }
                    },
                    predictedData: {
                        sensorA: { SingleRiskModel: 0.81, CorrelationRiskModel: 0.72 },
                        sensorB: { SingleRiskModel: 0.66, CorrelationRiskModel: 0.58 }
                    },
                    analyzedAt: 1717663890000
                }
            }
        },
        {
            id: 6,
            departmentName: "마케팅",
            type: "CORRELATION_RISK_PREDICT",
            resultSummary: "센서 [1:24e124136d151368] (humidity) 와 [1:24e124136d151368] (activity)의 상관관계 및 위험도 분석 결과",
            analyzedAt: "2025-06-06 10:40",
            resultJson: {
                analysisType: "CORRELATION_RISK_PREDICT",
                result: {
                    sensorInfo: {
                        sensorA: { gatewayId: "64", sensorId: "sensorA001", sensorType: "humidity" },
                        sensorB: { gatewayId: "64", sensorId: "sensorB002", sensorType: "activity" }
                    },
                    predictedData: {
                        sensorA: { SingleRiskModel: 0.19, CorrelationRiskModel: 0.17 },
                        sensorB: { SingleRiskModel: 0.14, CorrelationRiskModel: 0.13 }
                    },
                    analyzedAt: 1717750290000
                }
            }
        },
        {
            id: 7,
            departmentName: "개발",
            type: "CORRELATION_RISK_PREDICT",
            resultSummary: "센서 [1:24e124136d151368] (temperature) 와 [1:24e124136d151368] (humidity)의 상관관계 및 위험도 분석 결과",
            analyzedAt: "2025-06-07 15:25",
            resultJson: {
                analysisType: "CORRELATION_RISK_PREDICT",
                result: {
                    sensorInfo: {
                        sensorA: { gatewayId: "65", sensorId: "sensorA777", sensorType: "temperature" },
                        sensorB: { gatewayId: "65", sensorId: "sensorB888", sensorType: "humidity" }
                    },
                    predictedData: {
                        sensorA: { SingleRiskModel: 0.44, CorrelationRiskModel: 0.33 },
                        sensorB: { SingleRiskModel: 0.29, CorrelationRiskModel: 0.21 }
                    },
                    analyzedAt: 1717836690000
                }
            }
        },
        {
            id: 8,
            departmentName: "연구팀",
            type: "CORRELATION_RISK_PREDICT",
            resultSummary: "센서 [1:24e124136d151368] (activity) 와 [1:24e124136d151368] (humidity)의 상관관계 및 위험도 분석 결과",
            analyzedAt: "2025-06-08 09:50",
            resultJson: {
                analysisType: "CORRELATION_RISK_PREDICT",
                result: {
                    sensorInfo: {
                        sensorA: { gatewayId: "66", sensorId: "sensorA222", sensorType: "activity" },
                        sensorB: { gatewayId: "66", sensorId: "sensorB333", sensorType: "humidity" }
                    },
                    predictedData: {
                        sensorA: { SingleRiskModel: 0.23, CorrelationRiskModel: 0.18 },
                        sensorB: { SingleRiskModel: 0.12, CorrelationRiskModel: 0.09 }
                    },
                    analyzedAt: 1717923090000
                }
            }
        },
        {
            id: 9,
            departmentName: "마케팅",
            type: "CORRELATION_RISK_PREDICT",
            resultSummary: "센서 [1:24e124136d151368] (temperature) 와 [1:24e124136d151368] (activity)의 상관관계 및 위험도 분석 결과",
            analyzedAt: "2025-06-09 08:20",
            resultJson: {
                analysisType: "CORRELATION_RISK_PREDICT",
                result: {
                    sensorInfo: {
                        sensorA: { gatewayId: "67", sensorId: "sensorA444", sensorType: "temperature" },
                        sensorB: { gatewayId: "67", sensorId: "sensorB555", sensorType: "activity" }
                    },
                    predictedData: {
                        sensorA: { SingleRiskModel: 0.91, CorrelationRiskModel: 0.79 },
                        sensorB: { SingleRiskModel: 0.69, CorrelationRiskModel: 0.65 }
                    },
                    analyzedAt: 1718009490000
                }
            }
        },
        {
            id: 10,
            departmentName: "개발",
            type: "CORRELATION_RISK_PREDICT",
            resultSummary: "센서 [1:24e124136d151368] (humidity) 와 [1:24e124136d151368] (temperature)의 상관관계 및 위험도 분석 결과",
            analyzedAt: "2025-06-10 13:30",
            resultJson: {
                analysisType: "CORRELATION_RISK_PREDICT",
                result: {
                    sensorInfo: {
                        sensorA: { gatewayId: "68", sensorId: "sensorA555", sensorType: "humidity" },
                        sensorB: { gatewayId: "68", sensorId: "sensorB666", sensorType: "temperature" }
                    },
                    predictedData: {
                        sensorA: { SingleRiskModel: 0.41, CorrelationRiskModel: 0.29 },
                        sensorB: { SingleRiskModel: 0.31, CorrelationRiskModel: 0.22 }
                    },
                    analyzedAt: 1718095890000
                }
            }
        },

        // SINGLE_SENSOR_PREDICT 10개 (각 센서타입별 2개씩, 30일치 데이터)
        {
            id: 11,
            departmentName: "마케팅",
            type: "SINGLE_SENSOR_PREDICT",
            resultSummary: "센서 [1:24e124126d152969] (temperature)의 예측 분석 결과",
            analyzedAt: "2025-06-10 13:30",
            resultJson: {
                analysisType: "SINGLE_SENSOR_PREDICT",
                result: {
                    sensorInfo: {
                        gatewayId: "58",
                        sensorId: "24e124126d152969",
                        sensorType: "temperature"
                    },
                    predictedData: Array.from({length: 30}).map((_, i) => ({
                        predictedValue: 990 + Math.round(Math.random() * 20),
                        predictedDate: `2025-05-${(i+1).toString().padStart(2,'0')}`
                    })),
                    analyzedAt: "2025-06-10"
                }
            }
        },
        {
            id: 12,
            departmentName: "연구팀",
            type: "SINGLE_SENSOR_PREDICT",
            resultSummary: "센서 [1:24e124128c067999] (pressure)의 예측 분석 결과",
            analyzedAt: "2025-06-09 08:20",
            resultJson: {
                analysisType: "SINGLE_SENSOR_PREDICT",
                result: {
                    sensorInfo: {
                        gatewayId: "59",
                        sensorId: "24e124128c067999",
                        sensorType: "pressure"
                    },
                    predictedData: Array.from({length: 30}).map((_, i) => ({
                        predictedValue: 970 + Math.round(Math.random() * 60),
                        predictedDate: `2025-05-${(i+1).toString().padStart(2,'0')}`
                    })),
                    analyzedAt: "2025-06-09"
                }
            }
        },
        {
            id: 13,
            departmentName: "개발",
            type: "SINGLE_SENSOR_PREDICT",
            resultSummary: "센서 [1:24e124600d186154] (humidity)의 예측 분석 결과",
            analyzedAt: "2025-06-08 09:50",
            resultJson: {
                analysisType: "SINGLE_SENSOR_PREDICT",
                result: {
                    sensorInfo: {
                        gatewayId: "60",
                        sensorId: "24e124600d186154",
                        sensorType: "humidity"
                    },
                    predictedData: Array.from({length: 30}).map((_, i) => ({
                        predictedValue: 40 + Math.round(Math.random() * 6),
                        predictedDate: `2025-05-${(i+1).toString().padStart(2,'0')}`
                    })),
                    analyzedAt: "2025-06-08"
                }
            }
        },
        {
            id: 14,
            departmentName: "마케팅",
            type: "SINGLE_SENSOR_PREDICT",
            resultSummary: "센서 [1:24e124785c389010] (co2)의 예측 분석 결과",
            analyzedAt: "2025-06-07 15:25",
            resultJson: {
                analysisType: "SINGLE_SENSOR_PREDICT",
                result: {
                    sensorInfo: {
                        gatewayId: "61",
                        sensorId: "24e124785c389010",
                        sensorType: "co2"
                    },
                    predictedData: Array.from({length: 30}).map((_, i) => ({
                        predictedValue: 790 + Math.round(Math.random() * 40),
                        predictedDate: `2025-05-${(i+1).toString().padStart(2,'0')}`
                    })),
                    analyzedAt: "2025-06-07"
                }
            }
        },
        {
            id: 15,
            departmentName: "연구팀",
            type: "SINGLE_SENSOR_PREDICT",
            resultSummary: "센서 [1:24e124128c067999] (battery)의 예측 분석 결과",
            analyzedAt: "2025-06-06 10:40",
            resultJson: {
                analysisType: "SINGLE_SENSOR_PREDICT",
                result: {
                    sensorInfo: {
                        gatewayId: "62",
                        sensorId: "24e124128c067999",
                        sensorType: "battery"
                    },
                    predictedData: Array.from({length: 30}).map((_, i) => ({
                        predictedValue: 0.36 + Math.random() * 0.08,
                        predictedDate: `2025-05-${(i+1).toString().padStart(2,'0')}`
                    })),
                    analyzedAt: "2025-06-06"
                }
            }
        },
        {
            id: 16,
            departmentName: "개발",
            type: "SINGLE_SENSOR_PREDICT",
            resultSummary: "센서 [1:24e124136d151485] (tvoc)의 예측 분석 결과",
            analyzedAt: "2025-06-05 13:10",
            resultJson: {
                analysisType: "SINGLE_SENSOR_PREDICT",
                result: {
                    sensorInfo: {
                        gatewayId: "63",
                        sensorId: "24e124136d151485",
                        sensorType: "tvoc"
                    },
                    predictedData: Array.from({length: 30}).map((_, i) => ({
                        predictedValue: 80 + Math.round(Math.random() * 14),
                        predictedDate: `2025-05-${(i+1).toString().padStart(2,'0')}`
                    })),
                    analyzedAt: "2025-06-05"
                }
            }
        },
        {
            id: 17,
            departmentName: "마케팅",
            type: "SINGLE_SENSOR_PREDICT",
            resultSummary: "센서 [1:24e124126d152919] (pressure)의 예측 분석 결과",
            analyzedAt: "2025-06-04 14:20",
            resultJson: {
                analysisType: "SINGLE_SENSOR_PREDICT",
                result: {
                    sensorInfo: {
                        gatewayId: "64",
                        sensorId: "24e124126d152919",
                        sensorType: "pressure"
                    },
                    predictedData: Array.from({length: 30}).map((_, i) => ({
                        predictedValue: 990 + Math.round(Math.random() * 30),
                        predictedDate: `2025-05-${(i+1).toString().padStart(2,'0')}`
                    })),
                    analyzedAt: "2025-06-04"
                }
            }
        },
        {
            id: 18,
            departmentName: "연구팀",
            type: "SINGLE_SENSOR_PREDICT",
            resultSummary: "센서 [1:24e124600d186154] (humidity)의 예측 분석 결과",
            analyzedAt: "2025-06-03 09:30",
            resultJson: {
                analysisType: "SINGLE_SENSOR_PREDICT",
                result: {
                    sensorInfo: {
                        gatewayId: "65",
                        sensorId: "24e124600d186154",
                        sensorType: "humidity"
                    },
                    predictedData: Array.from({length: 30}).map((_, i) => ({
                        predictedValue: 41 + Math.round(Math.random() * 5),
                        predictedDate: `2025-05-${(i+1).toString().padStart(2,'0')}`
                    })),
                    analyzedAt: "2025-06-03"
                }
            }
        },
        {
            id: 19,
            departmentName: "개발",
            type: "SINGLE_SENSOR_PREDICT",
            resultSummary: "센서 [1:24e124785c389010] (co2)의 예측 분석 결과",
            analyzedAt: "2025-06-02 11:00",
            resultJson: {
                analysisType: "SINGLE_SENSOR_PREDICT",
                result: {
                    sensorInfo: {
                        gatewayId: "66",
                        sensorId: "24e124785c389010",
                        sensorType: "co2"
                    },
                    predictedData: Array.from({length: 30}).map((_, i) => ({
                        predictedValue: 800 + Math.round(Math.random() * 30),
                        predictedDate: `2025-05-${(i+1).toString().padStart(2,'0')}`
                    })),
                    analyzedAt: "2025-06-02"
                }
            }
        },
        {
            id: 20,
            departmentName: "연구팀",
            type: "SINGLE_SENSOR_PREDICT",
            resultSummary: "센서 [1:24e124128c067999] (battery)의 예측 분석 결과",
            analyzedAt: "2025-06-01 10:10",
            resultJson: {
                analysisType: "SINGLE_SENSOR_PREDICT",
                result: {
                    sensorInfo: {
                        gatewayId: "67",
                        sensorId: "24e124128c067999",
                        sensorType: "battery"
                    },
                    predictedData: Array.from({length: 30}).map((_, i) => ({
                        predictedValue: 0.38 + Math.random() * 0.07,
                        predictedDate: `2025-05-${(i+1).toString().padStart(2,'0')}`
                    })),
                    analyzedAt: "2025-06-01"
                }
            }
        },

        // THRESHOLD_DIFF_ANALYSIS 10개
        {
            id: 21,
            departmentName: "개발",
            type: "THRESHOLD_DIFF_ANALYSIS",
            resultSummary: "정상",
            analyzedAt: "2025-06-01 10:10",
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
            id: 22,
            departmentName: "연구팀",
            type: "THRESHOLD_DIFF_ANALYSIS",
            resultSummary: "경고",
            analyzedAt: "2025-06-02 11:00",
            resultJson: {
                analysisType: "THRESHOLD_DIFF_ANALYSIS",
                result: {
                    sensorInfo: {
                        gatewayId: "59",
                        sensorId: "s39fd3dfd32",
                        sensorType: "humidity"
                    },
                    healthScore: 0.7,
                    analyzedAt: "2025-05-29"
                }
            }
        },
        {
            id: 23,
            departmentName: "마케팅",
            type: "THRESHOLD_DIFF_ANALYSIS",
            resultSummary: "위험",
            analyzedAt: "2025-06-03 09:30",
            resultJson: {
                analysisType: "THRESHOLD_DIFF_ANALYSIS",
                result: {
                    sensorInfo: {
                        gatewayId: "60",
                        sensorId: "s39fd3dfd32",
                        sensorType: "pressure"
                    },
                    healthScore: 0.15,
                    analyzedAt: "2025-05-28"
                }
            }
        },
        {
            id: 24,
            departmentName: "개발",
            type: "THRESHOLD_DIFF_ANALYSIS",
            resultSummary: "정상",
            analyzedAt: "2025-06-04 14:20",
            resultJson: {
                analysisType: "THRESHOLD_DIFF_ANALYSIS",
                result: {
                    sensorInfo: {
                        gatewayId: "61",
                        sensorId: "s39fd3dfd32",
                        sensorType: "humidity"
                    },
                    healthScore: 0.85,
                    analyzedAt: "2025-05-27"
                }
            }
        },
        {
            id: 25,
            departmentName: "연구팀",
            type: "THRESHOLD_DIFF_ANALYSIS",
            resultSummary: "정상",
            analyzedAt: "2025-06-05 13:10",
            resultJson: {
                analysisType: "THRESHOLD_DIFF_ANALYSIS",
                result: {
                    sensorInfo: {
                        gatewayId: "62",
                        sensorId: "s39fd3dfd32",
                        sensorType: "temperature"
                    },
                    healthScore: 0.92,
                    analyzedAt: "2025-05-26"
                }
            }
        },
        {
            id: 26,
            departmentName: "마케팅",
            type: "THRESHOLD_DIFF_ANALYSIS",
            resultSummary: "경고",
            analyzedAt: "2025-06-06 10:40",
            resultJson: {
                analysisType: "THRESHOLD_DIFF_ANALYSIS",
                result: {
                    sensorInfo: {
                        gatewayId: "63",
                        sensorId: "s39fd3dfd32",
                        sensorType: "pressure"
                    },
                    healthScore: 0.48,
                    analyzedAt: "2025-05-25"
                }
            }
        },
        {
            id: 27,
            departmentName: "개발",
            type: "THRESHOLD_DIFF_ANALYSIS",
            resultSummary: "위험",
            analyzedAt: "2025-06-07 15:25",
            resultJson: {
                analysisType: "THRESHOLD_DIFF_ANALYSIS",
                result: {
                    sensorInfo: {
                        gatewayId: "64",
                        sensorId: "s39fd3dfd32",
                        sensorType: "temperature"
                    },
                    healthScore: 0.02,
                    analyzedAt: "2025-05-24"
                }
            }
        },
        {
            id: 28,
            departmentName: "연구팀",
            type: "THRESHOLD_DIFF_ANALYSIS",
            resultSummary: "정상",
            analyzedAt: "2025-06-08 09:50",
            resultJson: {
                analysisType: "THRESHOLD_DIFF_ANALYSIS",
                result: {
                    sensorInfo: {
                        gatewayId: "65",
                        sensorId: "s39fd3dfd32",
                        sensorType: "humidity"
                    },
                    healthScore: 0.74,
                    analyzedAt: "2025-05-23"
                }
            }
        },
        {
            id: 29,
            departmentName: "마케팅",
            type: "THRESHOLD_DIFF_ANALYSIS",
            resultSummary: "위험",
            analyzedAt: "2025-06-09 08:20",
            resultJson: {
                analysisType: "THRESHOLD_DIFF_ANALYSIS",
                result: {
                    sensorInfo: {
                        gatewayId: "66",
                        sensorId: "s39fd3dfd32",
                        sensorType: "pressure"
                    },
                    healthScore: 0.12,
                    analyzedAt: "2025-05-22"
                }
            }
        },
        {
            id: 30,
            departmentName: "개발",
            type: "THRESHOLD_DIFF_ANALYSIS",
            resultSummary: "정상",
            analyzedAt: "2025-06-10 13:30",
            resultJson: {
                analysisType: "THRESHOLD_DIFF_ANALYSIS",
                result: {
                    sensorInfo: {
                        gatewayId: "67",
                        sensorId: "s39fd3dfd32",
                        sensorType: "temperature"
                    },
                    healthScore: 0.61,
                    analyzedAt: "2025-05-21"
                }
            }
        }
    ];

    // id만 섞어서 새로운 배열 생성
    const shuffledIds = Array.from({length: 30}, (_, i) => i + 1)
        .sort(() => Math.random() - 0.5);
    const shuffledDummyData = shuffledIds.map(id => dummyData.find(item => item.id === id));

    // 이후 코드에서 originData = shuffledDummyData; 로 사용
    let originData = shuffledDummyData;

    // 역할에 따라 필터링
    if (myRole === 'ROLE_ADMIN') {
        originData = dummyData.slice();
    } else {
        originData = dummyData.filter(row => row.departmentName === myDepartmentName);
    }

    // 필터+검색+페이징 통합 함수
    function filterAndRender(page = 0) {
        const form = document.getElementById('ai-search-form');
        const search = form.sensor.value.trim().toLowerCase();
        const type = form.type.value;
        const startDate = form['start-date'].value;
        const endDate = form['end-date'].value;

        let filtered = originData;
        if (type) {
            filtered = filtered.filter(row => row.type === type);
        }
        if (search) {
            filtered = filtered.filter(row =>
                row.resultSummary && row.resultSummary.toLowerCase().includes(search)
            );
        }
        if (startDate) {
            filtered = filtered.filter(row => {
                const ts = typeof row.analyzedAt === 'number' ? row.analyzedAt : Date.parse(row.analyzedAt);
                return ts >= new Date(startDate).setHours(0,0,0,0);
            });
        }
        if (endDate) {
            filtered = filtered.filter(row => {
                const ts = typeof row.analyzedAt === 'number' ? row.analyzedAt : Date.parse(row.analyzedAt);
                return ts <= new Date(endDate).setHours(23,59,59,999);
            });
        }

        filteredData = filtered;
        const filteredTotalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
        currentPage = Math.max(0, Math.min(page, filteredTotalPages - 1));
        const pageData = filtered.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
        renderTable(pageData);
        renderPagination(filteredTotalPages, currentPage);
    }

    // 테이블 렌더링
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

    // 페이지네이션
    function renderPagination(totalPages, page) {
        let paginationDiv = document.getElementById('pagination');
        if (!paginationDiv) {
            paginationDiv = document.createElement('div');
            paginationDiv.id = 'pagination';
            paginationDiv.className = 'pagination-bar';
            tableBody.parentElement.appendChild(paginationDiv);
        }
        paginationDiv.innerHTML = `
            <button id="prevPage" ${page === 0 ? 'disabled' : ''}>이전</button>
            <span>${page + 1} / ${totalPages} 페이지</span>
            <button id="nextPage" ${page === totalPages - 1 ? 'disabled' : ''}>다음</button>
        `;
        document.getElementById('prevPage').onclick = () => {
            if (page > 0) filterAndRender(page - 1);
        };
        document.getElementById('nextPage').onclick = () => {
            if (page < totalPages - 1) filterAndRender(page + 1);
        };
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
                            <th style="padding:8px 16px; border:1px solid #e5e7eb;">게이트웨이 ID</th>
                            <th style="padding:8px 16px; border:1px solid #e5e7eb;">센서 UUID</th>
                            <th style="padding:8px 16px; border:1px solid #e5e7eb;">센서타입</th>
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
                            <th style="padding:8px 16px; border:1px solid #e5e7eb;">게이트웨이 ID</th>
                            <th style="padding:8px 16px; border:1px solid #e5e7eb;">센서 UUID</th>
                            <th style="padding:8px 16px; border:1px solid #e5e7eb;">센서타입</th>
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
                            <th style="padding:8px 16px; border:1px solid #e5e7eb;">게이트웨이 ID</th>
                            <th style="padding:8px 16px; border:1px solid #e5e7eb;">센서 UUID</th>
                            <th style="padding:8px 16px; border:1px solid #e5e7eb;">센서타입</th>
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
                const sensorKeys = Object.keys(result.predictedData);
                const labels = sensorKeys.map(key => result.sensorInfo[key].sensorType);
                const data = sensorKeys.map(key => result.predictedData[key].CorrelationRiskModel);

                chartInstances[`bar-${id}`] = new Chart(document.getElementById(`bar-${id}`), {
                    type: 'bar',
                    data: {
                        labels: labels,
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
                        labels: labels, // sensorType으로!
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

    // 확장행/차트 제거
    function clearExpandRows() {
        document.querySelectorAll('.expand-row').forEach(tr => tr.remove());
        Object.values(chartInstances).forEach(inst => inst && inst.destroy && inst.destroy());
        chartInstances = {};
        expandedRowId = null;
    }

    // 분석타입 드롭다운 change 이벤트
    document.getElementById('type-select').addEventListener('change', function() {
        filterAndRender(0);
    });

    // 검색 폼 submit
    document.getElementById('ai-search-form').addEventListener('submit', function(e) {
        e.preventDefault();
        filterAndRender(0);
    });

    // 최초 진입
    filterAndRender(0);
});
