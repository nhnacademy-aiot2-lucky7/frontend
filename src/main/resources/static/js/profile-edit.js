document.addEventListener('DOMContentLoaded', function () {
    const newPasswordInput = document.querySelector('input[name="newPassword"]');
    const confirmPasswordInput = document.querySelector('input[name="confirmPassword"]');
    const saveBtn = document.querySelector('.btn-block.btn-save');

    function checkPasswordMatch() {
        if (!newPasswordInput || !confirmPasswordInput) return;
        let msg = document.getElementById('pw-match-msg');
        if (!msg) {
            msg = document.createElement('div');
            msg.id = 'pw-match-msg';
            msg.style.fontSize = '0.95rem';
            msg.style.marginTop = '4px';
            confirmPasswordInput.parentNode.appendChild(msg);
        }
        if (confirmPasswordInput.value && newPasswordInput.value !== confirmPasswordInput.value) {
            msg.textContent = '비밀번호가 일치하지 않습니다';
            msg.style.color = '#dc2626';
            if (saveBtn) saveBtn.disabled = true;
        } else {
            msg.textContent = '';
            if (saveBtn) saveBtn.disabled = false;
        }
    }

    if (newPasswordInput && confirmPasswordInput) {
        newPasswordInput.addEventListener('input', checkPasswordMatch);
        confirmPasswordInput.addEventListener('input', checkPasswordMatch);
    }
});
