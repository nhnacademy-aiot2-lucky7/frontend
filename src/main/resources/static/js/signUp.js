document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    if (!form) return;

    const nameInput = form.querySelector('input[name="userName"]');
    const emailInput = form.querySelector('input[name="userEmail"]');
    const passwordInput = form.querySelector('input[name="userPassword"]');
    const departmentSelect = form.querySelector('select[name="departmentId"]');

    // 저장된 이메일 불러오기
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
        emailInput.value = savedEmail;
    }

    // 로그인 여부 확인
    const token = localStorage.getItem('token');
    if (token) {
        window.location.href = '/dashboard';
        return;
    }

    // 부서 목록 불러오기
    fetch('https://luckyseven.live/api/departments/all')
        .then(response => {
            if (!response.ok) {
                throw new Error('부서 정보를 불러오는데 실패했습니다.');
            }
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

    async function loadUserToLocalStorage() {
        try {
            const userResponse = await fetch("https://luckyseven.live/api/users/me", {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });
            const user = await userResponse.json();

            const imageResponse = await fetch(`https://luckyseven.live/api/images/${user.userEmail}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });
            const image = await imageResponse.json();

            const fullUser = {
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

        const name = nameInput.value;
        const email = emailInput.value;
        const password = passwordInput.value;
        const departmentId = departmentSelect.value;
        const rememberMe = form.querySelector('input[name="remember-me"]')?.checked ?? false;

        if (!name || !email || !password) {
            alert('값을 입력해 주세요');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('유효한 이메일 주소를 입력해주세요.');
            return;
        }

        fetch('https://luckyseven.live/api/auth/signUp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userName: name,
                userEmail: email,
                userPassword: password,
                userDepartment: departmentId,
                userPhone: "010-1234-5678"
            }),
            credentials: 'include'
        })
            .then(response => {
                if (!response.ok) {
                    if (response.status === 409) {
                        throw new Error('이미 가입된 이메일입니다.');
                    }
                    throw new Error(`HTTP Error: ${response.status}`);
                }
                return response.text();
            })
            .then(token => {
                return fetch('/set-token-cookie', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token }),
                    credentials: 'include'
                })
                    .then(() => {
                        alert('회원가입 및 로그인 성공!');
                        localStorage.setItem('rememberedEmail', email);

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
