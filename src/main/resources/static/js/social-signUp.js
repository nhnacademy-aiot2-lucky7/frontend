document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    const departmentSelect = document.getElementById('departmentId');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const authCard = document.getElementById('authCard');

    const login = document.querySelector('meta[name="login"]')?.content;
    const accessToken = document.querySelector('meta[name="access-token"]')?.content;
    const userEmail = document.querySelector('meta[name="user-email"]')?.content;

    // 로딩 표시 보이기, 폼 숨기기
    loadingOverlay.style.display = 'flex';
    authCard.style.display = 'none';

    // 1. 회원가입 여부 확인
    fetch(`https://luckyseven.live/api/auth/social/signIn`, {
        method: 'POST',
        headers: {
            'Authorization': accessToken ? `${accessToken}` : ''
        },
        credentials: 'include',
        body: userEmail
    })
        .then(response => {
            if (!response.ok) throw new Error('회원정보 확인 실패');
            return response.json();
        })
        .then(data => {
            loadingOverlay.style.display = 'none';
            if (data.isSignedUp) {
                // 이미 회원가입된 경우
                localStorage.setItem('isLoggedIn', 'true');
                window.location.replace('/dashboard');
            } else {
                // 회원가입 안 된 경우 폼 보이기
                authCard.style.display = 'block';
            }
        })
        .catch(error => {
            loadingOverlay.style.display = 'none';
            // 만약 엔드포인트가 없다면, login 메타값으로 처리
            if (login === 'true') {
                // 이미 로그인된 경우(회원가입 완료 상태로 간주)
                localStorage.setItem('isLoggedIn', 'true');
                window.location.replace('/dashboard');
            } else {
                // 그 외에는 폼 보이기
                authCard.style.display = 'block';
            }
            console.error('회원정보 확인 실패:', error);
        });

    // 부서 목록 불러오기
    fetch('https://luckyseven.live/api/departments/all')
        .then(response => {
            if (!response.ok) throw new Error('부서 정보를 불러오는데 실패했습니다.');
            return response.json();
        })
        .then(departments => {
            departments.forEach(dept => {
                const option = document.createElement('option');
                option.value = dept.departmentId;
                option.textContent = dept.departmentName;
                departmentSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('부서 목록을 불러오지 못했습니다:', error);
            const errorOption = document.createElement('option');
            errorOption.textContent = '부서 정보를 불러올 수 없습니다';
            errorOption.disabled = true;
            departmentSelect.appendChild(errorOption);
        });

    // 회원가입 처리
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = form.querySelector('input[name="userName"]').value;
        const email = userEmail;
        const password = null;
        const department = form.querySelector('select[name="departmentId"]').value;

        if (!name || !department) {
            alert('모든 필드를 입력해 주세요');
            return;
        }

        fetch('https://luckyseven.live/api/auth/social/signUp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(accessToken ? {'Authorization': `${accessToken}`} : {})
            },
            body: JSON.stringify({
                userName: name,
                userEmail: email,
                userPassword: password,
                userDepartment: department,
                userPhone: "010-1234-5678"
            }),
            credentials: 'include'
        })
            .then(response => {
                if (!response.ok) {
                    if (response.status === 409) throw new Error('이미 가입된 이메일입니다');
                    throw new Error(`오류 발생: ${response.status}`);
                }
                const contentType = response.headers.get('content-type');
                return contentType && contentType.includes('application/json')
                    ? response.json()
                    : {success: true};
            })
            .then(data => {
                if (data.success) {
                    alert('회원가입이 완료되었습니다');
                    localStorage.setItem('isLoggedIn', 'true');
                    window.location.replace('/dashboard');
                } else {
                    alert(data.message || '회원가입에 실패했습니다');
                }
            })
            .catch(error => {
                console.error('에러:', error);
                alert(error.message || '서버 오류가 발생했습니다');
            });
    });
});
