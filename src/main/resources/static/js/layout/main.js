// 로그아웃 처리 함수
function handleLogout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');

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

// localStorage에서 로그인 상태 확인
function checkLoginStatus() {
    let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn && window.loginUser) {
        isLoggedIn = true;
        localStorage.setItem('isLoggedIn', 'true');
    }

    const loginMenu = document.getElementById('login-menu');
    const mypageMenu = document.getElementById('mypage-menu');
    const dropDown = document.getElementById('nav-dropdown');
    const navLogin = document.getElementById('nav-login');

    if (isLoggedIn) {
        if (loginMenu) loginMenu.style.display = 'none';
        if (navLogin) navLogin.style.display = 'none';
        if (mypageMenu) mypageMenu.style.display = 'block';
        if (dropDown) dropDown.style.display = 'block';
    } else {
        if (loginMenu) loginMenu.style.display = 'block';
        if (navLogin) navLogin.style.display = 'block';
        if (mypageMenu) mypageMenu.style.display = 'none';
        if (dropDown) dropDown.style.display = 'none';
    }
}

// 네비게이션 바 유저 정보 렌더링
function updateNavbarUserInfo() {
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
}

// 사이드바 토글 이벤트
function setupSidebarToggle() {
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            document.querySelector('.sidebar').classList.toggle('toggled');
            document.querySelector('.main').classList.toggle('toggled');
            document.querySelector('.navbar').classList.toggle('toggled');
        });
    }
}

// DOMContentLoaded 이벤트에서 공통 초기화
document.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus();
    updateNavbarUserInfo();
    setupSidebarToggle();

    // Feather Icons, Bootstrap 드롭다운 초기화는 layout.html에서 한 번만 처리
});
