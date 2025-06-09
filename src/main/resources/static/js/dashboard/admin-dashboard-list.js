document.addEventListener('DOMContentLoaded', function () {
    const departmentSelect = document.getElementById('departmentSelect');
    const dashboardSelect = document.getElementById('dashboardSelect');
    const dashboardGroups = document.getElementById('dashboardList');
    const keywordInput = document.getElementById('keywordInput');
    const dashboardUid = dashboardList.dataset.dashboardUid;

    let dashboardsData = JSON.parse(localStorage.getItem('dashboards') || '[]');
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

    function populateDepartmentSelect() {
        departmentSelect.innerHTML = '<option value="">모든 부서</option>';
        for (const [deptId, { departmentName }] of departmentsMap.entries()) {
            const option = document.createElement('option');
            option.value = deptId;
            option.textContent = departmentName;
            departmentSelect.appendChild(option);
        }
    }

    function populateDashboardSelect(departmentId) {
        dashboardSelect.innerHTML = '<option value="">모든 대시보드</option>';
        const dashboards = departmentId && departmentsMap.has(departmentId)
            ? departmentsMap.get(departmentId).dashboards
            : dashboardsData;

        dashboards.forEach(d => {
            const option = document.createElement('option');
            option.value = d.dashboardUid || d.uid || d.dashboardId;
            option.textContent = d.dashboardTitle || d.name;
            dashboardSelect.appendChild(option);
        });
    }

    function deleteDashboard(dashboardId) {
        dashboardsData = dashboardsData.filter(d => d.dashboardId !== dashboardId && d.id !== dashboardId);
        localStorage.setItem('dashboards', JSON.stringify(dashboardsData));
        filterAndDisplayDashboards();
        populateDashboardSelect(departmentSelect.value);
    }

    function filterAndDisplayDashboards() {
        const selectedDepartmentId = departmentSelect.value;
        const keyword = keywordInput?.value.toLowerCase() || '';

        let filteredDashboards = dashboardsData;

        if (selectedDepartmentId) {
            filteredDashboards = filteredDashboards.filter(d => String(d.departmentId) === selectedDepartmentId);
        }

        if (keyword) {
            filteredDashboards = filteredDashboards.filter(d => (d.dashboardTitle || d.name || '').toLowerCase().includes(keyword));
        }

        filteredDashboards = filteredDashboards.filter(d => d.active !== false);

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

            const bannersContainer = document.createElement('div');
            bannersContainer.className = 'banners-container';

            dashboards.forEach(dashboard => {
                const dashboardElement = document.createElement('div');
                dashboardElement.className = 'banner-container';

                const link = document.createElement('a');
                link.href = `/dashboard-preview?id=${dashboard.dashboardId || dashboard.id}`;
                link.className = 'banner-link';

                const image = document.createElement('img');
                image.src = dashboard.bannerImage || '/img/equipment/banner_default.png';
                image.alt = dashboard.dashboardTitle || dashboard.name;
                image.className = 'banner-image';

                const overlay = document.createElement('div');
                overlay.className = 'banner-overlay';

                const title = document.createElement('span');
                title.className = 'banner-title';
                title.textContent = dashboard.dashboardTitle || dashboard.name;

                overlay.appendChild(title);
                link.appendChild(image);
                link.appendChild(overlay);

                const deleteButton = document.createElement('button');
                deleteButton.textContent = '삭제';
                deleteButton.className = 'dashboard-delete-btn';
                deleteButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (confirm('정말 삭제하시겠습니까?')) {
                        deleteDashboard(dashboard.dashboardId || dashboard.id);
                    }
                });

                dashboardElement.appendChild(link);
                dashboardElement.appendChild(deleteButton);
                bannersContainer.appendChild(dashboardElement);
            });

            departmentGroup.appendChild(departmentTitle);
            departmentGroup.appendChild(bannersContainer);
            dashboardGroups.appendChild(departmentGroup);
        });
    }

    departmentSelect.addEventListener('change', () => {
        populateDashboardSelect(departmentSelect.value);
        filterAndDisplayDashboards();
    });

    dashboardSelect.addEventListener('change', () => {
        const selectedValue = dashboardSelect.value;
        if (selectedValue) {
            window.location.href = `/add-panel.html?dashboardId=${selectedValue}`;
        }
    });

    keywordInput?.addEventListener('input', filterAndDisplayDashboards);

    populateDepartmentSelect();
    populateDashboardSelect();
    filterAndDisplayDashboards();
});
