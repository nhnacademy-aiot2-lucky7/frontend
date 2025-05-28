function formatDate(dateString) {
    const d = new Date(dateString);
    let month = (d.getMonth() + 1).toString();
    let day = d.getDate().toString();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
}

document.addEventListener('DOMContentLoaded', function () {
    // 먼저 localStorage에서 최신 대시보드 데이터 로드
    try {
        const storedDashboards = localStorage.getItem('dashboards');
        if (storedDashboards) {
            dashboards = JSON.parse(storedDashboards);
        }

        const storedCharts = localStorage.getItem('charts');
        if (storedCharts) {
            charts = JSON.parse(storedCharts);
        }
    } catch (e) {
        console.error('localStorage 데이터 로드 중 오류:', e);
    }

    // URL에서 대시보드 ID 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const dashboardId = parseInt(urlParams.get('id'));

    if (!dashboardId) {
        alert('대시보드 ID가 유효하지 않습니다.');
        window.location.href = '/dashboard-info';
        return;
    }

    // 대시보드 찾기
    const dashboard = dashboards.find(d => d.id === dashboardId);
    if (!dashboard) {
        alert('대시보드를 찾을 수 없습니다.');
        window.location.href = '/dashboard-info';
        return;
    }

    // // 관리자 권한 확인 및 로그 버튼 표시
    // const adminLogSection = document.getElementById('adminLogSection');
    // const viewLogBtn = document.getElementById('viewLogBtn');
    //
    // // currentUser 객체가 있고 role이 'ADMIN'인 경우에만 로그 버튼 표시
    // if (typeof currentUser !== 'undefined' && currentUser && currentUser.userRole === 'ADMIN') {
    //     adminLogSection.style.display = 'flex';
    //
    //     // 로그 버튼 클릭 이벤트
    //     viewLogBtn.addEventListener('click', function() {
    //         // 로그 페이지로 이동 또는 로그 모달 표시
    //         window.location.href = `/dashboard-logs?id=${dashboardId}`;
    //     });
    // }

    // 대시보드 정보 표시
    document.getElementById('pageTitle').textContent = `${dashboard.name} 대시보드 상세 내역`;
    document.getElementById('dashboardName').textContent = dashboard.name;
    document.getElementById('dashboardDescription').textContent = dashboard.description;
    document.getElementById('chartCount').textContent = dashboard.chartCount;
    document.getElementById('dashboardStatus').textContent = dashboard.active ? '활성화' : '비활성화';
    document.getElementById('createdAt').textContent = formatDate(dashboard.createdAt);
    document.getElementById('updatedAt').textContent = formatDate(dashboard.updatedAt);

    // 요소 참조
    const addChartBtn = document.getElementById('addChartBtn');
    const sortChartsBtn = document.getElementById('sortChartsBtn');
    const editBtn = document.getElementById('editBtn');
    const saveBtn = document.getElementById('saveBtn');
    const deleteBtn = document.getElementById('deleteBtn');
    const backBtn = document.getElementById('backBtn');
    const addChartModal = document.getElementById('addChartModal');
    const sortChartsModal = document.getElementById('sortChartsModal');
    const addChartForm = document.getElementById('addChartForm');
    const sortableChartList = document.getElementById('sortableChartList');
    const saveSortBtn = document.getElementById('saveSortBtn');
    const closeBtns = document.querySelectorAll('.close');
    const dashboardNameElem = document.getElementById('dashboardName');
    const dashboardDescriptionElem = document.getElementById('dashboardDescription');

    // 차트 추가 버튼 클릭 이벤트 - 비활성화
    // addChartBtn.addEventListener('click', function () {
    //     addChartModal.style.display = 'block';
    // });

    // 차트 추가 페이지로 리다이렉트하는 코드로 대체 예정
    // addChartBtn.addEventListener('click', function () {
    //     window.location.href = '/add-chart?dashboardId=' + dashboardId;
    // });

    // 수정 버튼 클릭 이벤트
    editBtn.addEventListener('click', function () {
        // 수정 가능한 요소들에 편집 가능 상태 활성화
        dashboardNameElem.setAttribute('contenteditable', 'true');
        dashboardNameElem.style.borderColor = '#ccc';
        dashboardNameElem.style.backgroundColor = '#f9f9f9';

        dashboardDescriptionElem.setAttribute('contenteditable', 'true');
        dashboardDescriptionElem.style.borderColor = '#ccc';
        dashboardDescriptionElem.style.backgroundColor = '#f9f9f9';

        // 버튼 표시 상태 변경
        editBtn.style.display = 'none';
        saveBtn.style.display = 'inline-block';
    });

    // 대시보드 저장 버튼 클릭 이벤트
    saveBtn.addEventListener('click', function () {
        // 편집 가능 상태 비활성화
        dashboardNameElem.setAttribute('contenteditable', 'false');
        dashboardNameElem.style.borderColor = 'transparent';
        dashboardNameElem.style.backgroundColor = '';

        dashboardDescriptionElem.setAttribute('contenteditable', 'false');
        dashboardDescriptionElem.style.borderColor = 'transparent';
        dashboardDescriptionElem.style.backgroundColor = '';

        // 버튼 표시 상태 변경
        saveBtn.style.display = 'none';
        editBtn.style.display = 'inline-block';

        // 대시보드 정보 업데이트
        dashboard.name = dashboardNameElem.textContent;
        dashboard.description = dashboardDescriptionElem.textContent;
        dashboard.updatedAt = new Date().toISOString();

        // 페이지 제목 업데이트
        document.getElementById('pageTitle').textContent = `${dashboard.name} 대시보드 상세 내역`;

        // 수정일 업데이트
        document.getElementById('updatedAt').textContent = formatDate(dashboard.updatedAt);

        // localStorage에 대시보드 정보 저장
        const storedDashboards = JSON.parse(localStorage.getItem('dashboards'));
        const dashboardIndex = storedDashboards.findIndex(d => d.id === dashboardId);
        if (dashboardIndex !== -1) {
            storedDashboards[dashboardIndex] = dashboard;
            localStorage.setItem('dashboards', JSON.stringify(storedDashboards));
        }

        // localStorage에 차트 정보 저장
        localStorage.setItem('charts', JSON.stringify(charts));

        alert('대시보드가 저장되었습니다.');
    });

    // 대시보드 삭제 버튼 클릭 이벤트
    deleteBtn.addEventListener('click', function () {
        if (confirm('정말로 이 대시보드를 삭제하시겠습니까?')) {
            try {
                // localStorage에서 최신 데이터 가져오기
                let storedDashboards = [];
                let storedCharts = [];

                const dashboardsData = localStorage.getItem('dashboards');
                if (dashboardsData) {
                    storedDashboards = JSON.parse(dashboardsData);
                } else {
                    storedDashboards = dashboards; // 전역 변수 사용
                }

                const chartsData = localStorage.getItem('charts');
                if (chartsData) {
                    storedCharts = JSON.parse(chartsData);
                } else {
                    storedCharts = charts; // 전역 변수 사용
                }

                // 특정 대시보드만 제거
                const updatedDashboards = storedDashboards.filter(d => d.id !== dashboardId);

                // 관련 차트 제거
                const updatedCharts = storedCharts.filter(c => c.dashboardId !== dashboardId);

                // localStorage 업데이트
                localStorage.setItem('dashboards', JSON.stringify(updatedDashboards));
                localStorage.setItem('charts', JSON.stringify(updatedCharts));

                // 전역 변수도 업데이트 (필요시)
                dashboards = updatedDashboards;
                charts = updatedCharts;

                alert('대시보드가 삭제되었습니다.');
                window.location.href = '/dashboard-info';
            } catch (e) {
                console.error('데이터 삭제 중 오류 발생:', e);
                alert('대시보드 삭제 중 오류가 발생했습니다.');
            }
        }
    });

    // 뒤로 가기 버튼 클릭 이벤트
    backBtn.addEventListener('click', function () {
        if (typeof currentUser !== 'undefined' && currentUser && currentUser.userRole === 'ROLE_ADMIN') {
            window.location.href = '/admin/dashboard-info';
        } else {
            window.location.href = '/dashboard-info';
        }
    });

    // 모달 닫기 버튼 이벤트
    closeBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            addChartModal.style.display = 'none';
            sortChartsModal.style.display = 'none';
        });
    });

    // 모달 외부 클릭 시 닫기
    window.addEventListener('click', function (e) {
        if (e.target === addChartModal) {
            addChartModal.style.display = 'none';
        }
        if (e.target === sortChartsModal) {
            sortChartsModal.style.display = 'none';
        }
    });
});
