// 추후 변경 필요
//
// API 엔드포인트 URL:
//     /api/signup
//     /api/login
//
// 요청 본문(body)의 필드명:
//     회원가입: name, email, password
//     로그인: email, password, rememberMe
//
// 응답 데이터의 필드명:
//     success: 요청 성공 여부
//     token: JWT 토큰 (로그인 성공 시)
//     message: 오류 메시지 등
//     user: 사용자 정보 (선택적)
//
// HTTP 상태 코드:
//     409: 이미 존재하는 이메일 (회원가입 시)
//     401: 인증 실패 (로그인 실패 또는 토큰 만료)
//
// 토큰 필드명
//     token


// 로그인 페이지
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');

    // 이미 로그인되어 있는지 확인
    const token = localStorage.getItem('token');
    if (token) {
        window.location.href = 'index.html'; // 이미 로그인된 사용자는 메인 페이지로 리다이렉트
        return;
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const email = form.querySelector('input[name="email"]').value;
        const password = form.querySelector('input[name="password"]').value;
        const rememberMe = form.querySelector('input[name="remember-me"]').checked;

        // 간단한 유효성 검사
        if (!email || !password) {
            alert('이메일과 비밀번호를 입력해주세요.');
            return;
        }

        // 서버에 로그인 요청 보내기
        fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password, rememberMe })
        })
            .then(response => {
                // HTTP 상태 코드 확인
                if (!response.ok) {
                    if (response.status === 401) {
                        throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
                    }
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    // JWT 토큰 저장
                    localStorage.setItem('token', data.token);

                    // 사용자 정보 저장 (선택 사항)
                    if (data.user) {
                        localStorage.setItem('user', JSON.stringify(data.user));
                    }

                    alert('로그인 성공!');
                    window.location.href = 'index.html';
                } else {
                    alert(data.message || '로그인에 실패했습니다.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert(error.message || '서버 오류가 발생했습니다.');
            });
    });
});