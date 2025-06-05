document.addEventListener('DOMContentLoaded', function () {
    const editForm = document.querySelector('.profile-section');
    const saveBtn = document.querySelector('.btn-block.btn-save');
    const newPasswordInput = document.querySelector('input[name="newPassword"]');
    const confirmPasswordInput = document.querySelector('input[name="confirmPassword"]');
    const currentPasswordInput = document.querySelector('input[name="currentPassword"]');
    const userPhoneInput = document.querySelector('input[name="userPhone"]');
    const photoInput = document.querySelector('input[name="profile_photo"]');
    const profileImage = document.getElementById('main-profile-photo');

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

    if (photoInput) {
        photoInput.addEventListener('change', function () {
            if (photoInput.files.length === 0) return;

            const file = photoInput.files[0];
            const formData = new FormData();
            formData.append('file', file);

            fetch('https://luckyseven.live/profile-image/upload', {
                method: 'POST',
                credentials: 'include',
                body: formData
            })
                .then(res => {
                    if (!res.ok) throw new Error('프로필 이미지 업로드 실패');
                    return res.text();
                })
                .then(url => {
                    profileImage.src = url;
                    alert('프로필 이미지가 변경되었습니다.');
                })
                .catch(err => {
                    alert(err.message);
                });
        });
    }

    editForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // 비밀번호가 비어 있을 경우 -> 전화번호만 수정
        if (!currentPasswordInput.value && !newPasswordInput.value && !confirmPasswordInput.value) {
            fetch('https://luckyseven.live/users/me', {
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

        // 비밀번호 변경
        if (currentPasswordInput.value && newPasswordInput.value && confirmPasswordInput.value) {
            if (newPasswordInput.value !== confirmPasswordInput.value) {
                alert('새 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
                return;
            }

            fetch('https://luckyseven.live/users/me/password', {
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

    function getUserEmailFromMeta() {
        const meta = document.querySelector('meta[name="user-email"]');
        if (!meta) throw new Error('사용자 이메일 정보를 찾을 수 없습니다.');
        return meta.content;
    }
});
