document.addEventListener('DOMContentLoaded', function() {
    // 페이지 로드 시 로고에 페이드인 효과 추가
    const logoContainer = document.querySelector('.logo-container');
    logoContainer.style.opacity = 0;

    setTimeout(() => {
        logoContainer.style.transition = 'opacity 1.5s ease-in-out';
        logoContainer.style.opacity = 1;
    }, 300);

    // 광선검 효과 추가
    const lightsaber = document.querySelector('.lightsaber');
    lightsaber.style.width = '0';

    setTimeout(() => {
        lightsaber.style.transition = 'width 1.5s ease-in-out';

        // 화면 크기에 따라 적절한 너비 계산
        const logoRect = logoContainer.getBoundingClientRect();
        const maxWidth = Math.max(10, logoRect.left - 20) + 'px';

        lightsaber.style.width = maxWidth;
    }, 500);

    // 화면 크기 변경 시 광선검 너비 조정
    window.addEventListener('resize', function() {
        const logoRect = logoContainer.getBoundingClientRect();
        const maxWidth = Math.max(10, logoRect.left - 20) + 'px';

        lightsaber.style.width = maxWidth;
    });

    // 모든 텍스트와 광선검 애니메이션이 완료될 때까지 대기
    const welcomeContainer = document.querySelector('.welcome-container');

    setTimeout(() => {
        // 전체 화면에 전환 효과 추가 - 부드럽게 스르륵 올라가도록 수정
        welcomeContainer.style.transition = 'transform 2s ease-in-out';
        welcomeContainer.style.transform = 'translateY(-20%)'; // -100%에서 -20%로 수정
    }, 2500);

    // 버튼 3개 표시 구현
    const buttonContainer = document.createElement('div');
    buttonContainer.style.position = 'absolute';
    buttonContainer.style.bottom = '25%';
    buttonContainer.style.left = '50%';
    buttonContainer.style.transform = 'translateX(-50%)';
    buttonContainer.style.display = 'flex';
    buttonContainer.style.gap = '100px'; // 버튼 간격 조절
    buttonContainer.style.opacity = '0';
    buttonContainer.style.transition = 'opacity 1.5s ease-in-out';
    buttonContainer.style.backgroundColor = '#000000'; // 배경색 추가
    buttonContainer.style.padding = '10px'; // 패딩 추가

// 버튼 생성 - 원형 버튼으로 수정
    const buttonTexts = ['로그인', '회원가입', '대시보드'];
    const buttonUrls = ['pages-sign-in.html', 'pages-sign-up.html', 'index.html'];

    for (let i = 0; i < 3; i++) {
        const button = document.createElement('div');
        button.style.width = '150px';
        button.style.height = '150px';
        button.style.borderRadius = '50%';
        button.style.border = '2px solid #ffffff';
        button.style.cursor = 'pointer';
        button.style.display = 'flex';
        button.style.justifyContent = 'center';
        button.style.alignItems = 'center';
        button.style.color = '#ffffff';
        button.style.fontWeight = 'bold';
        button.style.fontSize = '18px';
        button.textContent = buttonTexts[i];

        // 클릭 이벤트 리스너 추가
        button.addEventListener('click', function() {
            window.location.href = buttonUrls[i]; // 해당 URL로 페이지 이동
        });

        buttonContainer.appendChild(button);
    }

    document.body.appendChild(buttonContainer);

    // 화면 전환 후 버튼 표시
    setTimeout(() => {
        buttonContainer.style.opacity = '1';
    }, 3500); // 화면 전환 시작 후 1초 뒤에 버튼 표시
});
