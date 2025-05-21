// auth-check.js
document.addEventListener('DOMContentLoaded', function() {
    // localStorage에서 로그인 상태 확인
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    console.log('로그인 상태:', isLoggedIn);

    // ID 선택자로 변경
    const loginMenu = document.getElementById('login-menu');
    const mypageMenu = document.getElementById('mypage-menu');
    const dropDown = document.getElementById('nav-dropdown');
    const navLogin = document.getElementById('nav-login');

    console.log('로그인 메뉴 요소:', loginMenu);
    console.log('마이페이지 메뉴 요소:', mypageMenu);

    if (isLoggedIn) {
        if (loginMenu) loginMenu.style.display = 'none';
        if (navLogin) navLogin.style.display = 'none';
        if (mypageMenu) mypageMenu.style.display = 'block';
        if (dropDown) dropDown.style.display = 'block';
        console.log('로그인 상태: 마이페이지 메뉴 표시');
    } else {
        if (loginMenu) loginMenu.style.display = 'block';
        if (navLogin) navLogin.style.display = 'block';
        if (mypageMenu) mypageMenu.style.display = 'none';
        if (dropDown) dropDown.style.display = 'none';
        console.log('비로그인 상태: 로그인 메뉴 표시');
    }
});
