document.addEventListener('DOMContentLoaded', async function () {

    // 저장 버튼 이벤트 리스너는 아래와 같이 유지
    const saveBtn = document.getElementById('saveBtn');
    const dashboardForm = document.getElementById('dashboardForm');

    saveBtn.addEventListener('click', async function (e) {
        e.preventDefault();

        const nameInput = document.getElementById('name').value;
        const descriptionInput = document.getElementById('description').value;

        console.log('대시보드 이름:', nameInput);
        if (!dashboardForm.checkValidity()) {
            dashboardForm.reportValidity();
            return;
        }

        if (!nameInput.trim()) {
            alert('대시보드 이름을 입력해주세요.');
            return;
        }

        // API 경로
        const apiPath = '/dashboard';

        const requestBody = {
            dashboardTitle: nameInput,
        };

        try {
            const response = await fetch(apiPath, {
                method: 'POST',
                credentials: 'include',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                let message = `서버 에러: ${response.status}`;

                try {
                    const errorText = await response.text();
                    const parsed = JSON.parse(errorText);
                    const match = parsed.trace?.match(/"message":"(.*?)"/);
                    if (match) {
                        message = match[1];
                    } else if (parsed.message) {
                        message = parsed.message;
                    }
                } catch (e) {
                    console.warn("응답 파싱 실패:", e);
                }

                alert(`⚠️ 대시보드 생성 실패: ${message}`);
                return;
            }

            alert('🎉 대시보드 생성 성공');

            // 생성 후 이동 처리
            window.location.href = window.currentUser.role === 'ROLE_ADMIN' ? '/admin/dashboard-info' : '/pages/user/dashboard-info';

        } catch (error) {
            console.error('⚠️ 대시보드 생성 오류:', error);
            alert(`⚠️ 대시보드 생성 실패: ${error.message}`);
        }
    });
});