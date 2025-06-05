function getBannerImage(title) {
    if (title.includes('서버')) return '/img/equipment/banner_server_room.jpg';
    if (title.includes('출입')) return '/img/equipment/banner_access_control.png';
    if (title.includes('재난') || title.includes('재해')) return '/img/equipment/banner_calamity.jpg';
    if (title.includes('장비')) return '/img/equipment/banner_equipment.jpg';
    if (title.includes('전력')) return '/img/equipment/banner_power_usage.jpg';
    return '/img/equipment/banner_default.png';
}

document.addEventListener('DOMContentLoaded', async () => {
    const dashboardList = document.getElementById('dashboardList');

    try {
        const response = await fetch('/api/dashboards', {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) throw new Error('대시보드 조회 실패');

        const dashboards = await response.json();

        console.log("결과",dashboards);
        const userDepartment = window.currentUser.department;

        if (!userDepartment) {
            dashboardList.textContent = '사용자 부서 정보를 찾을 수 없습니다.';
            return;
        }

        const userDepartmentId = userDepartment.id;
        const filteredDashboards = dashboards.filter(d => d.departmentId === userDepartmentId);

        console.log("userDepartmentId: ",userDepartment.id);

        console.log("filter:", filteredDashboards);
        if (filteredDashboards.length === 0) {
            dashboardList.textContent = '부서에 맞는 대시보드가 없습니다.';
            return;
        }

        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.flexWrap = 'wrap';
        container.style.gap = '16px';

        filteredDashboards.forEach(d => {
            const dashboardTitle = d.title || '이름 없음';
            const dashboardUid = d.uid;

            const bannerSrc = getBannerImage(dashboardTitle);

            const banner = document.createElement('div');
            banner.style.backgroundImage = `url(${bannerSrc})`;
            banner.style.backgroundSize = 'cover';
            banner.style.backgroundPosition = 'center';
            banner.style.width = '1800px';
            banner.style.height = '150px';
            banner.style.borderRadius = '12px';
            banner.style.boxShadow = '0 4px 10px rgba(0,0,0,0.2)';
            banner.style.display = 'flex';
            banner.style.alignItems = 'center';
            banner.style.justifyContent = 'center';
            banner.style.color = 'white';
            banner.style.fontSize = '1.1rem';
            banner.style.fontWeight = 'bold';
            banner.style.textShadow = '1px 1px 4px rgba(0,0,0,0.6)';
            banner.style.cursor = 'pointer';
            banner.style.transition = 'transform 0.2s';

            banner.textContent = dashboardTitle;

            banner.addEventListener('mouseenter', () => {
                banner.style.transform = 'scale(1.02)';
            });
            banner.addEventListener('mouseleave', () => {
                banner.style.transform = 'scale(1)';
            });

            banner.addEventListener('click', () => {
                window.location.href = `/panels`;
            });

            container.appendChild(banner);
        });

        dashboardList.appendChild(container);

    } catch (error) {
        console.error('대시보드 로딩 실패:', error);
        dashboardList.textContent = '대시보드 목록을 불러오는 데 실패했습니다.';
    }
});