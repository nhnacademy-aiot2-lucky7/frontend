function getBannerImage(title) {
    if (title.includes('서버')) {
        return '/img/equipment/banner_server_room.jpg';
    }
    if (title.includes('출입')) {
        return '/img/equipment/banner_access_control.png';
    }
    if (title.includes('재난') || title.includes('재해')) {
        return '/img/equipment/banner_calamity.jpg';
    }
    if (title.includes('장비')) {
        return '/img/equipment/banner_equipment.jpg';
    }
    if (title.includes('전력')) {
        return '/img/equipment/banner_power_usage.jpg';
    }
    return '/img/equipment/banner_default.png';
}

document.addEventListener('DOMContentLoaded', async function () {
    const departmentInput = document.getElementById('departmentName');

    // localStorage에서 현재 부서 정보 읽기
    const storedDept = JSON.parse(localStorage.getItem('currentDepartment'));
    if (storedDept && storedDept.departmentName) {
        departmentInput.value = storedDept.departmentName;
        window.currentUser.department = storedDept; // currentUser 객체에 세팅
    } else {
        departmentInput.value = '';
    }

    // 저장 버튼 이벤트 리스너는 아래와 같이 유지
    const saveBtn = document.getElementById('saveBtn');
    const dashboardForm = document.getElementById('dashboardForm');

    saveBtn.addEventListener('click', async function () {
        if (!dashboardForm.checkValidity()) {
            dashboardForm.reportValidity();
            return;
        }

        const nameInput = document.getElementById('name');
        const descriptionInput = document.getElementById('description');
        const now = new Date().toISOString();

        // API 경로
        const apiPath = window.currentUser.userRole === 'ROLE_ADMIN' ? '/admin/dashboard' : '/users/dashboard';

        // 실제 요청 보낼 body (필요하다면 부서ID도 포함)
        const requestBody = {
            dashboardTitle: nameInput.value,
            // 필요하다면: departmentId: currentUser.department.departmentId
        };

        try {
            const response = await fetch(apiPath, {
                method: 'POST',
                credentials: 'include',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(requestBody),
            });

            alert('🎉 대시보드 생성 성공');

            await fetchAndStoreDashboards();
            // 생성 후 이동 처리
            window.location.href = window.currentUser.userRole === 'ROLE_ADMIN' ? '/admin/dashboard-info' : '/dashboard-info';

        } catch (error) {
            console.error('⚠️ 대시보드 생성 오류:', error);
            alert('⚠️ 대시보드 생성 실패');
        }
    });
});