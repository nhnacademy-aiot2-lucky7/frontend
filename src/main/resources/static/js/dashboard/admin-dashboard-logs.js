document.addEventListener('DOMContentLoaded', function() {
    // 확인 버튼
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            window.history.back();
            // 또는 특정 페이지로 이동하고 싶다면
            // window.location.href = '/dashboard-info';
        });
    }

    // 부서 목록 가져오기
    const departments = JSON.parse(localStorage.getItem('departments')) || [];
    const departmentSelect = document.getElementById('department');

    // 부서 옵션 추가
    departments.forEach(department => {
        const option = document.createElement('option');
        option.value = department.id;
        option.textContent = department.name;
        departmentSelect.appendChild(option);
    });

    // 대시보드 목록 가져오기
    const dashboards = JSON.parse(localStorage.getItem('dashboards')) || [];
    const dashboardSelect = document.getElementById('dashboard');

    // 대시보드 옵션 추가
    dashboards.forEach(dashboard => {
        const option = document.createElement('option');
        option.value = dashboard.id;
        option.textContent = dashboard.name;
        dashboardSelect.appendChild(option);
    });

    // 차트 목록 가져오기
    const charts = JSON.parse(localStorage.getItem('charts')) || [];
    const chartSelect = document.getElementById('chart');

    // 차트 옵션 추가
    charts.forEach(chart => {
        const option = document.createElement('option');
        option.value = chart.id;
        option.textContent = chart.name;
        chartSelect.appendChild(option);
    });

    // 대시보드 선택 시 해당 대시보드의 차트만 표시
    dashboardSelect.addEventListener('change', function() {
        const selectedDashboardId = this.value;

        // 차트 옵션 초기화
        chartSelect.innerHTML = '<option value="">모든 차트</option>';

        if (selectedDashboardId) {
            // 선택된 대시보드의 차트만 필터링
            const filteredCharts = charts.filter(chart => chart.dashboardId == selectedDashboardId);

            // 필터링된 차트 옵션 추가
            filteredCharts.forEach(chart => {
                const option = document.createElement('option');
                option.value = chart.id;
                option.textContent = chart.name;
                chartSelect.appendChild(option);
            });
        } else {
            // 모든 차트 옵션 추가
            charts.forEach(chart => {
                const option = document.createElement('option');
                option.value = chart.id;
                option.textContent = chart.name;
                chartSelect.appendChild(option);
            });
        }
    });

    // 검색 폼 제출 이벤트
    document.getElementById('logs-search-form').addEventListener('submit', function(e) {
        e.preventDefault();

        const logLevel = document.getElementById('log-level').value;
        const dashboardId = document.getElementById('dashboard').value;
        const chartId = document.getElementById('chart').value;
        const logContent = document.getElementById('log-content').value.toLowerCase();

        // 여기에 실제 로그 필터링 및 표시 로직 구현
        // 서버에서 데이터를 가져오는 경우 AJAX 요청 구현
        // 또는 클라이언트 측에서 필터링하는 경우 필터링 로직 구현

        console.log('검색 조건:', {
            logLevel,
            dashboardId,
            chartId,
            logContent
        });
    });
});
