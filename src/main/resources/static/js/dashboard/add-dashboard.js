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

document.addEventListener('DOMContentLoaded', function() {
    // 부서명 입력란에 currentUser의 departmentName 자동 입력
    const departmentInput = document.getElementById('departmentName');
    departmentInput.value = currentUser.department && currentUser.department.departmentName ? currentUser.department.departmentName : '';

    const saveBtn = document.getElementById('saveBtn');
    const dashboardForm = document.getElementById('dashboardForm');

    saveBtn.addEventListener('click', function() {
        if (!dashboardForm.checkValidity()) {
            dashboardForm.reportValidity();
            return;
        }

        const nameInput = document.getElementById('name');
        const descriptionInput = document.getElementById('description');

        // 고유 id와 departmentId 추가
        const now = new Date().toISOString();
        const dashboardData = {
            id: Date.now(),
            name: nameInput.value,
            description: descriptionInput.value,
            departmentName: departmentInput.value,
            departmentId: currentUser.department.departmentId,
            active: false,
            bannerImage: getBannerImage(nameInput.value),
            createdAt: now,
            updatedAt: now,
            chartCount: 0
        };

        // 기존 localStorage에서 대시보드 목록 불러오기 (없으면 빈 배열)
        let dashboards = JSON.parse(localStorage.getItem('dashboards') || '[]');
        dashboards.push(dashboardData);
        localStorage.setItem('dashboards', JSON.stringify(dashboards));

        alert('대시보드가 로컬에 저장되었습니다.');
        if (currentUser.userRole === 'ROLE_ADMIN') {
            window.location.href = '/admin/dashboard-info';
        } else {
            window.location.href = '/dashboard-info';
        }
    });
});
