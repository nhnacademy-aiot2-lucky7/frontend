document.addEventListener("DOMContentLoaded", () => {
    const departmentId = window.currentUser && window.currentUser.department && window.currentUser.department.departmentId;
    if (!departmentId) return console.error("부서 ID 없음");

    const gateSelects = [document.getElementById("gatewaySelect1"), document.getElementById("gatewaySelect2")];
    const sensorSelects = [document.getElementById("sensorSelect1"), document.getElementById("sensorSelect2")];
    const analyzeButton = document.getElementById("analyzeButton");

    // 1. 게이트웨이 목록 채우기
    fetch(`/gateway-list/${departmentId}`)
        .then(res => res.json())
        .then(gateways => {
            console.log("게이트웨이 목록 받아옴:", gateways);
            gateSelects.forEach(select => {
                gateways.forEach(gateway => {
                    const option = document.createElement("option");
                    option.value = gateway.gateway_id;
                    option.text = gateway.gateway_name;
                    select.appendChild(option);
                });
            });
        })
        .catch(err => console.error("게이트웨이 로딩 오류:", err));

    // 2. 게이트웨이 선택 시 센서 목록 불러오기
    gateSelects.forEach((gateSelect, index) => {
        gateSelect.addEventListener("change", () => {
            const gatewayId = gateSelect.value;
            const sensorSelect = sensorSelects[index];

            sensorSelect.innerHTML = "<option value=''>-- 선택하세요 --</option>";
            if (!gatewayId) return;

            fetch(`/sensor-list/${gatewayId}`)
                .then(res => res.json())
                .then(sensors => {
                    sensors.forEach(sensor => {
                        const option = document.createElement("option");
                        option.value = JSON.stringify(sensor); // 전체 객체 저장
                        option.text = `${sensor.location} - ${sensor.spot} - ${sensor.type_en_name}`;
                        sensorSelect.appendChild(option);
                    });
                })
                .catch(err => console.error("센서 로딩 오류:", err));
        });
    });

    // 3. 분석 버튼 클릭 시 POST 요청
    analyzeButton.addEventListener("click", () => {
        const sensorObjs = sensorSelects.map(select => {
            const selected = select.value;
            if (!selected) return null;

            const parsed = JSON.parse(selected);

            return {
                gatewayId: parsed.gateway_id.toString(),
                sensorId: parsed.sensor_id,
                sensorType: parsed.type_en_name
            };
        });

        // 항목 선택 필수
        if (sensorObjs.includes(null)) {
            alert("두 개의 센서를 모두 선택해주세요.");
            return;
        }

        // 동일한 센서 분석 요청 거부
        const [s1, s2] = sensorObjs;
        if (
            s1.gatewayId === s2.gatewayId &&
            s1.sensorId === s2.sensorId &&
            s1.sensorType === s2.sensorType
        ) {
            alert("동일한 센서를 두 번 선택할 수 없습니다. 다른 센서를 선택해주세요.");
            return;
        }

        const requestBody = {
            sensor1: sensorObjs[0],
            sensor2: sensorObjs[1]
        };

        fetch("/correlation-analysis-start", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-User-Id": window.currentUser?.id || "test-user" // 필요 시 수정
            },
            body: JSON.stringify(requestBody)
        })
            .then(res => {
                if (!res.ok) throw new Error("분석 요청 실패");
                return res.text(); // 필요시 .json()
            })
            .then(result => {
                alert("분석 요청이 성공적으로 전송되었습니다.");
                console.log("분석 결과:", result);
            })
            .catch(err => {
                console.error("분석 요청 오류:", err);
                alert("분석 요청에 실패했습니다.");
            });
    });
});