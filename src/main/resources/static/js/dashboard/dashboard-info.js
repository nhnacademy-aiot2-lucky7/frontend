document.addEventListener('DOMContentLoaded', function() {
    // currentUser 존재 여부 확인
    if (typeof currentUser === 'undefined' || currentUser === null) {
        console.error('FATAL: currentUser is not defined when dashboard-info.js runs!');
        // 사용자에게 오류 메시지를 보여주거나 로직 중단
        const dashboardList = document.getElementById('dashboardList');
        if(dashboardList) {
            dashboardList.innerHTML = '<p style="color: red; padding: 20px;">사용자 정보를 로드할 수 없어 대시보드 목록을 표시할 수 없습니다.</p>';
        }
        return; // currentUser 없이는 진행 불가
    }

    console.log('currentUser is available:', currentUser); // currentUser 객체 확인

    // localStorage에서 대시보드 데이터 로드
    let dashboardsData = [];
    try {
        const storedDashboards = localStorage.getItem('dashboards');
        if (storedDashboards) {
            dashboardsData = JSON.parse(storedDashboards);
        } else {
            dashboardsData = window.dashboards || [];
            localStorage.setItem('dashboards', JSON.stringify(dashboardsData));
        }
    } catch (e) {
        console.error('localStorage 로드 중 오류 발생:', e);
        dashboardsData = window.dashboards || [];
        localStorage.setItem('dashboards', JSON.stringify(dashboardsData));
    }

    console.log('localStorage에서 로드한 대시보드:', dashboardsData);
    console.log('현재 사용자 부서:', currentUser.department);

// **부서명 필터링하도록 수정**
    const userDepartmentName = currentUser.department.departmentName;
    let userDashboards;

    if (currentUser.userRole === 'ADMIN' || currentUser.userRole === 'ROLE_ADMIN') {
        userDashboards = dashboardsData;
    } else {
        userDashboards = dashboardsData.filter(
            dashboard => dashboard.departmentId === currentUser.department.departmentId
        );
    }

    console.log('필터링된 대시보드:', userDashboards);

    const dashboardList = document.getElementById('dashboardList');
    if (userDashboards.length === 0) {
        dashboardList.innerHTML = `
        <div class="empty-dashboard-message">
            <p>등록된 대시보드가 없습니다. 새 대시보드를 추가해보세요.</p>
        </div>
    `;
    } else {
        dashboardList.innerHTML = '';
        userDashboards.forEach(dashboard => {
            const dashboardElement = document.createElement('div');
            dashboardElement.className = 'banner-container';
            dashboardElement.innerHTML = `
        <a href="/dashboard-detail?id=${dashboard.id}" class="banner-link">
            <img src="${dashboard.bannerImage}" alt="${dashboard.name}" class="banner-image"/>
            <div class="banner-overlay">
                <span class="banner-title">${dashboard.name}</span>
            </div>
        </a>
        <div class="display-control">
            <span class="display-text">관리페이지에 표시</span>
            <button class="toggle-btn${dashboard.active ? ' on' : ''}" data-id="${dashboard.id}" data-active="${dashboard.active}">
                ${dashboard.active ? 'On' : 'Off'}
            </button>
        </div>
    `;
            dashboardList.appendChild(dashboardElement);
        });

        const toggleButtons = document.querySelectorAll('.toggle-btn');
        toggleButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();

                const dashboardId = parseInt(this.getAttribute('data-id'));
                const isActive = this.getAttribute('data-active') === 'true';

                // 토글 상태 변경
                this.textContent = isActive ? 'Off' : 'On';
                this.setAttribute('data-active', !isActive);

                // ON/OFF에 따라 .on 클래스 토글
                if (!isActive) {
                    this.classList.add('on');
                } else {
                    this.classList.remove('on');
                }

                // 대시보드 데이터 업데이트
                const dashboard = dashboardsData.find(d => d.id === dashboardId);
                if (dashboard) {
                    dashboard.active = !isActive;
                    localStorage.setItem('dashboards', JSON.stringify(dashboardsData));
                }

                // 상태 변경 로그
                const bannerTitle = this.closest('.banner-container').querySelector('.banner-title').textContent;
                console.log(`${bannerTitle} 배너의 관리페이지 표시 상태가 ${isActive ? 'Off' : 'On'}로 변경되었습니다.`);
            });
        });
    }
});
