document.addEventListener('DOMContentLoaded', async () => {
    // DOM 요소들
    const gatewaySelect = document.getElementById('gatewaySelect');
    const sensorSelect = document.getElementById('sensorSelect');
    const typeSelect = document.getElementById('typeSelect');
    const aggregationSelect = document.getElementById('aggregationSelect');
    const timeSelect = document.getElementById('timeSelect');

    const minMinText = document.getElementById('minMinValueText')
    const minMiddleText = document.getElementById('minMiddleValueText')
    const minMaxText = document.getElementById('minMaxValueText')

    const maxMinText = document.getElementById('maxMinValueText')
    const maxMiddleText = document.getElementById('maxMiddleValueText')
    const maxMaxText = document.getElementById('maxMaxValueText')

    const minCustomInput = document.getElementById('minCustomValue');
    const maxCustomInput = document.getElementById('maxCustomValue');
    const saveBtn = document.getElementById('saveBtn');

    const typeList = ['timeseries', 'table', 'gauge', 'piechart', 'histogram'];
    const aggregationList = ['avg', 'sum', 'min', 'max'];
    const timeList = ['1h', '6h', '12h', '1d', '7d', '30d'];

    const gateways = await getAllGateways();
    const sensorInfos = await getSensorDataAndField(gateways[0].gateway_id)
    await getThreshold(gateways[0].gateway_id, sensorInfos[0].sensor_id, sensorInfos[0].type_en_name, minMinText, maxMaxText)

    if (!Array.isArray(gateways) || gateways.length === 0) {
        throw new Error('게이트웨이 정보가 없습니다.');
    }
    if (!Array.isArray(sensorInfos) || sensorInfos.length === 0) {
        throw new Error('센서 정보가 없습니다.');
    }

    const gatewayOptions = gateways.map(gw => ({
        value: gw.gateway_id, text: gw.gateway_name
    }));

    const sensorOptions = sensorInfos.map(ss => ({
        value: ss.sensor_id, text: `${ss.location}-${ss.type_en_name}-${ss.spot}`
    }))

    populateSelect(typeSelect, typeList);
    populateSelect(aggregationSelect, aggregationList);
    populateSelect(timeSelect, timeList);
    populateSelect(gatewaySelect, gatewayOptions);
    populateSelect(sensorSelect, sensorOptions)

    let sensorBound = [];

    gatewaySelect.addEventListener('change', async (event) => {
        const selectedGatewayId = event.target.value;

        if (selectedGatewayId) {
            await getSensorDataAndField(selectedGatewayId);
        }
    });

    sensorSelect.addEventListener('change', async (event) => {
        const selectedSensorId = event.target.value;
        const selectedGatewayId = gatewaySelect.value;
        const selectedField = event.target.options[event.target.selectedIndex].textContent.split('-')[1];

        if (selectedGatewayId && selectedSensorId && selectedField) {
            await getThreshold(selectedGatewayId, selectedSensorId, selectedField, minMinText, maxMaxText);
        }
    });

    saveBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        try {
            const formData = gatherFormData();
            const typeInfo = await fetchTypeInfo(formData.field);

            const panelWithRuleRequest = createPanelRequest(formData, typeInfo);
            const response = await submitPanelRequest(panelWithRuleRequest);

            if (!response.ok) {
                const errorText = await response.text();
                alert(`생성 실패: ${response.status} - ${errorText}`);
            } else {
                alert('패널이 성공적으로 생성되었습니다!');
                window.location.href = `/panel/${formData.dashboardUid}/${formData.panelTitle}`;
            }
        } catch (error) {
            console.error('패널 저장 오류:', error);
            alert('패널 저장 중 오류가 발생했습니다.');
        }
    });

    // 기본값으로 'AI 추천' 라디오 버튼 선택
    document.querySelector('input[name="minThreshold"][value="middle"]').checked = true;
    document.querySelector('input[name="maxThreshold"][value="middle"]').checked = true;

    // '사용자 설정' 라디오 버튼 클릭 시 텍스트 박스 표시/숨기기
    handleRadioButtonChange();
    document.querySelectorAll('input[name="minThreshold"]').forEach(radio => {
        radio.addEventListener('change', handleRadioButtonChange);
    });
    document.querySelectorAll('input[name="maxThreshold"]').forEach(radio => {
        radio.addEventListener('change', handleRadioButtonChange);
    });
});

// 라디오 버튼 클릭 시 텍스트 박스 표시/숨기기 처리
function handleRadioButtonChange() {
    const minRadio = document.querySelector('input[name="minThreshold"]:checked');
    const maxRadio = document.querySelector('input[name="maxThreshold"]:checked');

    // '사용자 설정'을 클릭했을 때만 텍스트 박스를 보여줌
    document.getElementById('minCustomValue').style.display = minRadio.value === 'custom' ? 'inline-block' : 'none';
    document.getElementById('maxCustomValue').style.display = maxRadio.value === 'custom' ? 'inline-block' : 'none';

    // // 'AI 추천'을 선택했을 때는 텍스트 박스를 숨기고 기본값을 설정
    // if (minRadio.value === 'middle') {
    //     const randomMin = generateRandomValue(minInput.value, maxInput.value);
    //     minValueText.textContent = randomMin;  // AI 추천 값으로 보여짐
    //     minInput.disabled = true;  // 입력 불가
    // } else {
    //     minInput.disabled = false;
    // }
    //
    // if (maxRadio.value === 'middle') {
    //     const randomMax = generateRandomValue(minInput.value, maxInput.value);
    //     maxValueText.textContent = randomMax;  // AI 추천 값으로 보여짐
    //     maxInput.disabled = true;  // 입력 불가
    // } else {
    //     maxInput.disabled = false;
    // }
}

// 임계치 값에 비례하는 난수 생성 (min, max 값을 기준으로)
function generateRandomValue(minValue, maxValue) {
    const min = parseFloat(minValue);
    const max = parseFloat(maxValue);

    if (isNaN(min) || isNaN(max)) return '';

    // min과 max 비율로 난수 생성
    const random = Math.random();
    return (min + (max - min) * random).toFixed(2);  // 소수점 2자리로 값 표시
}

// 패널 요청 데이터 생성
function gatherFormData() {
    const dashboardUid = document.getElementById('dashboardUid').value;
    const panelTitle = document.getElementById('name').value;
    const gatewayId = parseInt(document.getElementById('gatewaySelect').value);
    const sensorId = document.getElementById('sensorSelect').value;
    const field = document.getElementById('fieldSelect').value;

    const width = parseInt(document.getElementById('width').value, 10);
    const height = parseInt(document.getElementById('height').value, 10);

    const type = document.getElementById('typeSelect').value;
    const aggregation = document.getElementById('aggregationSelect').value;
    const time = document.getElementById('timeSelect').value;

    // const min = !minInput.disabled ? parseFloat(minInput.value) : null;
    // const max = !maxInput.disabled ? parseFloat(maxInput.value) : null;

    return { dashboardUid, panelTitle, gatewayId, sensorId, field, width, height, type, aggregation, time, min, max };
}

// 데이터 타입 정보 요청
async function fetchTypeInfo(field) {
    const typeRes = await fetch(`https://luckyseven.live/api/data-types/${field}`);
    if (!typeRes.ok) {
        alert(`데이터 타입 정보를 불러오지 못했습니다: ${typeRes.status}`);
        throw new Error("데이터 타입 정보 불러오기 실패");
    }

    return await typeRes.json();
}

// 패널 요청 데이터 생성
function createPanelRequest(formData, typeInfo) {
    return {
        createPanelRequest: {
            dashboardUid: formData.dashboardUid,
            panelId: null,
            panelTitle: formData.panelTitle,
            sensorFieldRequestDto: [{
                type_en_name: formData.field,
                gateway_id: formData.gatewayId,
                sensor_id: formData.sensorId
            }],
            gridPos: { w: formData.width, h: formData.height },
            type: formData.type,
            aggregation: formData.aggregation,
            time: formData.time,
            thresholdMin: formData.min,
            thresholdMax: formData.max,
            bucket: "team1-sensor-data",
            measurement: "sensor-data"
        },
        ruleRequest: {
            gateway_id: formData.gatewayId,
            sensor_id: formData.sensorId,
            department_id: window.currentUser?.department?.departmentId,
            type_en_name: formData.field,
            type_kr_name: typeInfo.type_kr_name,
            threshold_min: formData.min,
            threshold_max: formData.max
        }
    };
}

// 패널 생성 요청 보내기
async function submitPanelRequest(panelWithRuleRequest) {
    return await fetch("https://luckyseven.live/api/panels", {
        method: "POST",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(panelWithRuleRequest)
    });
}

// 임계치 정보 불러오기
async function getThreshold(selectedGatewayId, selectedSensorId, selectedField, minMinText, maxMaxText) {
    try {
        const thresholdRes = await fetch(`https://luckyseven.live/api/threshold-histories/gateway-id/${selectedGatewayId}/sensor-id/${selectedSensorId}/type-en-name/${selectedField}`);
        if (!thresholdRes.ok) throw new Error("임계치 정보 조회 실패");

        const threshold = await thresholdRes.json();
        console.log(threshold)
        minMinText.value = threshold.min_range_min || 10; // 기본 임의 값
        maxMaxText.value = threshold.max_range_max || 100; // 기본 임의 값

        attachThresholdHandlers(threshold);
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
}

// 센서 데이터 요청
async function getSensorDataAndField(gatewayId) {
    try {
        const res = await fetch(`https://luckyseven.live/api/sensor-data-mappings/gateway-id/${gatewayId}/sensors`);
        if (!res.ok) throw new Error('센서 매핑 정보 실패');

        const sensorData = await res.json();

        return sensorData;
    } catch (err) {
        console.error(err);
        alert('센서 매핑 정보 로딩 오류');
    }
}

// 임계치 이벤트 핸들러 부착
function attachThresholdHandlers(threshold) {
    document.querySelectorAll('input[name="minThreshold"]').forEach(radio => {
        radio.addEventListener('change', () => applyThreshold(threshold, 'min', radio.value));
    });

    document.querySelectorAll('input[name="maxThreshold"]').forEach(radio => {
        radio.addEventListener('change', () => applyThreshold(threshold, 'max', radio.value));
    });
}

// 임계치 값 적용
// function applyThreshold(threshold, type, value) {
//     const input = type === 'min' ? minInput : maxInput;
//     let val = '';
//
//     if (type === 'min') {
//         val = value === 'min' ? threshold.minRangeMin :
//             value === 'middle' ? (threshold.minRangeMin * 3 + threshold.minRangeMax * 7) / 10 :
//                 threshold.minRangeMax;
//     } else {
//         val = value === 'min' ? threshold.maxRangeMin :
//             value === 'middle' ? (threshold.maxRangeMin * 3 + threshold.maxRangeMax * 7) / 10 :
//                 threshold.maxRangeMax;
//     }
//
//     input.disabled = false;
//     input.value = val ?? '';
// }

// 선택 사항 드롭다운 채우기
function populateSelect(selectElement, options) {
    selectElement.innerHTML = ''; // 기존 내용 초기화
    options.forEach(item => {
        const option = document.createElement('option');
        option.value = item.value || item; // item.value가 있을 경우 사용, 없으면 그대로 사용
        option.textContent = item.text || item; // item.text가 있을 경우 사용, 없으면 그대로 사용
        selectElement.appendChild(option);
    });
}

// 모든 게이트웨이 목록을 가져오는 함수
async function getAllGateways() {
    try {
        const departmentId = window.currentUser?.department?.departmentId;
        if (!departmentId) {
            throw new Error("Department ID가 없습니다.");
        }
        const res = await fetch(`https://luckyseven.live/api/gateways/department/1`);
        if (!res.ok) throw new Error('게이트웨이 목록 불러오기 실패');
        return await res.json();
    } catch (err) {
        console.error(err);
        alert('게이트웨이 목록 로딩 오류');
        return [];
    }
}
