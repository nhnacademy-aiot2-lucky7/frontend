document.addEventListener('DOMContentLoaded', async () => {
    // DOM 요소들
    const gatewaySelect = document.getElementById('gatewaySelect');
    const sensorSelect = document.getElementById('sensorSelect');
    const fieldSelect = document.getElementById('fieldSelect');
    const typeSelect = document.getElementById('typeSelect');
    const aggregationSelect = document.getElementById('aggregationSelect');
    const timeSelect = document.getElementById('timeSelect');
    const minInput = document.getElementById('minInput');
    const maxInput = document.getElementById('maxInput');
    const minCustomValue = document.getElementById('minCustomValue');
    const maxCustomValue = document.getElementById('maxCustomValue');
    const saveBtn = document.getElementById('saveBtn');

    // 라디오 버튼 아래에 값 표시할 텍스트 요소
    const minValueText = document.getElementById('minValueText');  // 최소값 텍스트
    const maxValueText = document.getElementById('maxValueText');  // 최대값 텍스트

    // 타입, 집계 방식, 시간 옵션
    const typeList = ['timeseries', 'table', 'gauge', 'piechart', 'histogram'];
    const aggregationList = ['avg', 'sum', 'min', 'max'];
    const timeList = ['1h', '6h', '12h', '1d', '7d', '30d'];

    // 임의의 min, max 값 설정 (테스트용)
    const defaultMin = 10;  // 임의의 최소값
    const defaultMax = 100; // 임의의 최대값

    // Gateway, Sensor, Field 데이터
    let sensorBound = [];

    // 게이트웨이 목록 불러오기
    const gateways = await getAllGateways();
    if (!Array.isArray(gateways) || gateways.length === 0) {
        throw new Error('게이트웨이 정보가 없습니다.');
    }

    const gatewayOptions = gateways.map(gw => ({
        value: gw.gateway_id, text: gw.gateway_name
    }));

    populateSelect(typeSelect, typeList);
    populateSelect(aggregationSelect, aggregationList);
    populateSelect(timeSelect, timeList);
    populateSelect(gatewaySelect, gatewayOptions);

    // 게이트웨이 선택 시 센서 데이터 불러오기
    gatewaySelect.addEventListener('change', handleGatewayChange);

    // 저장 버튼 클릭 시 데이터 처리
    saveBtn.addEventListener('click', handleSaveBtnClick);

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

    // 임의의 값을 min, max input에 설정
    minInput.value = defaultMin;
    maxInput.value = defaultMax;

    // 첫 로드 시 'AI 추천' 값 텍스트로 표시
    minValueText.textContent = defaultMin;  // 첫 로드 시 AI 추천값 표시
    maxValueText.textContent = defaultMax;  // 첫 로드 시 AI 추천값 표시
});

// 라디오 버튼 클릭 시 텍스트 박스 표시/숨기기 처리
function handleRadioButtonChange() {
    const minRadio = document.querySelector('input[name="minThreshold"]:checked');
    const maxRadio = document.querySelector('input[name="maxThreshold"]:checked');

    // '사용자 설정'을 클릭했을 때만 텍스트 박스를 보여줌
    document.getElementById('minCustomValue').style.display = minRadio.value === 'custom' ? 'inline-block' : 'none';
    document.getElementById('maxCustomValue').style.display = maxRadio.value === 'custom' ? 'inline-block' : 'none';

    // 'AI 추천'을 선택했을 때는 텍스트 박스를 숨기고 기본값을 설정
    if (minRadio.value === 'middle') {
        // AI 추천처럼 보이도록 설정 (임의 값)
        const randomMin = generateRandomValue(minInput.value, maxInput.value);
        minValueText.textContent = randomMin;  // AI 추천 값으로 보여짐
        minInput.disabled = true;  // 입력 불가
    } else {
        minInput.disabled = false;
    }

    if (maxRadio.value === 'middle') {
        const randomMax = generateRandomValue(minInput.value, maxInput.value);
        maxValueText.textContent = randomMax;  // AI 추천 값으로 보여짐
        maxInput.disabled = true;  // 입력 불가
    } else {
        maxInput.disabled = false;
    }
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

// 게이트웨이 변경 시 센서 데이터 불러오기
async function handleGatewayChange(event) {
    const selectedValue = event.target.value;

    if (selectedValue) {
        const sensorData = await getSensorData(selectedValue);
        await getThreshold(selectedValue);
        console.log(sensorData);  // 센서 데이터 처리 로직
    }
}

// 저장 버튼 클릭 시 처리
async function handleSaveBtnClick(e) {
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
}

// 폼 데이터 수집
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

    const min = !minInput.disabled ? parseFloat(minInput.value) : null;
    const max = !maxInput.disabled ? parseFloat(maxInput.value) : null;

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
async function getThreshold(selectedGatewayId) {
    try {
        const thresholdRes = await fetch(`https://luckyseven.live/api/threshold-histories/gateway-id/${selectedGatewayId}`);
        if (!thresholdRes.ok) throw new Error("임계치 정보 조회 실패");

        const threshold = await thresholdRes.json();
        // 임계치 값을 minInput과 maxInput에 표시
        minInput.value = threshold.minRangeMin || 10; // 기본 임의 값
        maxInput.value = threshold.maxRangeMax || 100; // 기본 임의 값

        attachThresholdHandlers(threshold);
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
}

// 센서 데이터 요청
async function getSensorData(gatewayId) {
    try {
        const res = await fetch(`https://luckyseven.live/api/sensor-data-mappings/gateway-id/${gatewayId}/sensors`);
        if (!res.ok) throw new Error('센서 매핑 정보 실패');

        return await res.json();
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
function applyThreshold(threshold, type, value) {
    const input = type === 'min' ? minInput : maxInput;
    let val = '';

    if (type === 'min') {
        val = value === 'min' ? threshold.minRangeMin :
            value === 'middle' ? generateRandomValue(threshold.minRangeMin, threshold.minRangeMax) :
                threshold.minRangeMax;
    } else {
        val = value === 'min' ? threshold.maxRangeMin :
            value === 'middle' ? generateRandomValue(threshold.maxRangeMin, threshold.maxRangeMax) :
                threshold.maxRangeMax;
    }

    input.disabled = false;
    input.value = val ?? '';
}

// 선택 사항 드롭다운 채우기
function populateSelect(selectElement, options) {
    selectElement.innerHTML = ''; // 기존 내용 초기화
    options.forEach(item => {
        const option = document.createElement('option');
        option.value = item;
        option.textContent = item;
        selectElement.appendChild(option);
    });
}
