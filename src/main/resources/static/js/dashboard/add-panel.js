// DOM 요소 캐싱
const gatewaySelect = document.getElementById('gatewaySelect');
const sensorSelect = document.getElementById('sensorSelect');
const typeSelect = document.getElementById('typeSelect');
const aggregationSelect = document.getElementById('aggregationSelect');
const timeSelect = document.getElementById('timeSelect');
const minCustomInput = document.getElementById('minCustomValue');
const maxCustomInput = document.getElementById('maxCustomValue');
const saveBtn = document.getElementById('saveBtn');

const typeList = ['timeseries', 'table', 'gauge', 'piechart', 'histogram'];
const aggregationList = ['mean', 'sum', 'min', 'max'];
const timeList = ['1h', '6h', '12h', '1d', '7d', '30d'];

// 드롭다운 채우기 함수
function populateSelect(selectElement, options) {
    selectElement.innerHTML = '';
    options.forEach(item => {
        const option = document.createElement('option');
        option.value = item.value || item;
        option.textContent = item.text || item;
        selectElement.appendChild(option);
    });
}

// 게이트웨이 목록 불러오기
async function getAllGateways() {
    try {
        const res = await fetch(`https://luckyseven.live/api/gateways/department/1`);
        if (!res.ok) throw new Error('게이트웨이 목록 불러오기 실패');
        return await res.json();
    } catch (err) {
        console.error(err);
        alert('게이트웨이 목록 로딩 오류');
        return [];
    }
}

// 센서 데이터 요청
async function getSensorDataAndField(gatewayId) {
    try {
        const res = await fetch(`https://luckyseven.live/api/sensor-data-mappings/gateway-id/${gatewayId}/search-status?status=COMPLETED`);
        if (!res.ok) throw new Error('센서 매056핑 정보 실패');
        return await res.json();
    } catch (err) {
        console.error(err);
        alert('센서 매핑 정보 로딩 오류');
    }
}

// 임계치 정보 불러오기
async function getThreshold(selectedGatewayId, selectedSensorId, selectedField, unit) {
    try {
        const thresholdRes = await fetch(`https://luckyseven.live/api/threshold-histories/gateway-id/${selectedGatewayId}/sensor-id/${selectedSensorId}/type-en-name/${selectedField}`);
        if (!thresholdRes.ok) throw new Error("임계치 정보 조회 실패");
        const threshold = await thresholdRes.json();
        if (threshold.min_range_min < 0) threshold.min_range_min = 0;
        if (threshold.min_range_max < 0) threshold.min_range_max = 0;
        if (threshold.max_range_min < 0) threshold.max_range_min = 0;
        if (threshold.max_range_max < 0) threshold.max_range_max = 0;

        document.getElementById('minMinValueText').textContent = `${threshold.min_range_min} ${unit}`;
        document.getElementById('minMiddleValueText').textContent = parseFloat(((threshold.min_range_min * 3 + threshold.min_range_max * 7) / 10).toFixed(2)) + ` ${unit}`;
        document.getElementById('minMaxValueText').textContent = threshold.min_range_max + ` ${unit}`;
        document.getElementById('maxMinValueText').textContent = threshold.max_range_min + ` ${unit}`;
        document.getElementById('maxMiddleValueText').textContent = parseFloat(((threshold.max_range_min * 3 + threshold.max_range_max * 7) / 10).toFixed(2)) + ` ${unit}`;
        document.getElementById("maxMaxValueText").textContent = threshold.max_range_max + ` ${unit}`;
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
}

// 임계치 라디오 버튼 이벤트 처리
function handleThresholdRadioChange(thresholdName, inputElement, valueTextElement) {
    document.querySelectorAll(`input[name="${thresholdName}"]`).forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'custom') {
                inputElement.style.display = 'inline-block';
                inputElement.focus();
                valueTextElement.textContent = '';
            } else {
                inputElement.style.display = 'none';
                valueTextElement.textContent = '';
            }
        });
    });
    inputElement.addEventListener('input', () => {
        const value = inputElement.value.trim();
        if (!isNaN(value) && value !== '') {
            valueTextElement.textContent = `사용자 입력 값: ${value}`;
        } else {
            valueTextElement.textContent = '';
        }
    });
}

// 라디오 버튼 클릭 시 텍스트 박스 표시/숨기기
function handleRadioButtonChange() {
    const minRadio = document.querySelector('input[name="minThreshold"]:checked');
    const maxRadio = document.querySelector('input[name="maxThreshold"]:checked');
    document.getElementById('minCustomValue').style.display = minRadio.value === 'custom' ? 'inline-block' : 'none';
    document.getElementById('maxCustomValue').style.display = maxRadio.value === 'custom' ? 'inline-block' : 'none';
}

// 임계치 범위 체크
function checkRange(value, type){
    let min, max;
    if(type == 'min'){
        min = parseFloat(document.getElementById('minMinValueText').textContent);
        max = parseFloat(document.getElementById('minMaxValueText').textContent);
    }else{
        min = parseFloat(document.getElementById('maxMinValueText').textContent);
        max = parseFloat(document.getElementById('maxMaxValueText').textContent);
    }
    const val = parseFloat(value);
    if (isNaN(val) || val < min || val > max) {
        alert(`값은 ${min} 이상 ${max} 이하이어야 합니다.`);
        throw new Error(`임계치 값은 ${min} 이상 ${max} 이하이어야 합니다.`);
    }
}

// 폼 데이터 수집
function gatherFormData() {
    const dashboardUid = document.getElementById('dashboardUid').value;
    const panelTitle = document.getElementById('name').value;
    const gatewayId = parseInt(document.getElementById('gatewaySelect').value);
    const sensorId = document.getElementById('sensorSelect').value.split('-')[0];
    const field = document.getElementById('sensorSelect').value.split('-')[1];
    const width = parseInt(document.getElementById('width').value, 10);
    const height = parseInt(document.getElementById('height').value, 10);
    const type = document.getElementById('typeSelect').value;
    const aggregation = document.getElementById('aggregationSelect').value;
    const time = document.getElementById('timeSelect').value;

    // min 임계치 값 추출
    let minText = document.querySelector('input[name="minThreshold"]:checked').value;
    if (minText === 'min') minText = 'minMinValueText';
    else if (minText === 'middle') minText = 'minMiddleValueText';
    else if (minText === 'max') minText = 'minMaxValueText';
    let min = document.getElementById(minText).textContent.split(" ")[0];
    const minCustomValue = document.getElementById("minCustomValue").value;

    // max 임계치 값 추출
    let maxText = document.querySelector('input[name="maxThreshold"]:checked').value;
    if (maxText === 'min') maxText = 'maxMinValueText';
    else if (maxText === 'middle') maxText = 'maxMiddleValueText';
    else if (maxText === 'max') maxText = 'maxMaxValueText';
    let max = document.getElementById(maxText).textContent.split(" ")[0];
    const maxCustomValue = document.getElementById("maxCustomValue").value;

    if((min || minCustomValue) && (max || maxCustomValue)) {
        if (minCustomValue) min = minCustomValue;
        if (maxCustomValue) max = maxCustomValue;
    } else {
        throw new Error('임계치는 필수 사항입니다!');
    }

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
            sensorFieldRequestDto: {
                field: formData.field,
                gatewayId: formData.gatewayId,
                sensorId: formData.sensorId
            },
            gridPos: { w: formData.width, h: formData.height },
            type: formData.type,
            aggregation: formData.aggregation,
            time: formData.time,
            min: formData.min,
            max: formData.max,
            bucket: "team1-sensor-data",
            measurement: "sensor_data"
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

// 초기화 및 이벤트 등록
document.addEventListener('DOMContentLoaded', async () => {
    const gateways = await getAllGateways();
    if (!Array.isArray(gateways) || gateways.length === 0) {
        throw new Error('게이트웨이 정보가 없습니다.');
    }
    const sensorInfos = await getSensorDataAndField(gateways[0].gateway_id);
    if (!Array.isArray(sensorInfos) || sensorInfos.length === 0) {
        throw new Error('센서 정보가 없습니다.');
    }
    await getThreshold(gateways[0].gateway_id, sensorInfos[0].sensor_id, sensorInfos[0].type_en_name, sensorInfos[0].type_unit);

    populateSelect(gatewaySelect, gateways.map(gw => ({ value: gw.gateway_id, text: gw.gateway_name })));
    populateSelect(sensorSelect, sensorInfos.map(ss => ({
        value: `${ss.sensor_id}-${ss.type_en_name}-${ss.type_unit}`,
        text: `${ss.location}-${ss.type_en_name}-${ss.spot}`
    })));
    populateSelect(typeSelect, typeList);
    populateSelect(aggregationSelect, aggregationList);
    populateSelect(timeSelect, timeList);

    minCustomInput.style.display = 'none';
    maxCustomInput.style.display = 'none';

    handleThresholdRadioChange('minThreshold', minCustomInput, document.getElementById('minValueText'));
    handleThresholdRadioChange('maxThreshold', maxCustomInput, document.getElementById('maxValueText'));

    gatewaySelect.addEventListener('change', async (event) => {
        const selectedGatewayId = event.target.value;
        if (selectedGatewayId) {
            const sensorInfos = await getSensorDataAndField(selectedGatewayId);
            populateSelect(sensorSelect, sensorInfos.map(ss => ({
                value: `${ss.sensor_id}-${ss.type_en_name}-${ss.type_unit}`,
                text: `${ss.location}-${ss.type_en_name}-${ss.spot}`
            })));
        }
    });

    sensorSelect.addEventListener('change', async (event) => {
        const selectedGatewayId = gatewaySelect.value;
        const [selectedSensorId, selectedField, typeUnit] = event.target.options[event.target.selectedIndex].value.split('-');
        if (selectedGatewayId && selectedSensorId && selectedField && typeUnit) {
            await getThreshold(selectedGatewayId, selectedSensorId, selectedField, typeUnit);
        }
    });

    saveBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
            const formData = gatherFormData();
            try {
                checkRange(formData.min, 'min');
                checkRange(formData.max, 'max')
            } catch(error) {
                alert(error);
            }
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

    // 라디오 버튼 이벤트 등록
    document.querySelectorAll('input[name="minThreshold"]').forEach(radio => {
        radio.addEventListener('change', handleRadioButtonChange);
    });
    document.querySelectorAll('input[name="maxThreshold"]').forEach(radio => {
        radio.addEventListener('change', handleRadioButtonChange);
    });
});
