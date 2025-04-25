console.log('Current User:', currentUser);

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded');
    const saveBtn = document.getElementById('saveBtn');
    const dashboardForm = document.getElementById('dashboardForm');

    // currentUser 확인
    console.log('Current user:', currentUser);

    // 페이지 로드 시 로컬 스토리지에서 대시보드 데이터 로드
    let dashboardsArray = [];
    const storedDashboards = localStorage.getItem('dashboards');

    if (storedDashboards) {
        try {
            dashboardsArray = JSON.parse(storedDashboards);
        } catch (e) {
            // 파싱 오류 시 더미 데이터 사용 및 저장
            dashboardsArray = window.dashboards || [];
            localStorage.setItem('dashboards', JSON.stringify(dashboardsArray));
        }
    } else {
        // localStorage에 데이터가 없으면 더미 데이터 사용 및 저장
        dashboardsArray = window.dashboards || [];
        localStorage.setItem('dashboards', JSON.stringify(dashboardsArray));
    }

    saveBtn.addEventListener('click', function() {
        console.log('Save button clicked');

        // 폼 유효성 검사
        if (!dashboardForm.checkValidity()) {
            console.log('Form validation failed');
            dashboardForm.reportValidity();
            return;
        }

        const nameInput = document.getElementById('name');
        const descriptionInput = document.getElementById('description');
        console.log('Form values:', nameInput.value, descriptionInput.value);

        // 새 ID 생성 (기존 ID 중 가장 큰 값 + 1)
        let newId = 1;
        if (dashboardsArray.length > 0) {
            newId = Math.max(...dashboardsArray.map(d => d.id)) + 1;
        }
        console.log('New ID:', newId);

        // 새 대시보드 객체 생성
        const newDashboard = {
            id: newId,
            name: nameInput.value,
            description: descriptionInput.value,
            department: currentUser.department,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            active: true,
            chartCount: 0,
            bannerImage: "/img/equipment/default-banner.jpg"
        };
        console.log('New dashboard object:', newDashboard);

        // 대시보드 이름에 따라 배너 이미지 설정
        if (newDashboard.name.includes('서버')) {
            newDashboard.bannerImage = "/img/equipment/banner_server_room.jpg";
        } else if (newDashboard.name.includes('전력') || newDashboard.name.includes('사용량')) {
            newDashboard.bannerImage = "/img/equipment/banner_power_usage.jpg";
        } else if (newDashboard.name.includes('출입')) {
            newDashboard.bannerImage = "/img/equipment/banner_access_control.png";
        } else if (newDashboard.name.includes('장비')) {
            newDashboard.bannerImage = "/img/equipment/banner_equipment.jpg";
        } else if (newDashboard.name.includes('화재') || newDashboard.name.includes('침수')) {
            newDashboard.bannerImage = "/img/equipment/banner_calamity.jpg";
        } else {
            newDashboard.bannerImage = "/img/equipment/banner_default.png";
        }
        console.log('Banner image set:', newDashboard.bannerImage);

        // 더미 데이터에 추가
        dashboardsArray.push(newDashboard);
        console.log('Updated dashboards array:', dashboardsArray);

        try {
            localStorage.setItem('dashboards', JSON.stringify(dashboardsArray));
            console.log('Saved to localStorage');
        } catch (e) {
            console.error('Error saving to localStorage:', e);
        }

        alert('대시보드가 추가되었습니다.');

        // 사용자 역할에 따라 다른 페이지로 리다이렉트
        console.log('User role:', currentUser.role);
        if (currentUser.role === 'ADMIN') {
            console.log('Redirecting to admin dashboard');
            window.location.href = '/admin/dashboard-info';
        } else {
            console.log('Redirecting to user dashboard');
            window.location.href = '/dashboard-info';
        }

        // add-dashboard.js의 저장 버튼 이벤트 핸들러에 추가
        console.log('새 대시보드 추가:', newDashboard);
        console.log('현재 사용자 부서:', currentUser.department);
    });
});
