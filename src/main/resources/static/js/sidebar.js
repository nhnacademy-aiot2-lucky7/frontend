// sidebar.js - 사이드바를 로드하는 스크립트
document.addEventListener('DOMContentLoaded', function() {
    const sidebarContainer = document.getElementById('sidebar-container');

    fetch('/sidebar')
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(data, 'text/html');
            const sidebar = doc.querySelector('#sidebar');

            sidebarContainer.appendChild(sidebar);

            // 사이드바가 DOM에 추가된 후에 함수 호출
            setTimeout(() => {
                if (typeof feather !== 'undefined') {
                    feather.replace();
                }
                highlightCurrentPage();
                updateMenuByLoginStatus(); // 여기서 호출
            }, 100); // 약간의 지연 추가
        })
        .catch(error => {
            console.error('사이드바 로드 중 오류 발생:', error);
        });
});

// 현재 페이지 메뉴 항목 강조 표시 함수
function highlightCurrentPage() {
    // 현재 페이지 경로 가져오기
    const currentPath = window.location.pathname;
    console.log("현재 경로:", currentPath); // 디버깅용

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

    // 관리 메뉴의 모든 자식 메뉴 경로를 동적으로 수집
    const managementPaths = [];
    const managementSubmenus = document.querySelectorAll('#management-parent .sidebar-dropdown .sidebar-link');

    managementSubmenus.forEach(submenu => {
        const href = submenu.getAttribute('href');
        if (href) managementPaths.push(href);
    });

    console.log("관리 하위 메뉴 경로:", managementPaths); // 디버깅용

    // 현재 경로가 관리 하위 메뉴인지 확인
    const isManagementChild = managementPaths.some(path => currentPath.includes(path));

    // 현재 페이지와 일치하는 링크 찾기
    let currentPageLink = null;

    sidebarLinks.forEach(link => {
        const href = link.getAttribute('href');
        // href가 null이면 건너뛰기 (관리 메뉴의 div 요소)
        if (!href) return;

        // 전체 경로 비교 (href가 currentPath에 포함되는지)
        if (currentPath === href || (currentPath === '/' && href === '/dashboard')) {
            currentPageLink = link;

            // 관리 하위 메뉴가 아닌 경우에만 active 클래스 추가
            if (!isManagementChild) {
                const menuItem = link.closest('.sidebar-item');
                if (menuItem) menuItem.classList.add('active');
            }
        }
    });

    // 관리 하위 메뉴가 선택된 경우
    if (isManagementChild) {
        // 현재 경로와 일치하는 하위 메뉴 링크 찾기
        sidebarLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (!href) return;

            if (currentPath.includes(href)) {
                // 선택된 하위 메뉴만 굵게 표시
                link.style.fontWeight = 'bold';
                link.classList.add('selected');
                currentPageLink = link;
            }
        });

        // 부모 메뉴인 관리에 active 클래스 추가
        const managementParent = document.getElementById('management-parent');
        if (managementParent) {
            managementParent.classList.add('active');
        }
    }

    console.log("현재 페이지 링크:", currentPageLink); // 디버깅용
    console.log("관리 하위 메뉴:", isManagementChild); // 디버깅용
}


// 지금은 비활성
// 로그인 상태에 따라 메뉴 표시/숨김 처리 함수
// function updateMenuByLoginStatus() {
//     const isLoggedIn = checkLoginStatus();
//     console.log("로그인 상태:", isLoggedIn); // 디버깅용
//
//     // 모든 사이드바 항목 가져오기
//     const sidebarItems = document.querySelectorAll('.sidebar-item');
//     let loginItem = null;
//     let mypageItem = null;
//
//     // 텍스트 내용으로 로그인/마이페이지 항목 찾기
//     sidebarItems.forEach(item => {
//         const linkText = item.textContent.trim();
//         if (linkText.includes('로그인')) {
//             loginItem = item;
//         } else if (linkText.includes('마이페이지')) {
//             mypageItem = item;
//         }
//     });
//
//     // 로그인/마이페이지 버튼 표시 설정
//     if (loginItem) {
//         loginItem.style.display = isLoggedIn ? 'none' : 'block';
//     } else {
//         console.warn("로그인 메뉴 항목을 찾을 수 없습니다.");
//     }
//
//     if (mypageItem) {
//         mypageItem.style.display = isLoggedIn ? 'block' : 'none';
//     } else {
//         console.warn("마이페이지 메뉴 항목을 찾을 수 없습니다.");
//     }
//
//     // 로그인 상태가 아니면 다른 모든 메뉴 숨기기
//     sidebarItems.forEach(item => {
//         // 로그인 항목은 제외
//         if (item !== loginItem) {
//             item.style.display = isLoggedIn ? 'block' : 'none';
//         }
//     });
// }

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
