// document.addEventListener('DOMContentLoaded', async function () {
//     let dashboardsData = [];
//     let departments = [];
//     const CACHE_KEY = 'departmentsCache';
//     const CACHE_TTL = 1000 * 60 * 60 * 24; // 24시간
//
//     // 1. 대시보드 데이터 로딩 (localStorage)
//     try {
//         const storedDashboards = localStorage.getItem('dashboards');
//         if (storedDashboards) {
//             dashboardsData = JSON.parse(storedDashboards);
//         } else {
//             dashboardsData = window.dashboards || [];
//             localStorage.setItem('dashboards', JSON.stringify(dashboardsData));
//         }
//     } catch (e) {
//         console.error('localStorage 로드 중 오류 발생:', e);
//         dashboardsData = window.dashboards || [];
//     }
//
//     // 2. 부서 정보 로딩 함수 (localStorage 캐시 활용)
//     async function loadDepartments() {
//         const cached = localStorage.getItem(CACHE_KEY);
//         if (cached) {
//             const parsed = JSON.parse(cached);
//             const now = Date.now();
//             if (now - parsed.timestamp < CACHE_TTL) {
//                 departments = parsed.departments;
//                 console.log('📦 부서 목록 캐시에서 로드됨');
//                 return;
//             }
//         }
//
//         try {
//             const res = await fetch('/admin/folders', {
//                 method: 'GET',
//                 credentials: 'include',
//             });
//
//             if (!res.ok) throw new Error('부서 API 응답 실패');
//
//             const data = await res.json();
//             departments = data.map(folder => ({
//                 departmentId: folder.id,
//                 departmentName: folder.title,
//             }));
//
//             localStorage.setItem(CACHE_KEY, JSON.stringify({
//                 timestamp: Date.now(),
//                 departments,
//             }));
//
//             console.log('📡 부서 목록 API에서 로드됨');
//         } catch (err) {
//             console.error('부서 목록을 불러오지 못했습니다:', err);
//         }
//     }
//
//     // 3. 드롭다운 옵션 렌더링
//     function setDepartmentOptions() {
//         const departmentSelect = document.getElementById('departmentSelect');
//         departmentSelect.innerHTML = '';
//
//         if (currentUser.userRole === 'ROLE_ADMIN') {
//             const allOption = document.createElement('option');
//             allOption.value = '';
//             allOption.textContent = '모든 부서';
//             departmentSelect.appendChild(allOption);
//
//             departments.forEach(dept => {
//                 const option = document.createElement('option');
//                 option.value = dept.departmentId;
//                 option.textContent = dept.departmentName;
//                 departmentSelect.appendChild(option);
//             });
//
//             departmentSelect.disabled = false;
//         } else {
//             const userDept = currentUser.department;
//             const option = document.createElement('option');
//             option.value = userDept.departmentId;
//             option.textContent = userDept.departmentName;
//             departmentSelect.appendChild(option);
//             departmentSelect.value = userDept.departmentId;
//             departmentSelect.disabled = true;
//         }
//     }
//
//     // 4. 대시보드 필터링 및 표시
//     function filterAndDisplayDashboards() {
//         const selectedDepartmentId = document.getElementById('departmentSelect').value;
//         const keyword = document.getElementById('keywordInput').value.toLowerCase();
//
//         let filteredDashboards = dashboardsData;
//
//         // 부서 필터
//         if (currentUser.userRole === 'ROLE_ADMIN') {
//             if (selectedDepartmentId) {
//                 filteredDashboards = filteredDashboards.filter(d =>
//                     String(d.departmentId) === selectedDepartmentId
//                 );
//             }
//         } else {
//             const userDeptId = currentUser.department.departmentId;
//             filteredDashboards = filteredDashboards.filter(d =>
//                 d.departmentId === userDeptId
//             );
//         }
//
//         // 검색어 필터
//         filteredDashboards = filteredDashboards.filter(d =>
//             d.name.toLowerCase().includes(keyword)
//         );
//
//         // 활성화된 대시보드만
//         filteredDashboards = filteredDashboards.filter(d => d.active);
//
//         // 부서별 그룹화
//         const groupedDashboards = {};
//         filteredDashboards.forEach(dashboard => {
//             const deptId = dashboard.departmentId;
//             if (!groupedDashboards[deptId]) {
//                 groupedDashboards[deptId] = [];
//             }
//             groupedDashboards[deptId].push(dashboard);
//         });
//
//         // 대시보드 출력
//         const dashboardGroups = document.getElementById('dashboardList');
//         dashboardGroups.innerHTML = '';
//
//         Object.keys(groupedDashboards).forEach(departmentId => {
//             const departmentDashboards = groupedDashboards[departmentId];
//
//             const departmentGroup = document.createElement('div');
//             departmentGroup.className = 'department-group';
//
//             const departmentTitle = document.createElement('h2');
//             departmentTitle.className = 'department-title';
//             departmentTitle.textContent = departmentDashboards[0]?.departmentName || '알 수 없는 부서';
//             departmentGroup.appendChild(departmentTitle);
//
//             const bannersContainer = document.createElement('div');
//             bannersContainer.className = 'banners-container';
//
//             departmentDashboards.forEach(dashboard => {
//                 const dashboardElement = document.createElement('div');
//                 dashboardElement.className = 'banner-container';
//                 dashboardElement.innerHTML = `
//                     <a href="/dashboard-preview?id=${dashboard.id}" class="banner-link">
//                         <img src="${dashboard.bannerImage}" alt="${dashboard.name}" class="banner-image"/>
//                         <div class="banner-overlay">
//                             <span class="banner-title">${dashboard.name}</span>
//                         </div>
//                     </a>
//                 `;
//                 bannersContainer.appendChild(dashboardElement);
//             });
//
//             departmentGroup.appendChild(bannersContainer);
//             dashboardGroups.appendChild(departmentGroup);
//         });
//     }
//
//     // 5. 초기 실행
//     await loadDepartments();
//     filterAndDisplayDashboards();
//
//     // 6. 이벤트 핸들링
//     document.getElementById('filterForm').addEventListener('submit', function (e) {
//         e.preventDefault();
//         filterAndDisplayDashboards();
//         renderDepartmentList();
//     });
//
//     function renderDepartmentList() {
//         const container = document.getElementById('departmentList');
//         container.innerHTML = ''; // 초기화
//
//         departments.forEach(dept => {
//             const btn = document.createElement('button');
//             btn.textContent = dept.departmentName;
//             btn.className = 'department-btn';
//             btn.style.cursor = 'pointer';
//
//             // 클릭 시 해당 부서 대시보드 페이지로 이동
//             btn.addEventListener('click', () => {
//                 /**
//                  * currentDepartment:
//                  * {
//                  *   departmentId: "부서의 고유 ID",
//                  *   departmentName: "부서 이름"
//                  * }
//                  */
//                 localStorage.setItem('currentDepartment', JSON.stringify(dept));
//                 window.location.href = `/dashboard/add?departmentId=${encodeURIComponent(dept.departmentId)}`;
//             });
//
//             container.appendChild(btn);
//         });
//     }
// });