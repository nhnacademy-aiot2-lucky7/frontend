// 로그아웃 처리 함수
function handleLogout() {
    // localStorage에서 로그인 상태 제거
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    // 폼 제출 후 리디렉션 처리
    fetch('https://luckyseven.live/auth/logout', {
        method: 'POST',
        credentials: 'include'
    })
        .then(response => {
            // 로그아웃 성공 메시지 표시
            alert('로그아웃 되었습니다.');

            // 로그아웃 후 대시보드로 리디렉션
            window.location.href = '/dashboard';
        })
        .catch(error => {
            console.error('로그아웃 오류:', error);
            // 오류가 발생해도 성공 메시지 표시 (사용자 경험 향상)
            alert('로그아웃 되었습니다.');

            // 대시보드로 리디렉션
            window.location.href = '/dashboard';
        });
}

document.addEventListener('DOMContentLoaded', function () {
    // 모든 드롭다운 요소 찾기
    var dropdownElements = document.querySelectorAll('[data-bs-toggle="dropdown"]');

    // 각 요소에 대해 드롭다운 인스턴스 생성
    dropdownElements.forEach(function (element) {
        try {
            new bootstrap.Dropdown(element);
            console.log('드롭다운 초기화 성공:', element);
        } catch (error) {
            console.error('드롭다운 초기화 실패:', error);
        }
    });

    // Feather Icons 초기화
    if (typeof feather !== 'undefined') {
        feather.replace();
        console.log('Feather icons initialized');
    }

    // 사이드바 토글 기능
    var sidebarToggle = document.querySelector('.sidebar-toggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function () {
            console.log('Sidebar toggle clicked');
            document.querySelector('.sidebar').classList.toggle('toggled');
            document.querySelector('.main').classList.toggle('toggled');
            document.querySelector('.navbar').classList.toggle('toggled');
        });
    }

    // // 관리 메뉴 드롭다운 토글
    // var managementParent = document.getElementById('management-parent');
    // if (managementParent) {
    //     managementParent.querySelector('.sidebar-link').addEventListener('click', function(e) {
    //         e.preventDefault();
    //         console.log('Management menu clicked');
    //         var dropdown = managementParent.querySelector('.sidebar-dropdown');
    //         if (dropdown) {
    //             dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    //         }
    //     });
    // }

    // Bootstrap 5 드롭다운 수동 초기화 (필요한 경우)
    if (typeof bootstrap !== 'undefined') {
        var dropdownElementList = [].slice.call(document.querySelectorAll('[data-bs-toggle="dropdown"]'));
        var dropdownList = dropdownElementList.map(function (element) {
            return new bootstrap.Dropdown(element);
        });
        console.log('Bootstrap dropdowns initialized');
    }

    // 커스텀 드롭다운 처리 (Bootstrap이 없는 경우)
    document.querySelectorAll('.dropdown-toggle:not([data-bs-toggle])').forEach(function (element) {
        element.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Custom dropdown clicked');

            var parent = this.parentNode;
            var isOpen = parent.classList.contains('show');

            // 모든 드롭다운 닫기
            document.querySelectorAll('.dropdown.show').forEach(function (dropdown) {
                dropdown.classList.remove('show');
                var dropdownMenu = dropdown.querySelector('.dropdown-menu');
                if (dropdownMenu) {
                    dropdownMenu.classList.remove('show');
                }
            });

            // 현재 드롭다운 토글
            if (!isOpen) {
                parent.classList.add('show');
                var dropdownMenu = parent.querySelector('.dropdown-menu');
                if (dropdownMenu) {
                    dropdownMenu.classList.add('show');
                }
            }
        });
    });

    // 드롭다운 외부 클릭 시 닫기
    document.addEventListener('click', function (e) {
        document.querySelectorAll('.dropdown.show').forEach(function (dropdown) {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('show');
                var dropdownMenu = dropdown.querySelector('.dropdown-menu');
                if (dropdownMenu) {
                    dropdownMenu.classList.remove('show');
                }
            }
        });
    });

    // 디버깅을 위한 로그
    console.log('custom.js loaded and executed');
});
