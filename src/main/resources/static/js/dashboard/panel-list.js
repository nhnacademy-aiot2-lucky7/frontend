document.addEventListener('DOMContentLoaded', () => {
    loadIframes();
});

async function loadIframes() {
    try {
        const isAdmin = localStorage.getItem("role") === "ADMIN";
        const endpoint = isAdmin ? '/admin/panels' : '/user/panels';

        const res = await fetch(endpoint);
        if (!res.ok) new Error('패널 정보를 불러오지 못했습니다.');

        const panels = await res.json();
        const container = document.getElementById('panelList');
        container.innerHTML = ''; // 초기화

        panels.forEach(panel => {
            const wrapper = document.createElement('div');
            wrapper.className = 'panel-card';

            // 제목
            const title = document.createElement('h3');
            title.textContent = panel.dashboardTitle || '제목 없음';
            title.className = 'panel-title';
            wrapper.appendChild(title);

            // iframe 생성
            const iframe = document.createElement('iframe');
            iframe.src = `https://grafana.luckyseven.live/d-solo/${panel.dashboardUid}?orgId=1&from=${panel.from}&to=${panel.now}&panelId=${panel.panelId}`;
            iframe.width = '450';
            iframe.height = '200';
            iframe.frameBorder = '0';
            iframe.className = 'grafana-iframe';

            wrapper.appendChild(iframe);
            container.appendChild(wrapper);
        });
    } catch (error) {
        console.error('iframe 로딩 오류:', error);
    }
}