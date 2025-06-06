const editBtn = document.getElementById('edit-toggle-btn');
const saveBtn = document.getElementById('save-btn');

document.addEventListener("DOMContentLoaded", async () => {
    const path = window.location.pathname;
    const gatewayId = path.split('/').pop();

    let response = await fetch(`https://luckyseven.live/api/gateways/${gatewayId}`, {
        method: 'GET',
        headers: {"Content-Type": "application/json"},
        credentials: 'include'
    }).then(response => response.json());

    console.log(JSON.stringify(response));

    const gateway = response.gateway;

    // ✅ Gateway 정보 표시
    const infoFields = [
        {field: "id", label: "Gateway ID", value: gateway.gateway_id},
        {field: "name", label: "Gateway 이름", value: gateway.gateway_name},
        {field: "protocol", label: "Protocol", value: gateway.iot_protocol},
        {field: "broker_ip", label: "Broker IP", value: gateway.address},
        {field: "port", label: "Port", value: gateway.port},
        {field: "status", label: "Gateway 상태", value: gateway.threshold_status},
        {field: "sensor_count", label: "센서 개수", value: gateway.sensor_count},
        {field: "created_at", label: "생성일자", value: gateway.created_at},
        {field: "updated_at", label: "수정일자", value: gateway.updated_at}
    ];

    const infoGrid = document.getElementById('info-grid');
    infoFields.forEach(({field, label, value}) => {
        const item = document.createElement('div');
        item.className = 'info-item';
        item.dataset.field = field;

        if (field === "status") {
            const statusText = value ? "활성화" : "비활성화";
            const statusClass = value ? "active" : "inactive";
            item.innerHTML = `
                <span class="label">${label}</span>
                <span class="value ${statusClass}" data-value="${statusText}">
                    ● ${statusText}
                </span>
            `;
        } else {
            item.innerHTML = `<span class="label">${label}</span><span class="value" data-value="${value}">${value}</span>`;
        }

        infoGrid.appendChild(item);
    });

    // 설명란
    document.getElementById('description').innerText = gateway.description;

    // ✅ 센서 그룹핑 및 렌더링
    const sensorSection = document.getElementById('sensor-section');
    const sensorGroups = {};

    response.sensors.forEach(sensor => {
        let location = sensor.sensor_location;

        if (
            location === undefined ||
            location === null ||
            (typeof location === 'string' && (location.trim() === '' || location.toLowerCase() === 'undefined'))
        ) {
            location = "기타";
        }

        if (!sensorGroups[location]) {
            sensorGroups[location] = [];
        }
        sensorGroups[location].push(sensor);
    });

    const sortedLocations = Object.keys(sensorGroups).sort((a, b) => {
        if (a === "기타") return 1;
        if (b === "기타") return -1;
        return a.localeCompare(b);
    });

    sortedLocations.forEach(location => {
        const locationTitle = document.createElement('h4');
        locationTitle.innerText = location;
        locationTitle.style.marginTop = '32px';
        sensorSection.appendChild(locationTitle);

        const sensorList = document.createElement('div');
        sensorList.className = 'sensor-list';
        sensorSection.appendChild(sensorList);

        sensorGroups[location].forEach(sensor => {
            const shortSensorId = sensor.sensor_id.substring(0, 6);
            const sensorName = sensor.sensor_name
                ? sensor.sensor_name
                : `${location}-${sensor.type_en_name}-${sensor.sensor_spot}`;

            const card = document.createElement('div');
            card.className = 'sensor-card';

            card.innerHTML = `
                <div class="sensor-field">
                    <span class="label">이름</span>
                    <span class="value">${sensorName}</span>
                </div>
                <div class="sensor-field">
                    <span class="label">아이디</span>
                    <span class="value">${sensor.sensor_id}</span>
                </div>
                <div class="sensor-field">
                    <span class="label">종류</span>
                    <span class="value">${sensor.type_en_name}</span>
                </div>
                <div class="sensor-field">
                    <span class="label">위치</span>
                    <span class="value">${sensor.sensor_spot}</span>
                </div>
            `;
            sensorList.appendChild(card);
        });
    });
});


// 수정 버튼 이벤트
editBtn.addEventListener('click', () => {
    document.querySelectorAll('[data-field]').forEach(item => {
        const field = item.dataset.field;
        const valueSpan = item.querySelector('[data-value]');
        const value = valueSpan ? valueSpan.innerText.replace(/^●\s*/, '') : null;

        if (field === 'description') {
            const descElem = document.getElementById('description');
            const descValue = descElem.innerText;
            descElem.innerHTML = `<textarea name="description" class="edit-textarea" rows="4">${descValue}</textarea>`;
        } else if (field === 'name') {
            // Gateway 이름은 input 필드로 변환
            item.innerHTML = `
                <span class="label">${item.querySelector('.label').innerText}</span>
                <input type="text" class="edit-input" name="gateway_name" value="${value}">
            `;
        }
        // id 제외한 나머지는 수정불가 처리 (요구사항대로)
    });

    editBtn.style.display = 'none';
    saveBtn.style.display = 'inline-block';
});

// 저장 버튼 이벤트
saveBtn.addEventListener('click', () => {
    // gateway_id는 info-grid 내 id 필드의 값에서 가져오기
    const idElem = document.querySelector('[data-field="id"] .value');
    const gateway_id = idElem ? idElem.dataset.value || idElem.innerText : null;

    // gateway_name과 description은 수정된 입력값에서 가져오기
    const nameInput = document.querySelector('input[name="gateway_name"]');
    const descInput = document.querySelector('textarea[name="description"]');

    if (!gateway_id) {
        alert('Gateway ID를 찾을 수 없습니다.');
        return;
    }

    const payload = {
        "gateway_id": gateway_id.trim(),
        "gateway_name": nameInput ? nameInput.value.trim() : '',
        "description": descInput ? descInput.value.trim() : ''
    };

    fetch(`https://luckyseven.live/api/gateways`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload),
        credentials: 'include'
    })
        .then(response => {
            if (!response.ok) throw new Error('서버 오류 발생');
            return response.json();
        })
        .then(data => {
            // 서버 저장 성공 시 UI 다시 출력
            // description은 textarea 대신 텍스트로 바꾸기

            // description textarea → 일반 텍스트로 복원
            const descElem = document.getElementById('description');
            if (descElem && descElem.tagName === 'DIV') {
                // description이 잘못된 상태로 있는 경우 처리
                descElem.innerText = payload.description;
            } else if (descElem) {
                descElem.innerText = payload.description;
            }

            // gateway_name input → 일반 텍스트로 복원
            const nameItem = document.querySelector('[data-field="name"]');
            if (nameItem) {
                const labelText = nameItem.querySelector('.label')?.innerText || 'Gateway 이름';
                nameItem.innerHTML = `
                    <span class="label">${labelText}</span>
                    <span class="value" data-value="${payload.gateway_name}">${payload.gateway_name}</span>
                `;
            }

            saveBtn.style.display = 'none';
            editBtn.style.display = 'inline-block';
            alert('저장되었습니다.');
        })
        .catch(error => {
            console.error('저장 실패:', error);
            alert(`저장 중 오류가 발생했습니다. 에러 메시지: ${error.message}`);
        });
});