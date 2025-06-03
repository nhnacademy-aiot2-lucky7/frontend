document.addEventListener('DOMContentLoaded', function() {
    // 현재 URL이 /admin/으로 시작하는지 검사
    if (window.location.pathname.startsWith('/admin/')) {
        // currentUser가 아예 null이거나 undefined, 또는 userRole이 없거나, ROLE_ADMIN이 아니면 차단
        if (
            typeof currentUser === 'undefined' ||
            !currentUser ||
            !currentUser.userRole ||
            currentUser.userRole !== 'ROLE_ADMIN'
        ) {
            alert('관리자만 접근할 수 있습니다.');
            window.location.href = '/dashboard';
        }
    }
});