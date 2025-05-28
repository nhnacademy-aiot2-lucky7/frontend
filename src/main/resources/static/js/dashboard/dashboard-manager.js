document.addEventListener('DOMContentLoaded', function() {
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
    }

    // 부서 선택 드롭다운 초기화
    const departmentSelect = document.getElementById('departmentSelect');
    let departments = [];
    const deptMap = {};
    dashboardsData.forEach(dash => {
        if (dash.departmentId && !deptMap[dash.departmentId]) {
            departments.push({
                departmentId: dash.departmentId,
                departmentName: dash.departmentName
            });
            deptMap[dash.departmentId] = true;
        }
    });

    // 드롭다운 옵션 생성 함수
    function setDepartmentOptions() {
        departmentSelect.innerHTML = "";
        if (currentUser.userRole === 'ROLE_ADMIN') {
            // 관리자: 전체 부서 선택 가능
            const allOption = document.createElement('option');
            allOption.value = "";
            allOption.textContent = "모든 부서";
            departmentSelect.appendChild(allOption);

            departments.forEach(dept => {
                const option = document.createElement('option');
                option.value = dept.departmentId;
                option.textContent = dept.departmentName;
                departmentSelect.appendChild(option);
            });
            departmentSelect.disabled = false;
        } else {
            // 일반 유저: 자신의 부서만
            const userDept = currentUser.department;
            const option = document.createElement('option');
            option.value = userDept.departmentId;
            option.textContent = userDept.departmentName;
            departmentSelect.appendChild(option);
            departmentSelect.value = userDept.departmentId;
            departmentSelect.disabled = true;
        }
    }

    setDepartmentOptions();

    // 대시보드 필터링 및 표시 함수
    function filterAndDisplayDashboards() {
        const selectedDepartmentId = departmentSelect.value;
        const keyword = document.getElementById('keywordInput').value.toLowerCase();

        let filteredDashboards = dashboardsData;

        // 부서 필터
        if (currentUser.userRole === 'ROLE_ADMIN') {
            if (selectedDepartmentId) {
                filteredDashboards = filteredDashboards.filter(dashboard =>
                    String(dashboard.departmentId) === selectedDepartmentId
                );
            }
        } else {
            const userDeptId = currentUser.department.departmentId;
            filteredDashboards = filteredDashboards.filter(dashboard =>
                dashboard.departmentId === userDeptId
            );
        }

        filteredDashboards = filteredDashboards.filter(dashboard => dashboard.active);

        const groupedDashboards = {};
        filteredDashboards.forEach(dashboard => {
            const deptId = dashboard.departmentId;
            if (!groupedDashboards[deptId]) {
                groupedDashboards[deptId] = [];
            }
            groupedDashboards[deptId].push(dashboard);
        });

        // 대시보드 그룹 표시
        const dashboardGroups = document.getElementById('dashboardGroups');
        dashboardGroups.innerHTML = '';

        Object.keys(groupedDashboards).forEach(departmentId => {
            const departmentDashboards = groupedDashboards[departmentId];

            // 부서 그룹 생성
            const departmentGroup = document.createElement('div');
            departmentGroup.className = 'department-group';

            // 부서 제목 (departmentId → departmentName)
            const departmentTitle = document.createElement('h2');
            departmentTitle.className = 'department-title';
            departmentTitle.textContent = departmentDashboards[0].departmentName;
            departmentGroup.appendChild(departmentTitle);

            // 대시보드 배너 컨테이너
            const bannersContainer = document.createElement('div');
            bannersContainer.className = 'banners-container';

            departmentDashboards.forEach(dashboard => {
                const dashboardElement = document.createElement('div');
                dashboardElement.className = 'banner-container';
                dashboardElement.innerHTML = `
                    <a href="/dashboard-preview?id=${dashboard.id}" class="banner-link">
                        <img src="${dashboard.bannerImage}" alt="${dashboard.name}" class="banner-image"/>
                        <div class="banner-overlay">
                            <span class="banner-title">${dashboard.name}</span>
                        </div>
                    </a>
                `;
                bannersContainer.appendChild(dashboardElement);
            });

            departmentGroup.appendChild(bannersContainer);
            dashboardGroups.appendChild(departmentGroup);
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