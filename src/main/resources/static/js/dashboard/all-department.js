function getBannerImage(title) {
    if (title.includes('개발')) return '/img/department/develop.png';
    if (title.includes('연구')) return '/img/department/research.png';
    if (title.includes('마케팅')) return '/img/department/marketing.png';
    if (title.includes('인사')) return '/img/department/H&R.png';
    return '/img/department/default.png';
}

document.addEventListener('DOMContentLoaded', async () => {

    const dashboardList = document.getElementById('dashboardList');

    try {
        const response = await fetch('https://luckyseven.live/api/folders', {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) throw new Error('부서 조회 실패');

        const departmentList = await response.json();
        console.log("부서 결과",departmentList);

        if (departmentList.length === 0) {
            dashboardList.textContent = '조회된 부서가 없습니다.';
            return;
        }
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.flexWrap = 'wrap';
        container.style.gap = '16px';

        departmentList.forEach(d => {
            const dashboardTitle = d.title || '이름 없음';
            const dashboardUid = d.uid;
            const bannerSrc = getBannerImage(dashboardTitle);  // 이 함수는 네가 만든 걸로 그대로 사용하면 됨

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
            banner.style.flex = '1 1 400px'; // 추가: 반응형 배너 사이즈

            banner.textContent = dashboardTitle;

            banner.addEventListener('mouseenter', () => {
                banner.style.transform = 'scale(1.02)';
            });
            banner.addEventListener('mouseleave', () => {
                banner.style.transform = 'scale(1)';
            });

            console.log("dashboardTitle:{}", dashboardTitle);
            banner.addEventListener('click', () => {
                const encodedTitle = encodeURIComponent(dashboardTitle);
                window.location.href = `/dashboard/admin/dashboard-list?title=${encodedTitle}`;
            });

            container.appendChild(banner);
        });

        dashboardList.appendChild(container);

    } catch (error) {
        console.error('부서 목록 불러오기 실패:', error);
        dashboardList.textContent = '부서 목록을 불러오는 데 실패했습니다.';
    }
});
