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

// 부서 목록 불러오기
fetch('/users/departments')
    .then(response => {
        if (!response.ok) {
            throw new Error('부서 정보를 불러오는데 실패했습니다.');
        }
        return response.json();
    })
    .then(departments => {
        const departmentSelect = document.getElementById('departmentId');

        // 각 부서를 드롭다운 옵션으로 추가
        departments.forEach(dept => {
            const option = document.createElement('option');
            option.value = dept.departmentId; // 부서 ID
            option.textContent = dept.departmentName; // 부서 이름
            departmentSelect.appendChild(option);
        });
    })
    .catch(error => {
        console.error('부서 목록을 불러오지 못했습니다:', error);
        const departmentSelect = document.getElementById('departmentId');
        const errorOption = document.createElement('option');
        errorOption.textContent = '부서 정보를 불러올 수 없습니다';
        errorOption.disabled = true;
        departmentSelect.appendChild(errorOption);
    });

// 회원가입 페이지
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');

    //로그인 여부 확인
    const token = localStorage.getItem('token');
    if (token) {
        window.location.href = '/dashboard'; // 이미 로그인 된 사람은 인덱스 페이지로 리다이렉트
        return;
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = form.querySelector('input[name = "userName"]').value;
        const email = form.querySelector('input[name = "userEmail"]').value;
        const password = form.querySelector('input[name = "userPassword"]').value;

        // 유효성 검사
        if (!name || !email || !password) {
            alert('값을 입력해 주세요');
            return;
        }

        // 이메일 형식 검사
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('유효한 이메일 주소를 입력해주세요.');
            return;
        }

        // 휴대폰 인증 여부 확인
        if (!window.isPhoneVerified) {
            alert('휴대폰 인증을 완료해 주세요.');
            return;
        }

        // 서버에 회원가입 요청 보내기
        fetch('api/signup', {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({name, email, password})
        })
            .then(response => {
                // HTTP 상태 확인
                if (!response.ok) {
                    if (response.status === 409) {
                        throw new Error('이미 가입된 이메일 입니다');
                    }
                    throw new Error(`HTTP Error! : , ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    alert('회원가입이 완료되었습니다');
                    window.location.href = '/sign-in';
                } else {
                    alert(data.message || '회원가입에 실패했습니다');
                }
            })
            .catch(error => {
                console.error('Error : ', error);
                alert(error.message || '서버 오류가 발생했습니다');
            });
    });
});