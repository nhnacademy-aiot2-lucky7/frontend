document.addEventListener('DOMContentLoaded', async () => {
    try {
        // departmentId는 페이지 내에서 정의되었다고 가정
        const departmentId = window.currentUser.department.departmentId;

        // 메인 대시보드 정보 가져오기
        const mainDashboard = await fetch(`https://luckyseven.live/api/main/dashboard/${departmentId}`, {
            method: 'GET',
            credentials: 'include'
        }).then(res => res.json());

        // 제목 표시
        const titleElement = document.getElementById('dashboardTitle');
        if (titleElement) titleElement.textContent = `차트 내역: ${mainDashboard.dashboardTitle}` || '';

        // panelList 데이터-dashboard-uid 속성 세팅
        const panelList = document.getElementById('panelList');
        if (!panelList) throw new Error('패널 컨테이너를 찾을 수 없습니다.');
        panelList.dataset.dashboardUid = mainDashboard.dashboardUid;

        // 패널 iframe 로드
        await loadIframes(mainDashboard.dashboardUid);

    } catch (error) {
        console.error('대시보드 정보 로딩 오류:', error);
    }
});

async function loadIframes(dashboardUid) {
    try {
        const endpoint = `https://luckyseven.live/api/panels/${dashboardUid}`;
        const res = await fetch(endpoint);
        if (!res.ok) throw new Error('패널 정보를 불러오지 못했습니다.');

        const panels = await res.json();
        const container = document.getElementById('panelList');
        container.innerHTML = '';

        panels.forEach(panel => {
            const iframe = createIframeOnly(panel);
            container.appendChild(iframe);
        });

    } catch (error) {
        console.error('iframe 로딩 오류:', error);
        alert('패널을 불러오는 중 오류가 발생했습니다.');
    }
}

function createIframeOnly(panel) {
    const iframe = document.createElement('iframe');
    iframe.src = `https://grafana.luckyseven.live/d-solo/${panel.dashboardUid}?orgId=1&from=now${extractStart(panel.query)}&to=${panel.now}&panelId=${panel.panelId}&transparent=1&refresh=1m`;
    iframe.className = 'grafana-iframe';
    iframe.style.width = '100%';
    iframe.style.height = '400px';
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('scrolling', 'no');
    return iframe;
}

function extractStart(query) {
    const startMatch = query.match(/range\(start:\s*([^)]+)\)/);
    return startMatch ? startMatch[1].trim() : '-12h';
}
