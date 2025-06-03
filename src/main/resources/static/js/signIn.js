document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    if (!form) return; // 로그인 폼이 없는 페이지에서는 실행하지 않음

    const emailInput = form.querySelector('input[name="userEmail"]');
    const passwordInput = form.querySelector('input[name="userPassword"]');
    const rememberCheckbox = form.querySelector('input[name="remember-me"]');

    // 저장된 이메일 불러오기
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
        emailInput.value = savedEmail;
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const email = emailInput.value;
        const password = passwordInput.value;
        const rememberMe = rememberCheckbox.checked;

        // 간단한 유효성 검사
        if (!email || !password) {
            alert('이메일과 비밀번호를 입력해주세요.');
            return;
        }

        console.log('로그인 시도:', {email, rememberMe});

        // 서버에 로그인 요청 보내기
        fetch('http://team1-eureka-gateway:10232/auth/signIn', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userEmail: email,
                userPassword: password,
                rememberMe: rememberMe
            }),
            credentials: 'include' // 쿠키 포함
        })
            .then(response => {
                console.log('응답 상태:', response.status);

                if (!response.ok) {
                    if (response.status === 401) {
                        throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
                    }
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                // 응답이 성공(200)이면 로그인 성공으로 간주
                return true;
            })
            .then(success => {
                if (success) {
                    console.log('로그인 성공');

                    // 이메일 기억하기
                    if (rememberMe) {
                        localStorage.setItem('rememberedEmail', email);
                    } else {
                        localStorage.removeItem('rememberedEmail');
                    }

                    // 로그인 상태 저장 (UI 업데이트용)
                    localStorage.setItem('isLoggedIn', 'true');

                    alert('로그인 성공!');
                    // 페이지 새로고침으로 Thymeleaf 렌더링 갱신
                    window.location.replace('/dashboard');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert(error.message || '서버 오류가 발생했습니다.');
            });
    });
});
