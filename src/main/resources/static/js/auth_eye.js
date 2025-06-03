document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM이 로드되었습니다. feather 사용 가능 : ', typeof feather !== 'undefined');

    if (typeof feather === 'undefined') {
        console.error('feather가 정의되지 않았습니다. feather.min.js가 올바르게 로드되었는지 확인하세요.');
        return;
    }

    document.querySelectorAll('.input-wrapper').forEach(function (wrapper) {
        const passwordInput = wrapper.querySelector('input[type="password"]');
        const eyeContainer = wrapper.querySelector('.password-eye-container');
        if (!passwordInput || !eyeContainer) return;

        eyeContainer.innerHTML = feather.icons['eye'].toSvg();

        eyeContainer.addEventListener('click', function () {
            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
            const iconName = isPassword ? 'eye-off' : 'eye';
            this.innerHTML = feather.icons[iconName].toSvg();
        });
    });

    feather.replace();
});
