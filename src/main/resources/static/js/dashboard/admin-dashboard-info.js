document.addEventListener('DOMContentLoaded', async function () {
    console.log('Admin Dashboard info page loaded');

    const departmentSelect = document.getElementById('departmentSelect');
    const dashboardGroups = document.getElementById('dashboardGroups');
    const departments = window.departments || [];

    //  1. folderUid → folderTitle 매핑 테이블 로딩
    const folderMap = {}; // { folderUid: folderTitle }
    try {
        const folderResponse = await fetch('/api/folders', {
            method: 'GET',
            credentials: 'include',
        });

        if (folderResponse.ok) {
            const folders = await folderResponse.json();
            folders.forEach(f => {
                folderMap[f.uid] = f.title;
            });
        } else {
            console.warn('📁 폴더(부서) 이름 데이터를 불러오지 못했습니다.');
        }
    } catch (err) {
        console.error('폴더 이름 로딩 오류:', err);
    }

    // 2. 부서 드롭다운 옵션 생성 (폴더 정보 기준)
    Object.entries(folderMap).forEach(([uid, title]) => {
        const option = document.createElement('option');
        option.value = uid;
        option.textContent = String(title);
        departmentSelect.appendChild(option);
    });

    departments.forEach(dept => {
        const option = document.createElement('option');
        option.value = dept;
        option.textContent = dept;
        departmentSelect.appendChild(option);
    });

    // 3. 대시보드 데이터 불러오기 및 매핑
    let dashboardsData = [];
    try {
        const response = await fetch('/api/dashboards', {
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) new Error('대시보드 데이터를 불러오지 못했습니다.');
        const result = await response.json();

        dashboardsData = result.map(d => ({
            id: d.id,
            name: d.title,
            department: d.folderUid,
            departmentName: folderMap[d.folderUid] || d.folderUid, // ✅ uid 기준 이름 매핑
            description: '',
            bannerImage: getBannerImage(d.title),
            active: false
        }));
    } catch (error) {
        console.error('서버 데이터 로딩 실패:', error);
        alert('대시보드 데이터를 불러오는 데 실패했습니다.');
        return;
    }

    // 필터링 및 표시 함수
    function filterAndDisplayDashboards() {
        const selectedDepartment = departmentSelect.value;
        const keyword = document.getElementById('keywordInput').value.toLowerCase();

        let filteredDashboards = dashboardsData;

        // 부서 필터
        if (selectedDepartment) {
            filteredDashboards = filteredDashboards.filter(d =>
                d.department === selectedDepartment
            );
        }

        // 키워드 필터
        if (keyword) {
            filteredDashboards = filteredDashboards.filter(d =>
                d.name.toLowerCase().includes(keyword) ||
                (d.description && d.description.toLowerCase().includes(keyword))
            );
        }

        // 부서별 그룹화
        const groupedDashboards = {};
        filteredDashboards.forEach(d => {
            if (!groupedDashboards[d.department]) {
                groupedDashboards[d.department] = [];
            }
            groupedDashboards[d.department].push(d);
        });

        // 렌더링
        dashboardGroups.innerHTML = '';
        Object.keys(groupedDashboards).forEach(department => {
            const group = groupedDashboards[department];

            const groupDiv = document.createElement('div');
            groupDiv.className = 'department-group';

            const title = document.createElement('h2');
            title.className = 'department-title';
            title.textContent = group[0].departmentName || department;
            groupDiv.appendChild(title);

            const container = document.createElement('div');
            container.className = 'banners-container';

            group.forEach(dashboard => {
                const banner = document.createElement('div');
                banner.className = 'banner-container';
                banner.innerHTML = `
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
                container.appendChild(banner);
            });

            groupDiv.appendChild(container);
            dashboardGroups.appendChild(groupDiv);
        });

        // 토글 버튼 로직 (localStorage는 제거 또는 옵션)
        document.querySelectorAll('.toggle-btn').forEach(button => {
            button.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();

                const dashboardId = parseInt(this.getAttribute('data-id'));
                const isActive = this.getAttribute('data-active') === 'true';
                this.textContent = isActive ? 'Off' : 'On';
                this.setAttribute('data-active', !isActive);

                const dashboard = dashboardsData.find(d => d.id === dashboardId);
                if (dashboard) {
                    dashboard.active = !isActive;
                    console.log(`${dashboard.name}의 active 상태가 ${dashboard.active}로 변경됨`);
                }
            });
        });
    }

    // 이벤트 핸들러
    document.getElementById('filterForm').addEventListener('submit', function (e) {
        e.preventDefault();
        filterAndDisplayDashboards();
    });

    departmentSelect.addEventListener('change', filterAndDisplayDashboards);

    // 초기 표시
    filterAndDisplayDashboards();
});