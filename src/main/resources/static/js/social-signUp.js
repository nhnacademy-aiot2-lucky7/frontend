document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    const departmentSelect = document.getElementById('departmentId');

    const accessToken = document.querySelector('meta[name="access-token"]')?.content;
    const userEmail = document.querySelector('meta[name="user-email"]')?.content;

    fetch('http://localhost:10232/departments')
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

        fetch('http://localhost:10232/auth/social/signUp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(accessToken ? {'Authorization': `Bearer ${accessToken}`} : {})
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
