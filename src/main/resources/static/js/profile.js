document.getElementById('btn-delete-account').addEventListener('click', async function() {
    // 알림창 띄우기
    if (!confirm('정말 탈퇴하시겠습니까?')) return;

    try {
        const response = await fetch('https://luckyseven.live/users/me', {
            method: 'DELETE',
            credentials: 'include'
        });

        if (response.ok) {
            alert('탈퇴가 완료되었습니다.');
            window.location.href = '/sign-in'; // 로그인 페이지로 이동
        } else {
            alert('탈퇴 처리 중 오류가 발생했습니다.');
        }
    } catch (error) {
        console.error('회원 탈퇴 요청 오류:', error);
        alert('회원 탈퇴 요청 중 오류가 발생했습니다.');
    }
});
