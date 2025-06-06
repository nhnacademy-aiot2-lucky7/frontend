const editBtn = document.getElementById('edit-toggle-btn');
const saveBtn = document.getElementById('save-btn');

document.addEventListener("DOMContentLoaded", async () => {
    const path = window.location.pathname;
    const gatewayId = path.split('/').pop();

    let response = await fetch(`https://luckyseven.live/api/gateways/${gatewayId}`, {
        method: 'GET',
        headers: { "Content-Type": "application/json" },
        credentials: 'include'
    }).then(response => response.json());

    console.log(JSON.stringify(response));

    const gateway = response.gateway;

    // ✅ Gateway 정보 표시
    const infoFields = [
        { field: "id", label: "Gateway ID", value: gateway.gateway_id },
        { field: "name", label: "Gateway 이름", value: gateway.gateway_name },
        { field: "protocol", label: "Protocol", value: gateway.iot_protocol },
        { field: "brokerIp", label: "Broker IP", value: gateway.address },
        { field: "port", label: "Port", value: gateway.port },
        { field: "status", label: "Gateway 상태", value: gateway.threshold_status },
        { field: "sensorCount", label: "센서 개수", value: gateway.sensor_count },
        { field: "created_at", label: "생성일자", value: gateway.created_at },
        { field: "updated_at", label: "수정일자", value: gateway.updated_at }
    ];

    const infoGrid = document.getElementById('info-grid');
    infoFields.forEach(({ field, label, value }) => {
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

// ✅ 수정 버튼 이벤트
editBtn.addEventListener('click', () => {
    document.querySelectorAll('[data-field]').forEach(item => {
        const field = item.dataset.field;
        const value = item.querySelector('[data-value]').innerText.replace(/^●\s*/, '');

        if (field === 'description') {
            document.getElementById('description').innerHTML =
                `<textarea name="description" class="edit-textarea">${value}</textarea>`;
        } else if (!['created_at', 'updated_at', 'status', 'sensorCount'].includes(field)) {
            item.innerHTML = `
                <span class="label">${item.querySelector('.label').innerText}</span>
                <input type="text" class="edit-input" name="${field}" value="${value}">
            `;
        }
    });

    editBtn.style.display = 'none';
    saveBtn.style.display = 'inline-block';
});

// ✅ 저장 버튼 이벤트
saveBtn.addEventListener('click', () => {
    const payload = {};
    document.querySelectorAll('.edit-input').forEach(input => {
        payload[input.name] = input.value;
    });

    const desc = document.querySelector('.edit-textarea');
    if (desc) payload["description"] = desc.value;

    document.querySelectorAll('[data-field]').forEach(item => {
        const field = item.dataset.field;
        if (field === 'description') {
            document.getElementById('description').innerText = payload.description;
        } else if (!['created_at', 'updated_at', 'status', 'sensorCount'].includes(field)) {
            const label = item.querySelector('.label').innerText;
            item.innerHTML = `
                <span class="label">${label}</span>
                <span class="value" data-value="${payload[field]}">${payload[field]}</span>
            `;
        }
    });

    saveBtn.style.display = 'none';
    editBtn.style.display = 'inline-block';
    alert('입력한 데이터로 반영되었습니다. (임시 상태)');
});
