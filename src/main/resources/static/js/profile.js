document.addEventListener('DOMContentLoaded', function () {
    const deleteButton = document.getElementById('btn-delete-account');
    if (deleteButton) {
        deleteButton.addEventListener('click', async function () {
            if (!confirm('회원 탈퇴하시겠습니까?')) return;
            try {
                const response = await fetch('https://luckyseven.live/users/me', {
                    method: 'DELETE',
                    credentials: 'include'
                });
                if (response.ok) {
                    alert('탈퇴가 완료되었습니다.');
                    window.location.href = '/sign-in';
                } else {
                    alert('탈퇴 처리 중 오류가 발생했습니다.');
                }
            } catch (error) {
                console.error('회원 탈퇴 요청 오류:', error);
                alert('회원 탈퇴 요청 중 오류가 발생했습니다.');
            }
        });
    }
});