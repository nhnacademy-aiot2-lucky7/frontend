// 사용자 정보 더미 데이터
window.currentUser = {
    name: "홍길동",
    department: "운영팀",
    role: "ADMIN" // 'MEMBER' 또는 'ADMIN'
};

// 부서 목록 더미 데이터
window.departments = ["운영팀", "보안팀", "시설팀"];

// 날짜 포맷 함수
window.formatDate = function(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}년 ${month}월 ${day}일`;
};

// localStorage 초기화 함수
(function initializeLocalStorage() {
    try {
        // dashboards 데이터 초기화
        if (!localStorage.getItem('dashboards')) {
            // 기본 대시보드 데이터
            const defaultDashboards = [
                {
                    id: 1,
                    name: "서버룸",
                    description: "서버룸 모니터링 대시보드입니다.",
                    department: "운영팀",
                    createdAt: "2025-04-28T10:30:00",
                    updatedAt: "2025-04-28T15:45:00",
                    active: true,
                    chartCount: 2,
                    bannerImage: "/img/equipment/banner_server_room.jpg"
                }
                // 필요한 경우 여기에 더 많은 기본 대시보드 추가
            ];
            localStorage.setItem('dashboards', JSON.stringify(defaultDashboards));
        }

        // charts 데이터 초기화
        if (!localStorage.getItem('charts')) {
            // 기본 차트 데이터
            const defaultCharts = [
                {
                    id: 1,
                    dashboardId: 1,
                    name: "CPU 사용률",
                    type: "line",
                    displayOnMain: true,
                    displayOrder: 0
                }
                // 필요한 경우 여기에 더 많은 기본 차트 추가
            ];
            localStorage.setItem('charts', JSON.stringify(defaultCharts));
        }
    } catch (e) {
        console.error('localStorage 초기화 중 오류:', e);
    }
})();