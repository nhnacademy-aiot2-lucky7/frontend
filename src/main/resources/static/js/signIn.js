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

    async function loadUserToLocalStorage() {
        try {
            // 유저 정보 가져오기
            let userResponse = await fetch("https://luckyseven.live/api/users/me", {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });
            let user = await userResponse.json();

            // 이미지 정보 가져오기
            let imageResponse = await fetch(`https://luckyseven.live/api/images/${user.userEmail}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });
            let image = await imageResponse.json();

            // 로컬 스토리지에 저장
            let fullUser = {
                userRole: user.userRole,
                userNo: user.userNo,
                userName: user.userName,
                userEmail: user.userEmail,
                userPhone: user.userPhone,
                department: user.department,
                eventLevelResponse: user.eventLevelResponse,
                image: image
            };

            localStorage.setItem("currentUser", JSON.stringify(fullUser));
            console.log("유저정보 로컬스토리지 저장 완료");

        } catch (error) {
            console.error("유저 정보 불러오기 실패:", error);
        }
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
        fetch('https://luckyseven.live/api/auth/signIn', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userEmail: email,
                userPassword: password,
                rememberMe: rememberMe
            }),
        })
            .then(response => {
                console.log('응답 상태:', response.status);

                if (!response.ok) {
                    if (response.status === 401) {
                        throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
                    }
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                return response.text();  // 토큰 문자열 반환
            })
            .then(token => {
                console.log('로그인 성공, 토큰:', token);

                return fetch('/set-token-cookie', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token }),  // 토큰 전달
                    credentials: 'include'
                })
                    .then(() => {
                        alert('로그인 성공!');

                        if (rememberMe) {
                            localStorage.setItem('rememberedEmail', email);
                        } else {
                            localStorage.removeItem('rememberedEmail');
                        }

                        localStorage.setItem('isLoggedIn', 'true');

                        loadUserToLocalStorage().then(()=>{
                            window.location.replace('/index');
                        })
                    });
            })
            .catch(error => {
                console.error('Error:', error);
                alert(error.message || '서버 오류가 발생했습니다.');
            });
    });
});
