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

    function applyThresholdLimits(bound) {
        const selected = document.querySelector('input[name="threshold"]:checked')?.value;

        const hasMin = bound.minRangeMin !== null && bound.minRangeMin !== undefined;
        const hasMax = bound.maxRangeMax !== null && bound.maxRangeMax !== undefined;
        const middleValue = hasMin && hasMax ? (bound.minRangeMin + bound.maxRangeMax) / 2 : null;

        if (selected === 'min' && hasMin) {
            minInput.disabled = false;
            minInput.value = bound.minRangeMin ?? '';
            minInput.min = bound.minRangeMin ?? '';
            minInput.max = bound.minRangeMax ?? '';

            middleInput.disabled = true;
            middleInput.value = '';

            maxInput.disabled = true;
            maxInput.value = '';
        } else if (selected === 'middle' && middleValue !== null) {
            middleInput.disabled = false;
            middleInput.value = middleValue;

            minInput.disabled = true;
            minInput.value = '';

            maxInput.disabled = true;
            maxInput.value = '';
        } else if (selected === 'max' && hasMax) {
            maxInput.disabled = false;
            maxInput.value = bound.maxRangeMax ?? '';
            maxInput.min = bound.maxRangeMin ?? '';
            maxInput.max = bound.maxRangeMax ?? '';

            minInput.disabled = true;
            minInput.value = '';

            middleInput.disabled = true;
            middleInput.value = '';
        } else {
            minInput.disabled = true;
            maxInput.disabled = true;
            middleInput.disabled = true;

            minInput.value = '';
            maxInput.value = '';
            middleInput.value = '';
        }
    }

    function updateThresholdUI() {
        const bound = getSelectedBound();

        if (!bound) {
            minInput.disabled = true;
            maxInput.disabled = true;
            middleInput.disabled = true;
            minInput.value = '';
            maxInput.value = '';
            middleInput.value = '';

            document.getElementById('radioNone').checked = true;
            return;
        }

        const hasMin = bound.thresholdMin !== null && bound.thresholdMin !== undefined;
        const hasMax = bound.thresholdMax !== null && bound.thresholdMax !== undefined;
        const hasMiddle = hasMin && hasMax;

        if (hasMin && !hasMax) {
            document.getElementById('radioMin').checked = true;
        } else if (hasMiddle) {
            document.getElementById('radioMiddle').checked = true;
        } else if (!hasMin && hasMax) {
            document.getElementById('radioMax').checked = true;
        } else {
            document.getElementById('radioNone').checked = true;
        }

        applyThresholdLimits(bound);
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

            thresholdRadios.forEach(radio => {
                radio.addEventListener('change', () => {
                    const bound = getSelectedBound();
                    console.log("API 응답", bound);
                    if (bound) applyThresholdLimits(bound);
                });
            });

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
            const middle = !middleInput.disabled ? parseFloat(middleInput.value) : null;
            const max = !maxInput.disabled ? parseFloat(maxInput.value) : null;

            const departmentId = localStorage.getItem('departmentId');

            const typeRes = await fetch(`/data-types/${field}`);
            if (!typeRes.ok) {
                throw new Error(`데이터 타입 정보를 불러오지 못했습니다: ${typeRes.status}`);
            }
            const typeInfo = await typeRes.json();
            const dataTypeKrName = typeInfo.type_kr_name;

            const createPanelRequest = {
                dashboardUid,
                panelId: null,
                panelTitle,
                gateway_id: gatewayId,
                sensor_id: sensorId,
                department_id: departmentId,
                gridPos: { w: width, h: height },
                type,
                aggregation,
                time,
                threshold_min: min,
                threshold_max: max,
                bucket: "team1-sensor-data",
                measurement: "sensor-data"
            };

            const response = await fetch("/panels", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    createPanelRequest
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`저장 실패: ${response.status} - ${errorText}`);
            }

            alert('패널이 성공적으로 저장되었습니다!');
            window.location.href = `/panels/${dashboardUid}`;
        } catch (error) {
            console.error('패널 저장 오류:', error);
            alert('패널 저장 중 오류가 발생했습니다.');
        }
    });
});