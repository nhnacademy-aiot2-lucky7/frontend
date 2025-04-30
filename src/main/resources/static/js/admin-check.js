document.addEventListener('DOMContentLoaded', function() {
    // 현재 URL이 /admin/으로 시작하는지 검사
    if (window.location.pathname.startsWith('/admin/')) {
        // currentUser가 없거나, role이 ADMIN이 아니면 차단
        if (typeof currentUser === 'undefined' || !currentUser || currentUser.role !== 'ADMIN') {
            alert('관리자만 접근할 수 있습니다.');
            window.location.href = '/'; // 또는 원하는 페이지로 리다이렉트
        }
    }
});
