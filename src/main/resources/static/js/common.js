// 로그아웃 처리 함수
function handleLogout() {
    // localStorage에서 로그인 상태 제거
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');  // ✅ 핵심 추가

    // 폼 제출 후 리디렉션 처리
    fetch('https://luckyseven.live/auth/logout', {
        method: 'POST',
        credentials: 'include'
    })
        .then(response => {
            alert('로그아웃 되었습니다.');
            window.location.href = '/dashboard';
        })
        .catch(error => {
            console.error('로그아웃 오류:', error);
            alert('로그아웃 되었습니다.');
            window.location.href = '/dashboard';
        });
}

document.addEventListener('DOMContentLoaded', () => {
    // Feather Icons 초기화
    if (typeof feather !== 'undefined') {
        feather.replace();
        console.log('Feather icons initialized');
    }

    // Bootstrap 5 드롭다운 수동 초기화 (중복 최소화)
    if (typeof bootstrap !== 'undefined') {
        const dropdownElements = document.querySelectorAll('[data-bs-toggle="dropdown"]');
        dropdownElements.forEach(element => {
            new bootstrap.Dropdown(element);
        });
        console.log('Bootstrap dropdowns initialized');
    }

    // 사이드바 토글
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            console.log('Sidebar toggle clicked');
            document.querySelector('.sidebar').classList.toggle('toggled');
            document.querySelector('.main').classList.toggle('toggled');
            document.querySelector('.navbar').classList.toggle('toggled');
        });
    }

    // ✅ 유저정보 렌더링 (navbar.js 통합 느낌)
    const userDropdown = document.getElementById('user-dropdown');
    const loginButton = document.getElementById('login-button');
    const usernameSpan = document.getElementById('navbar-username');
    const profileImg = document.getElementById('navbar-profile-img');

    try {
        const localUserJson = localStorage.getItem("currentUser");
        const localCurrentUser = localUserJson ? JSON.parse(localUserJson) : null;

        if (localCurrentUser) {
            if (userDropdown) userDropdown.classList.remove('d-none');
            if (usernameSpan) usernameSpan.textContent = localCurrentUser.userName || "사용자";
            if (profileImg && localCurrentUser.image?.imagePath) {
                profileImg.src = localCurrentUser.image.imagePath;
            }
        } else {
            if (loginButton) loginButton.classList.remove('d-none');
        }
    } catch (e) {
        console.error("localStorage currentUser 파싱 에러:", e);
        if (loginButton) loginButton.classList.remove('d-none');
    }

    console.log('custom.js loaded and executed');
});
