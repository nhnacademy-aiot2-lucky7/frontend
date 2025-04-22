document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.profile-card');

    form.addEventListener('submit', function(event) {
        const currentPassword = document.querySelector('input[name="current_password"]').value;
        const newPassword = document.querySelector('input[name="password"]').value;
        const confirmPassword = document.querySelector('input[name="password_confirm"]').value;

        // 현재 비밀번호가 비어있는지 확인
        if (!currentPassword) {
            event.preventDefault();
            alert('현재 비밀번호를 입력해주세요.');
            return;
        }

        // 새 비밀번호를 입력한 경우, 확인 비밀번호와 일치하는지 확인
        if (newPassword && newPassword !== confirmPassword) {
            event.preventDefault();
            alert('새 비밀번호와 확인 비밀번호가 일치하지 않습니다.');
            return;
        }
    });
});
