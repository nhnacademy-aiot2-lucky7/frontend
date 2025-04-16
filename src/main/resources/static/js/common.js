// custom.js - 원본 app.js에서 필요한 부분만 추출한 파일

document.addEventListener('DOMContentLoaded', function() {
    // Feather Icons 초기화는 sidebar.js에서 이미 처리하므로 제거

    // 사이드바 토글 기능
    var sidebarToggle = document.querySelector('.sidebar-toggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            document.querySelector('.sidebar').classList.toggle('toggled');
            document.querySelector('.main').classList.toggle('toggled');
            document.querySelector('.navbar').classList.toggle('toggled');
        });
    }

    // 드롭다운 메뉴 관련 코드
    document.querySelectorAll('.dropdown-toggle').forEach(function(element) {
        element.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            var parent = this.parentNode;
            var isOpen = parent.classList.contains('show');

            // 1. 모든 드롭다운 닫기
            document.querySelectorAll('.dropdown.show').forEach(function(dropdown) {
                dropdown.classList.remove('show');
                var dropdownMenu = dropdown.querySelector('.dropdown-menu');
                if (dropdownMenu) {
                    dropdownMenu.classList.remove('show');
                }
            });

            // 2. 만약 지금 클릭한 드롭다운이 원래 열려있지 않았다면 열기
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
    document.addEventListener('click', function(e) {
        document.querySelectorAll('.dropdown.show').forEach(function(dropdown) {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('show');
                var dropdownMenu = dropdown.querySelector('.dropdown-menu');
                if (dropdownMenu) {
                    dropdownMenu.classList.remove('show');
                }
            }
        });
    });

    // highlightCurrentPage 함수는 sidebar.js에서 이미 정의되어 있으므로 제거
});

// highlightCurrentPage 함수는 sidebar.js에서 이미 정의되어 있으므로 제거
