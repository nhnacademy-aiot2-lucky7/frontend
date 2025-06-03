document.addEventListener('DOMContentLoaded', function () {
    const editForm = document.querySelector('.profile-section');
    const saveBtn = document.querySelector('.btn-block.btn-save');
    const newPasswordInput = document.querySelector('input[name="newPassword"]');
    const confirmPasswordInput = document.querySelector('input[name="confirmPassword"]');
    const currentPasswordInput = document.querySelector('input[name="currentPassword"]');
    const userPhoneInput = document.querySelector('input[name="userPhone"]');

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

    editForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // 비밀번호 입력이 모두 비어 있으면 휴대전화만 수정
        if (!currentPasswordInput.value && !newPasswordInput.value && !confirmPasswordInput.value) {
            fetch('http://localhost:10232/users/me', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    userPhone: userPhoneInput.value
                })
            })
                .then(res => {
                    if (!res.ok) throw new Error('휴대전화번호 수정 실패');
                    return res.text();
                })
                .then(() => {
                    alert('휴대전화번호가 수정되었습니다.');
                    window.location.href = '/profile';
                })
                .catch(err => {
                    alert(err.message);
                });
            return;
        }

        // 비밀번호 입력란이 모두 채워져 있으면 비밀번호 변경
        if (currentPasswordInput.value && newPasswordInput.value && confirmPasswordInput.value) {
            if (newPasswordInput.value !== confirmPasswordInput.value) {
                alert('새 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
                return;
            }

            fetch('http://localhost/users/me/password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    currentPassword: currentPasswordInput.value,
                    newPassword: newPasswordInput.value,
                    checkPassword: confirmPasswordInput.value
                })
            })
                .then(res => {
                    if (!res.ok) throw new Error('비밀번호 변경 실패');
                    return res.text();
                })
                .then(() => {
                    alert('비밀번호가 변경되었습니다. 다시 로그인 해주세요.');
                    window.location.href = '/sign-in';
                })
                .catch(err => {
                    alert(err.message);
                });
        }
    });
});
