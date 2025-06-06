document.addEventListener("DOMContentLoaded", async () => {
    const userJson = localStorage.getItem("currentUser");
    if (!userJson) {
        console.error("currentUser 정보 없음");
        return;
    }

    const departmentId = JSON.parse(userJson).department.departmentId;
    console.log("부서 ID:", departmentId);

    try {
        const response = await fetch(`https://luckyseven.live/api/gateways/department/${departmentId}`, {
            method: "GET",
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });

        const gateways = await response.json();
        console.log("게이트웨이 목록:", gateways);

        const grid = document.getElementById("gatewayGrid");

        gateways.forEach(gateway => {
            const card = document.createElement("a");
            card.className = "gateway-card";
            card.href = `/gateway/${gateway.gateway_id}`;

            card.innerHTML = `
                <div class="gateway-card-header">
                    <div class="gateway-modified-date">수정일: ${gateway.updated_at}</div>
                    <div class="status ${gateway.threshold_status ? 'active' : 'inactive'}">
                        ${gateway.threshold_status ? '● 활성화' : '● 비활성화'}
                    </div>
                </div>

                <div class="gateway-name">${gateway.gateway_name}</div>
                <div class="gateway-meta">센서: ${gateway.sensor_count}개</div>
                <div class="gateway-protocol">프로토콜: ${gateway.iot_protocol}</div>
            `;

            grid.appendChild(card);
        });
    } catch (error) {
        console.error("게이트웨이 목록 불러오기 실패:", error);
    }
});
