document.addEventListener('DOMContentLoaded', function () {
    try {
        if (typeof feather !== 'undefined') {
            if (!window.__feather_called__) {
                window.__feather_called__ = true; // ✅ 중복 방지 플래그 설정
                feather.replace(); // ✅ feather 아이콘 변환 실행
            }
        } else {
            console.warn('Feather icons not loaded.');
        }
    } catch (e) {
        console.error('feather.replace() 실패:', e);
    }
});
