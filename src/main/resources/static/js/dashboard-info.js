document.addEventListener('DOMContentLoaded', function() {
    const toggleButtons = document.querySelectorAll('.toggle-btn');

    toggleButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            try {
                // 이벤트 전파 중지 및 기본 동작 방지
                e.preventDefault();
                e.stopPropagation();

                // 토글 상태 변경
                const isOn = this.textContent === 'On';
                this.textContent = isOn ? 'Off' : 'On';
                this.style.backgroundColor = isOn ? '#999' : '#b77';

                // 배너 컨테이너를 찾고, 그 안에서 배너 제목을 찾습니다
                const container = this.closest('.banner-container');
                const bannerTitle = container.querySelector('.banner-title').textContent;
                console.log(`${bannerTitle} 배너의 메인페이지 표시 상태가 ${isOn ? 'Off' : 'On'}로 변경되었습니다.`);
            } catch (error) {
                console.error('토글 버튼 오류:', error);
            }
        });
    });
});
