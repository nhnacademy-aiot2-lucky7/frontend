document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, feather available:', typeof feather !== 'undefined');

    if (typeof feather === 'undefined') {
        console.error('Feather is not defined! Check if feather.min.js is loaded correctly');
        return;
    }

    const eyeContainer = document.querySelector('.password-eye-container');
    const passwordInput = document.getElementById('userPassword'); // 여기 변경

    if (!eyeContainer || !passwordInput) {
        console.error('Required elements not found!');
        return;
    }

    // 초기 아이콘 설정
    eyeContainer.innerHTML = feather.icons['eye'].toSvg();

    // 클릭 이벤트
    eyeContainer.addEventListener('click', function() {
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';

        // 아이콘 직접 변경
        const iconName = isPassword ? 'eye-off' : 'eye';
        this.innerHTML = feather.icons[iconName].toSvg();
    });
});
