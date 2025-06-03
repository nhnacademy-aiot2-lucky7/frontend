document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin Dashboard info page loaded');

    // localStorage에서 대시보드 데이터 로드
    let dashboardsData = [];
    try {
        const storedDashboards = localStorage.getItem('dashboards');
        if (storedDashboards) {
            dashboardsData = JSON.parse(storedDashboards);
        } else {
            // localStorage에 데이터가 없으면 더미 데이터로 초기화하고 저장
            dashboardsData = window.dashboards || [];
            localStorage.setItem('dashboards', JSON.stringify(dashboardsData));
        }
    } catch (e) {
        console.error('localStorage 로드 중 오류 발생:', e);
        dashboardsData = window.dashboards || [];
    }

    console.log('localStorage에서 로드한 대시보드:', dashboardsData);

    // 부서 선택 드롭다운 초기화
    const departmentSelect = document.getElementById('departmentSelect');
    const departments = window.departments || [];

    // 부서 옵션 추가
    departments.forEach(dept => {
        const option = document.createElement('option');
        option.value = dept;
        option.textContent = dept;
        departmentSelect.appendChild(option);
    });

    // 대시보드 그룹 컨테이너
    const dashboardGroups = document.getElementById('dashboardGroups');

    // 대시보드 필터링 및 표시 함수
    function filterAndDisplayDashboards() {
        const selectedDepartment = departmentSelect.value;
        const keyword = document.getElementById('keywordInput').value.toLowerCase();

        // 필터링된 대시보드
        let filteredDashboards = dashboardsData;

        // 부서 필터 적용
        if (selectedDepartment) {
            filteredDashboards = filteredDashboards.filter(dashboard =>
                dashboard.department === selectedDepartment
            );
        }

        // 키워드 필터 적용
        if (keyword) {
            filteredDashboards = filteredDashboards.filter(dashboard =>
                dashboard.name.toLowerCase().includes(keyword) ||
                (dashboard.description && dashboard.description.toLowerCase().includes(keyword))
            );
        }

        // 부서별 그룹화
        const groupedDashboards = {};
        filteredDashboards.forEach(dashboard => {
            if (!groupedDashboards[dashboard.department]) {
                groupedDashboards[dashboard.department] = [];
            }
            groupedDashboards[dashboard.department].push(dashboard);
        });

        // 대시보드 그룹 표시
        dashboardGroups.innerHTML = '';

        Object.keys(groupedDashboards).forEach(department => {
            const departmentDashboards = groupedDashboards[department];

            // 부서 그룹 생성
            const departmentGroup = document.createElement('div');
            departmentGroup.className = 'department-group';

            // 부서 제목
            const departmentTitle = document.createElement('h2');
            departmentTitle.className = 'department-title';
            departmentTitle.textContent = departmentDashboards[0].departmentName;
            departmentGroup.appendChild(departmentTitle);

            // 대시보드 배너 컨테이너
            const bannersContainer = document.createElement('div');
            bannersContainer.className = 'banners-container';

            // 대시보드 배너 생성
            departmentDashboards.forEach(dashboard => {
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
                        <span class="display-text">메인페이지에 표시</span>
                        <button class="toggle-btn" data-id="${dashboard.id}" data-active="${dashboard.active}">
                            ${dashboard.active ? 'On' : 'Off'}
                        </button>
                    </div>
                `;
                bannersContainer.appendChild(dashboardElement);
            });

            departmentGroup.appendChild(bannersContainer);
            dashboardGroups.appendChild(departmentGroup);
        });

        // 토글 버튼 이벤트 리스너 추가
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

                // 대시보드 데이터 업데이트
                const dashboard = dashboardsData.find(d => d.id === dashboardId);
                if (dashboard) {
                    dashboard.active = !isActive;

                    // 로컬 스토리지 업데이트
                    localStorage.setItem('dashboards', JSON.stringify(dashboardsData));
                    console.log('Updated localStorage with new active state');
                }

                // 상태 변경 로그
                const bannerTitle = this.closest('.banner-container').querySelector('.banner-title').textContent;
                console.log(`${bannerTitle} 배너의 메인페이지 표시 상태가 ${isActive ? 'Off' : 'On'}로 변경되었습니다.`);
            });
        });
    }

    // 초기 대시보드 표시
    filterAndDisplayDashboards();

    // 필터 폼 제출 이벤트
    document.getElementById('filterForm').addEventListener('submit', function(e) {
        e.preventDefault();
        filterAndDisplayDashboards();
    });

    // 부서 선택 변경 이벤트
    departmentSelect.addEventListener('change', filterAndDisplayDashboards);
});
