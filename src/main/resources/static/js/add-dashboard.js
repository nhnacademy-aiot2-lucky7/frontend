document.addEventListener('DOMContentLoaded', function () {
    // 모든 토글 버튼에 이벤트 리스너 추가
    const toggleButtons = document.querySelectorAll('.toggle-btn');

    toggleButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            // 링크 클릭 이벤트 중지 (페이지 이동 방지)
            e.preventDefault();
            e.stopPropagation();

            // 토글 상태 변경
            const isOn = this.textContent === 'On';
            this.textContent = isOn ? 'Off' : 'On';
            this.style.backgroundColor = isOn ? '#999' : '#b77';

            // 여기에 서버로 상태 변경을 보내는 코드 추가 가능
            const bannerTitle = this.closest('.banner-container').querySelector('.banner-title').textContent;
            console.log(`${bannerTitle} 배너의 메인페이지 표시 상태가 ${isOn ? 'Off' : 'On'}로 변경되었습니다.`);
        });
    });
});