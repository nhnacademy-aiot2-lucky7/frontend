document.addEventListener('DOMContentLoaded', () => {
    const gatewaySelect = document.getElementById('gatewaySelect');
    const sensorSelect = document.getElementById('sensorSelect');
    const fieldSelect = document.getElementById('fieldSelect');
    const typeSelect = document.getElementById('typeSelect');
    const aggregationSelect = document.getElementById('aggregationSelect');
    const timeSelect = document.getElementById('timeSelect');
    const minInput = document.getElementById('minInput');
    const middleInput = document.getElementById('middleInput');
    const maxInput = document.getElementById('maxInput');
    const thresholdRadios = document.getElementsByName('threshold');
    const saveBtn = document.getElementById('saveBtn');

    const typeList = ['timeseries', 'table', 'gauge', 'piechart', 'histogram'];
    const aggregationList = ['avg', 'sum', 'min', 'max'];
    const timeList = ['1h', '6h', '12h', '1d', '7d', '30d'];

    let sensorBound = [];

    function populateSelect(selectElement, options) {
        selectElement.innerHTML = ''; // 중복 추가 방지
        options.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt;
            option.textContent = opt;
            selectElement.appendChild(option);
        });
    }

    function getSelectedBound() {
        const gatewayId = parseInt(gatewaySelect.value);
        const sensorId = sensorSelect.value;
        const field = fieldSelect.value;

        return sensorBound.find(b =>
            b.gatewayId === gatewayId &&
            b.sensorId === sensorId &&
            b.sensorType === field
        );
    }

    function applyThreshold(bound, type, value) {
        if (!bound) return;

        const isMin = type === 'min';
        const input = isMin ? minInput : maxInput;
        let val = '';

        if (isMin) {
            if (value === 'min') val = bound.minRangeMin;
            else if (value === 'middle') val = (bound.minRangeMin + bound.minRangeMax) / 2;
            else if (value === 'max') val = bound.minRangeMax;
        } else {
            if (value === 'min') val = bound.maxRangeMin;
            else if (value === 'middle') val = (bound.maxRangeMin + bound.maxRangeMax) / 2;
            else if (value === 'max') val = bound.maxRangeMax;
        }

        input.disabled = false;
        input.value = val ?? '';
    }

    function attachThresholdHandlers() {
        document.querySelectorAll('input[name="minThreshold"]').forEach(radio => {
            radio.addEventListener('change', () => {
                const bound = getSelectedBound();
                applyThreshold(bound, 'min', radio.value);
            });
        });

        document.querySelectorAll('input[name="maxThreshold"]').forEach(radio => {
            radio.addEventListener('change', () => {
                const bound = getSelectedBound();
                applyThreshold(bound, 'max', radio.value);
            });
        });
    }

    function updateThresholdUI() {
        const bound = getSelectedBound();
        if (!bound) {
            resetInputs();
        }
    }

    // 초기 센서 매핑 정보 불러오기
    fetch('/sensor')
        .then(response => {
            if (!response.ok) throw new Error('센서 매핑 정보를 불러오는 데 실패했습니다.');
            return response.json();
        })
        .then(data => {
            const gatewayList = [...new Set(data.map(item => item.gatewayId))];
            const sensorList = [...new Set(data.map(item => item.sensorId))];
            const fieldList = [...new Set(data.map(item => item.dataTypeEnName))];

            populateSelect(gatewaySelect, gatewayList);
            populateSelect(sensorSelect, sensorList);
            populateSelect(fieldSelect, fieldList);

            return fetch("/sensor/bound");
        })
        .then(response => {
            if (!response.ok) throw new Error("센서 임계치 범위를 불러올 수 없습니다.");
            return response.json();
        })
        .then(data => {
            sensorBound = data;

            attachThresholdHandlers();

            [gatewaySelect, sensorSelect, fieldSelect].forEach(select => {
                select.addEventListener('change', updateThresholdUI);
            });

            updateThresholdUI();
        })
        .catch(error => {
            console.error(error);
            alert('게이트웨이/센서/필드 또는 센서 임계치 정보를 불러오는 중 오류가 발생했습니다.');
        });

    populateSelect(typeSelect, typeList);
    populateSelect(aggregationSelect, aggregationList);
    populateSelect(timeSelect, timeList);

    saveBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        try {
            const dashboardUid = new URLSearchParams(window.location.search).get("dashboardUid");
            const panelTitle = document.getElementById('name').value;
            const gatewayId = parseInt(gatewaySelect.value);
            const sensorId = sensorSelect.value;
            const field = fieldSelect.value;

            const width = parseInt(document.getElementById('width').value, 10);
            const height = parseInt(document.getElementById('height').value, 10);

            const type = typeSelect.value;
            const aggregation = aggregationSelect.value;
            const time = timeSelect.value;

            const min = !minInput.disabled ? parseFloat(minInput.value) : null;
            const max = !maxInput.disabled ? parseFloat(maxInput.value) : null;

            const departmentId = localStorage.getItem('departmentId');

            const typeRes = await fetch(`/data-types/${field}`);
            if (!typeRes.ok) {
                throw new Error(`데이터 타입 정보를 불러오지 못했습니다: ${typeRes.status}`);
            }
            const typeInfo = await typeRes.json();
            const dataTypeKrName = typeInfo.type_kr_name;

            // const panelWithRuleRequest = {
            //     createPanelRequest: {
            //         dashboardUid,
            //         panelId: null,
            //         panelTitle,
            //         field: field,                      // @JsonProperty("type_en_name")
            //         gatewayId: gatewayId,              // @JsonProperty("gateway_id")
            //         sensorId: sensorId,                // @JsonProperty("sensor_id")
            //         dataTypeKrName: dataTypeKrName,    // @JsonProperty("type_kr_name")
            //         gridPos: { w: width, h: height },
            //         type: type,
            //         aggregation: aggregation,
            //         time: time,
            //         thresholdMin: min,                 // @JsonProperty("threshold_min")
            //         thresholdMax: max,                 // @JsonProperty("threshold_max")
            //         bucket: "team1-sensor-data",
            //         measurement: "sensor-data"
            //     },
            //     ruleRequest: {
            //         gatewayId: gatewayId,
            //         sensorId: sensorId,
            //         sensorType: field,
            //         departmentId: departmentId
            //     }
            // };

            const createPanelRequest = {
                dashboardUid: dashboardUid,
                panelId: null,
                panelTitle: panelTitle,
                sensorFieldRequestDto: [
                    {
                        type_en_name: "field",      // Java @JsonProperty("type_en_name")
                        gateway_id: 1,            // Java @JsonProperty("gateway_id") (숫자만 넣어주세요)
                        sensor_id: "sensorId"       // Java @JsonProperty("sensor_id")
                    }
                ],
                gridPos: { w: width, h: height },
                type: type,
                aggregation: aggregation,
                time: time,
                min: 15,                       // Java 필드 min
                max: 80,                       // Java 필드 max
                bucket: "team1-sensor-data",
                measurement: "sensor-data"
            };


            const response = await fetch("/api/test", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(createPanelRequest)
            });

            console.log(JSON.stringify(createPanelRequest, null, 2));
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`생성 실패: ${response.status} - ${errorText}`);
            }

            alert('패널이 성공적으로 생성되었습니다!');
            window.location.href = `/panels/${dashboardUid}`;
        } catch (error) {
            console.error('패널 저장 오류:', error);
            alert('패널 저장 중 오류가 발생했습니다.');
        }
    });
});