// 토글 버튼 이벤트 리스너 함수 (공통 함수로 분리)
function addToggleButtonListeners() {
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

            // 더미 데이터 업데이트
            const dashboard = dashboards.find(d => d.id === dashboardId);
            if (dashboard) {
                dashboard.active = !isActive;
            }

            // 상태 변경 로그
            const bannerTitle = this.closest('.banner-container').querySelector('.banner-title').textContent;
            console.log(`${bannerTitle} 배너의 관리페이지 표시 상태가 ${isActive ? 'Off' : 'On'}로 변경되었습니다.`);
        });
    });
}
