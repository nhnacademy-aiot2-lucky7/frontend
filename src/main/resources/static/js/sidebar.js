// sidebar.js - 사이드바를 로드하는 스크립트
document.addEventListener('DOMContentLoaded', function() {
    // 사이드바 컨테이너 요소 가져오기
    const sidebarContainer = document.getElementById('sidebar-container');

    // 사이드바 HTML 가져오기
    fetch('/sidebar')
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(data, 'text/html');
            const sidebar = doc.querySelector('#sidebar');

            sidebarContainer.appendChild(sidebar);

            // feather 아이콘 초기화 보장
            setTimeout(() => {
                if (typeof feather !== 'undefined') {
                    feather.replace();
                }
            }, 0);

            highlightCurrentPage();
            updateMenuByLoginStatus();
        })
});

// 현재 페이지 메뉴 항목 강조 표시 함수
function highlightCurrentPage() {
    // 현재 페이지 경로 가져오기
    const currentPath = window.location.pathname;
    const pageName = currentPath.split('/').pop();

    // 모든 사이드바 링크 가져오기
    const sidebarLinks = document.querySelectorAll('.sidebar-link');

    // 기존 active 클래스 제거
    document.querySelectorAll('.sidebar-item.active').forEach(item => {
        item.classList.remove('active');
    });

    // 기존 selected 클래스와 굵은 글씨 제거
    document.querySelectorAll('.sidebar-link.selected').forEach(link => {
        link.classList.remove('selected');
        link.style.fontWeight = 'normal';
    });

    // 현재 페이지와 일치하는 링크 찾기
    let isManagementChild = false;
    let currentPageLink = null;

    sidebarLinks.forEach(link => {
        const href = link.getAttribute('href');
        // href가 null이면 건너뛰기 (관리 메뉴의 div 요소)
        if (!href) return;

        if (href === pageName || (pageName === '' && href === 'index.html')) {
            currentPageLink = link;

            // 관리 하위 메뉴인지 확인
            if (href.includes('pages-server-room.html') ||
                href.includes('pages-power-usage.html') ||
                href.includes('pages-access-control.html') ||
                href.includes('pages-equipment.html') ||
                href.includes('pages-alert.html')) {
                isManagementChild = true;
            } else {
                // 관리 하위 메뉴가 아닌 경우에만 active 클래스 추가
                const menuItem = link.closest('.sidebar-item');
                menuItem.classList.add('active');
            }
        }
    });

    // 관리 하위 메뉴가 선택된 경우
    if (isManagementChild && currentPageLink) {
        // 선택된 하위 메뉴만 굵게 표시
        currentPageLink.style.fontWeight = 'bold';
        currentPageLink.classList.add('selected');

        // 부모 메뉴인 관리에만 active 클래스 추가
        const managementParent = document.getElementById('management-parent');
        if (managementParent) {
            managementParent.classList.add('active');
        }
    }
}

// 로그인 상태에 따라 메뉴 표시/숨김 처리 함수
function updateMenuByLoginStatus() {
    // 로그인 상태 확인 (세션 스토리지, 로컬 스토리지 또는 쿠키에서 확인)
    const isLoggedIn = checkLoginStatus();

    // 로그인/마이페이지 버튼 요소 가져오기
    const loginBtn = document.querySelector('.login-btn');
    const mypageBtn = document.querySelector('.mypage-btn');

    // 로그인 상태에 따라 버튼 표시 여부 설정
    if (loginBtn && mypageBtn) {
        if (isLoggedIn) {
            loginBtn.style.display = 'none';
            mypageBtn.style.display = 'block';
        } else {
            loginBtn.style.display = 'block';
            mypageBtn.style.display = 'none';
        }
    }
}

// 로그인 상태 확인 함수
function checkLoginStatus() {
    // 세션 스토리지에서 로그인 정보 확인
    const userToken = sessionStorage.getItem('userToken');

    // 로컬 스토리지에서 로그인 정보 확인 (자동 로그인 등)
    const savedToken = localStorage.getItem('userToken');

    // 쿠키에서 로그인 정보 확인
    const cookies = document.cookie.split(';');
    let cookieToken = null;

    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith('userToken=')) {
            cookieToken = cookie.substring('userToken='.length, cookie.length);
            break;
        }
    }

    // 어느 하나라도 존재하면 로그인 상태로 간주
    return userToken || savedToken || cookieToken;
}
