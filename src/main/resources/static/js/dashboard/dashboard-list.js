document.addEventListener('DOMContentLoaded', () => {
    const dashboardList = document.getElementById('dashboardList');

    // localStorage에서 대시보드 데이터 불러오기
    const dashboards = JSON.parse(localStorage.getItem('dashboards') || '[]');

    // 사용자 부서 정보 가져오기
    const userDepartment = window.currentUser?.department;
    if (!userDepartment) {
        dashboardList.textContent = '사용자 부서 정보를 찾을 수 없습니다.';
        return;
    }

    const userDepartmentId = userDepartment.departmentId || userDepartment.id;

    // 해당 부서 대시보드만 필터링
    const filteredDashboards = dashboards.filter(d => d.departmentId === userDepartmentId);

    // 드롭다운 생성
    const label = document.createElement('label');
    label.textContent = `대시보드 선택: `;
    label.setAttribute('for', 'dashboardSelect');

    const select = document.createElement('select');
    select.id = 'dashboardSelect';

    // 기본 옵션
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = '대시보드를 선택하세요';
    select.appendChild(defaultOption);

    // 각 대시보드 옵션 추가
    filteredDashboards.forEach(d => {
        const option = document.createElement('option');
        option.value = d.dashboardUid || d.uid || d.dashboardId;
        option.textContent = d.dashboardTitle || d.name || '이름 없음';
        select.appendChild(option);
    });

    dashboardList.appendChild(label);
    dashboardList.appendChild(select);

    select.addEventListener('change', () => {
        const selectedValue = select.value;
        if (selectedValue) {
            window.location.href = `/add-panel.html?dashboardId=${selectedValue}`;
        }
    });
});