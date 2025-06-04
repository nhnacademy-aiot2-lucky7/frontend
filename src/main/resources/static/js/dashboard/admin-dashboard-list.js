document.addEventListener('DOMContentLoaded', function () {
    const departmentSelect = document.getElementById('departmentSelect');
    const dashboardSelect = document.getElementById('dashboardSelect');
    const dashboardGroups = document.getElementById('dashboardList'); // 대시보드 목록 출력용 컨테이너
    const keywordInput = document.getElementById('keywordInput'); // 검색어 input

    // localStorage에서 대시보드 데이터 가져오기
    let dashboardsData = JSON.parse(localStorage.getItem('dashboards') || '[]');

    // 부서 목록 생성 (departmentId 기준으로 그룹핑)
    const departmentsMap = new Map();
    dashboardsData.forEach(d => {
        if (!departmentsMap.has(d.departmentId)) {
            departmentsMap.set(d.departmentId, {
                departmentName: d.departmentName || getFolderNameFromUid(d.folderUid) || '알 수 없는 부서',
                dashboards: []
            });
        }
        departmentsMap.get(d.departmentId).dashboards.push(d);
    });

    // 부서 select 옵션 생성
    function populateDepartmentSelect() {
        // 기본 옵션
        departmentSelect.innerHTML = '<option value="">모든 부서</option>';
        for (const [deptId, { departmentName }] of departmentsMap.entries()) {
            const option = document.createElement('option');
            option.value = deptId;
            option.textContent = departmentName;
            departmentSelect.appendChild(option);
        }
    }

    // 대시보드 select 옵션 생성 (부서 필터 반영)
    function populateDashboardSelect(departmentId) {
        dashboardSelect.innerHTML = '<option value="">모든 대시보드</option>';
        let filteredDashboards = [];

        if (departmentId && departmentsMap.has(departmentId)) {
            filteredDashboards = departmentsMap.get(departmentId).dashboards;
        } else {
            // 전체 대시보드 목록
            filteredDashboards = dashboardsData;
        }

        filteredDashboards.forEach(d => {
            const option = document.createElement('option');
            option.value = d.dashboardUid || d.uid || d.dashboardId;
            option.textContent = d.dashboardTitle || d.name;
            dashboardSelect.appendChild(option);
        });
    }

    // 대시보드 목록 화면 출력 (부서 + 검색어 필터 적용)
    function filterAndDisplayDashboards() {
        const selectedDepartmentId = departmentSelect.value;
        const keyword = keywordInput ? keywordInput.value.toLowerCase() : '';

        let filteredDashboards = dashboardsData;

        // 부서 필터
        if (selectedDepartmentId) {
            filteredDashboards = filteredDashboards.filter(d => String(d.departmentId) === selectedDepartmentId);
        }

        // 검색어 필터 (대시보드 이름 기준)
        if (keyword) {
            filteredDashboards = filteredDashboards.filter(d => (d.dashboardTitle || d.name || '').toLowerCase().includes(keyword));
        }

        // 활성화된 대시보드만 (active 필드가 있다고 가정)
        filteredDashboards = filteredDashboards.filter(d => d.active !== false); // undefined도 허용

        // 부서별 그룹화
        const groupedDashboards = {};
        filteredDashboards.forEach(d => {
            const deptId = d.departmentId;
            if (!groupedDashboards[deptId]) groupedDashboards[deptId] = [];
            groupedDashboards[deptId].push(d);
        });

        dashboardGroups.innerHTML = '';

        Object.keys(groupedDashboards).forEach(deptId => {
            const dashboards = groupedDashboards[deptId];

            const departmentGroup = document.createElement('div');
            departmentGroup.className = 'department-group';

            const departmentTitle = document.createElement('h2');
            departmentTitle.className = 'department-title';
            departmentTitle.textContent = dashboards[0]?.departmentName || '알 수 없는 부서';
            departmentGroup.appendChild(departmentTitle);

            const bannersContainer = document.createElement('div');
            bannersContainer.className = 'banners-container';

            dashboards.forEach(dashboard => {
                const dashboardElement = document.createElement('div');
                dashboardElement.className = 'banner-container';
                dashboardElement.innerHTML = `
                    <a href="/dashboard-preview?id=${dashboard.dashboardId || dashboard.id}" class="banner-link">
                        <img src="${dashboard.bannerImage || '/img/equipment/banner_default.png'}" alt="${dashboard.dashboardTitle || dashboard.name}" class="banner-image"/>
                        <div class="banner-overlay">
                            <span class="banner-title">${dashboard.dashboardTitle || dashboard.name}</span>
                        </div>
                    </a>
                `;
                bannersContainer.appendChild(dashboardElement);
            });

            departmentGroup.appendChild(bannersContainer);
            dashboardGroups.appendChild(departmentGroup);
        });
    }

    // 부서 선택 시 대시보드 select 및 리스트 갱신
    departmentSelect.addEventListener('change', () => {
        populateDashboardSelect(departmentSelect.value);
        filterAndDisplayDashboards();
    });

    // 대시보드 select 선택 이벤트 (필요시 구현)
    dashboardSelect.addEventListener('change', () => {
        // 여기에 대시보드 선택 시 동작 구현 가능 (예: 상세보기 등)
    });

    // 키워드 검색 input 있을 때 필터 적용
    if (keywordInput) {
        keywordInput.addEventListener('input', filterAndDisplayDashboards);
    }

    // 초기화
    populateDepartmentSelect();
    populateDashboardSelect();
    filterAndDisplayDashboards();

    dashboardSelect.addEventListener('change', () => {
        const selectedValue = dashboardSelect.value;
        if (selectedValue) {
            // 선택된 대시보드 아이디를 쿼리 파라미터로 넘겨서 add-panel 페이지로 이동
            window.location.href = `/add-panel.html?dashboardId=${selectedValue}`;
        }
    });

});