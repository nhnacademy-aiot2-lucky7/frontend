document.addEventListener('DOMContentLoaded', () => {
    const gatewaySelect = document.getElementById('gatewaySelect');
    const sensorSelect = document.getElementById('sensorSelect');
    const fieldSelect = document.getElementById('fieldSelect');
    const typeSelect = document.getElementById('typeSelect');
    const aggregationSelect = document.getElementById('aggregationSelect');
    const timeSelect = document.getElementById('timeSelect');
    const minInput = document.getElementById('minValue');
    const maxInput = document.getElementById('maxValue');
    const thresholdRadios = document.getElementsByName('threshold');
    const saveBtn = document.getElementById('saveBtn');

    // 샘플 옵션 목록 (API 연동 시 이 부분 수정)

    const typeList = ['timeseries', 'table', 'gauge', 'piechart', 'histogram'];
    const aggregationList = ['avg', 'sum', 'min', 'max'];
    const timeList = ['1h', '6h', '12h', '1d', '7d','30d'];

    function populateSelect(selectElement, options) {
        options.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt;
            option.textContent = opt;
            selectElement.appendChild(option);
        });
    }

    // 📡 센서 매핑 정보 API 호출
    fetch('/sensor')
        .then(response => {
            if (!response.ok) {
                throw new Error('센서 매핑 정보를 불러오는 데 실패했습니다.');
            }
            return response.json();
        })
        .then(data => {
            const gatewayList = data.map(item => item.gatewayId);
            const sensorList = data.map(item => item.sensorId);
            const fieldList = data.map(item => item.dataTypeEnName);

            populateSelect(gatewaySelect, gatewayList);
            populateSelect(sensorSelect, sensorList);
            populateSelect(fieldSelect, fieldList);
        })
        .catch(error => {
            console.error(error);
            alert('게이트웨이/센서/필드를 불러오는 중 오류가 발생했습니다.');
        });

    // 고정 옵션 select 박스 채우기
    populateSelect(typeSelect, typeList);
    populateSelect(aggregationSelect, aggregationList);
    populateSelect(timeSelect, timeList);

    // threshold 라디오 제어
    thresholdRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.value === 'min') {
                minInput.disabled = false;
                maxInput.disabled = true;
                maxInput.value = '';
            } else if (radio.value === 'max') {
                minInput.disabled = true;
                maxInput.disabled = false;
                minInput.value = '';
            } else {
                minInput.disabled = true;
                maxInput.disabled = true;
                minInput.value = '';
                maxInput.value = '';
            }
        });
    });

    // 저장 버튼 이벤트
    saveBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        try {
            const dashboardUid = new URLSearchParams(window.location.search).get("dashboardUid");
            const panelTitle = document.getElementById('name').value;
            const gatewayId = parseInt(document.getElementById('gatewaySelect').value);
            const sensorId = document.getElementById('sensorSelect').value;
            const field = document.getElementById('fieldSelect').value;

            const width = parseInt(document.getElementById('width').value, 10);
            const height = parseInt(document.getElementById('heigh').value, 10);

            const type = document.getElementById('typeSelect').value;
            const aggregation = document.getElementById('aggregationSelect').value;
            const time = document.getElementById('timeSelect').value;

            const min = !document.getElementById('minValue').disabled ? parseInt(document.getElementById('minValue').value) : null;
            const max = !document.getElementById('maxValue').disabled ? parseInt(document.getElementById('maxValue').value) : null;

            const departmentId = localStorage.getItem('departmentId');
            const role = localStorage.getItem('role'); // 'admin' or 'user'
            const endpoint = role === 'admin' ? '/admin/panel' : '/users/panel';

            // ✅ dataTypeKrName API 요청
            const dataTypeEnName = field;
            const typeRes = await fetch(`/data-types/${dataTypeEnName}`);

            if (!typeRes.ok) {
                new Error(`데이터 타입 정보를 불러오지 못했습니다: ${typeRes.status}`);
            }

            const typeInfo = await typeRes.json();
            const dataTypeKrName = typeInfo.dataTypeKrName;

            // ✅ 패널 요청 데이터 구성
            const panelData = {
                dashboardUid: dashboardUid,
                panelTitle: panelTitle,
                sensorFieldRequestDto: [{
                    gatewayId: gatewayId,
                    sensorId: sensorId,
                    field: field,
                    departmentId: departmentId,
                    dataTypeEnName: dataTypeEnName,
                    dataTypeKrName: dataTypeKrName,
                    thresholdMin: min,
                    thresholdMax: max
                }],
                gridPos: {
                    w: width,
                    h: height
                },
                type: type,
                aggregation: aggregation,
                time: time,
                min: min,
                max: max
            };

            // ✅ 패널 저장 요청
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(panelData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                new Error(`저장 실패: ${response.status} - ${errorText}`);
            }

            alert('패널이 성공적으로 저장되었습니다!');
            window.location.href = '/pages-panel-list.html';

        } catch (error) {
            console.error('패널 저장 오류:', error);
            alert('패널 저장 중 오류가 발생했습니다.');
        }
    });
});
