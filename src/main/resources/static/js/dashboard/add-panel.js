document.addEventListener('DOMContentLoaded', async () => {
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

    const typeList = ['timeseries', 'table', 'gauge', 'piechart', 'histogram'].map(item => ({
        value: item, text: item
    }));

    const aggregationList = ['avg', 'sum', 'min', 'max'].map(item => ({
        value: item, text: item
    }));

    const timeList = ['1h', '6h', '12h', '1d', '7d', '30d'].map(item => ({
        value: item, text: item
    }));

    let sensorBound = [];

    const gateways = await getAllGateways();

    if (!Array.isArray(gateways) || gateways.length === 0) {
        throw new Error('게이트웨이 정보가 없습니다.');
    }

    const gateways = gateways.map(gw => {
        return { value: gw.gateway_id, text: gw.gateway_name };
    });
    const initGid = gatewayIds[0];
    console.log("최초 드롭다운 gatewayId:", initGid);

    populateSelect(typeSelect, typeList);
    populateSelect(aggregationSelect, aggregationList);
    populateSelect(timeSelect, timeList);
    populateSelect(gatewaySelect, gateways);

    let sensorData;

    gatewaySelect.addEventListener('change', async (event) => {
        const selectedValue = event.target.value;

        if (gatewayIds.length > 0) {
            sensorData = await getSensorData(selectedValue);
            await getThreshold(selectedValue);
        }

        // sensorData를 처리하는 로직 추가 가능
        console.log(sensorData);
    });

    saveBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        try {
            const dashboardUid = document.getElementById('dashboardUid').value;
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

            const departmentId = window.currentUser?.department?.departmentId;

            const typeRes = await fetch(`https://luckyseven.live/api/data-types/${field}`);
            if (!typeRes.ok) {
                alert(`데이터 타입 정보를 불러오지 못했습니다: ${typeRes.status}`);

                return {
                    type_kr_name: "한글이름"
                };
            }

            const typeInfo = await typeRes.json();
            return typeInfo;

            const panelWithRuleRequest = {
                createPanelRequest: {
                    dashboardUid: dashboardUid,
                    panelId: null,
                    panelTitle: panelTitle,
                    sensorFieldRequestDto: [{
                        type_en_name: field,
                        gateway_id: gatewayId,
                        sensor_id: sensorId
                        }],
                    gridPos: {w: width, h: height},
                    type: type,
                    aggregation: aggregation,
                    time: time,
                    thresholdMin: min,
                    thresholdMax: max,
                    bucket: "team1-sensor-data",
                    measurement: "sensor-data"
                },
                ruleRequest: {
                    gateway_id: gatewayId,
                    sensor_id: sensorId,
                    department_id: departmentId,
                    type_en_name: field,
                    type_kr_name: typeInfo.type_kr_name,
                    threshold_min: min,
                    threshold_max: max
                }
            };

            const response = await fetch("https://luckyseven.live/api/panels", {
                method: "POST",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(panelWithRuleRequest)
            });

            console.log(JSON.stringify(panelWithRuleRequest, null, 2));
            if (!response.ok) {
                const errorText = await response.text();
                alert(`생성 실패: ${response.status} - ${errorText}`);
            } else {
                alert('패널이 성공적으로 생성되었습니다!');
                window.location.href = `/panel/${dashboardUid}/${panelTitle}`;
            }
        } catch (error) {
            console.error('패널 저장 오류:', error);
            alert('패널 저장 중 오류가 발생했습니다.');
        }
    });
});

// 임계치 정보 불러오기
const getThreshold = async (selectedGatewayId, selectedSensorId, selectedField) => {
    try {
        if(selectedSensorId != null && selectedField != null){
            // 하나의 센서라도 존재할 경우, 첫 번째 센서/필드에 대한 bound 정보 미리 로딩
            const thresholdRes = await fetch(
                `https://luckyseven.live/api/threshold-histories/gateway-id/${selectedGatewayId}/sensor-id/${selectedSensorId}/type-en-name/${selectedField}`
            );

            if (!thresholdRes.ok) {
                throw new Error("임계치 정보 조회 실패. 나중에 다시 시도하세요.");
            }

            const threshold = await thresholdRes.json();

            attachThresholdHandlers();
            [gatewaySelect, sensorSelect, fieldSelect].forEach(select => {
                select.addEventListener('change', updateThresholdUI, {once: true});
            });

            updateThresholdUI();
        }
    } catch (err) {
        console.error(err);
        alert(err.message());

        const dashboardUid = document.getElementById('dashboardUid').value;
        if (dashboardUid) {
            window.location.href = `/panel/${dashboardUid}`;
        } else {
            window.location.href = '/dashboard-info';
        }
    }
};

const getSensorData = async (gatewayId) => {
    try {
        // 센서 매핑 정보 요청
        const res = await fetch(`https://luckyseven.live/api/sensor-data-mappings/gateway-id/${gatewayId}/sensors`);
        if (!res.ok) throw new Error('센서 매핑 정보 실패');

        const data = await res.json();
        console.log("센서 데이터: ", data);

        // 중복을 제거한 센서 목록과 필드 목록
        const sensorList = [...new Set(data.map(item => item.sensor_id))];
        const fieldList = [...new Set(data.map(item => item.type_en_name))];

        return { sensorList, fieldList };

    } catch (err) {
        console.error(err);
        alert('센서 매핑 정보 로딩 오류');
    }
};

const attachThresholdHandlers = () => {
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
};

const updateThresholdUI = () => {
    const bound = getSelectedBound();
    if (!bound) {
        minInput.value = '';
        maxInput.value = '';
        minInput.disabled = true;
        maxInput.disabled = true;
    }
};

const getAllGateways = async () => {
    try {
        const departmentId = window.currentUser?.department?.departmentId;
        const res = await fetch(`https://luckyseven.live/api/gateways/department/${departmentId}`);
        if (!res.ok) throw new Error('게이트웨이 목록 불러오기 실패');
        const gatewayInfo = await res.json();
        console.log("gatewayId:{}", gatewayInfo);
        return gatewayInfo;
    } catch (err) {
        console.error(err);
        alert('게이트웨이 목록 로딩 오류');
        return [];
    }
};

function populateSelect(selectElement, options) {
    selectElement.innerHTML = ''; // 중복 추가 방지
    options.forEach((value, text) => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = text;
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

    const input = type === 'min' ? minInput : maxInput;
    let val = '';

    if (type === 'min') {
        val = value === 'min' ? bound.minRangeMin :
            value === 'middle' ? (bound.minRangeMin * 3 + bound.minRangeMax * 7) / 10 :
                bound.minRangeMax;
    } else {
        val = value === 'min' ? bound.maxRangeMin :
            value === 'middle' ? (bound.maxRangeMin * 3 + bound.maxRangeMax * 7) / 10 :
                bound.maxRangeMax;
    }

    input.disabled = false;
    input.value = val ?? '';
}