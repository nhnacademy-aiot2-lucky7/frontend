function getBannerImage(title) {
    if (title.includes('서버')) return '/img/equipment/banner_server_room.jpg';
    if (title.includes('출입')) return '/img/equipment/banner_access_control.png';
    if (title.includes('재난') || title.includes('재해')) return '/img/equipment/banner_calamity.jpg';
    if (title.includes('장비')) return '/img/equipment/banner_equipment.jpg';
    if (title.includes('전력')) return '/img/equipment/banner_power_usage.jpg';
    return '/img/equipment/banner_default.png';
}

document.addEventListener('DOMContentLoaded', async () => {
    const dashboardList = document.getElementById('dashboardList');

    try {
        const response = await fetch('/api/dashboards', {
            method: 'GET',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'}
        });

        if (!response.ok) throw new Error('대시보드 조회 실패');

        const dashboards = await response.json();

        console.log("결과", dashboards);
        const userDepartment = window.currentUser.department;

        if (!userDepartment) {
            dashboardList.textContent = '사용자 부서 정보를 찾을 수 없습니다.';
            return;
        }

        const userDepartmentId = userDepartment.id;
        const filteredDashboards = dashboards.filter(d => d.departmentId === userDepartmentId);

        console.log("userDepartmentId: ", userDepartment.id);

        console.log("filter:", filteredDashboards);
        if (filteredDashboards.length === 0) {
            dashboardList.textContent = '부서에 맞는 대시보드가 없습니다.';
            return;
        }

        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.flexWrap = 'wrap';
        container.style.gap = '16px';

        filteredDashboards.forEach(d => {
            const dashboardTitle = d.title || '이름 없음';
            const dashboardUid = d.uid;

            const bannerSrc = getBannerImage(dashboardTitle);

            const bannerWrapper = document.createElement('div');
            bannerWrapper.style.position = 'relative';
            bannerWrapper.style.width = '1800px';
            bannerWrapper.style.height = '150px';

            const banner = document.createElement('div');
            banner.style.backgroundImage = `url(${bannerSrc})`;
            banner.style.backgroundSize = 'cover';
            banner.style.backgroundPosition = 'center';
            banner.style.width = '1800px';
            banner.style.height = '150px';
            banner.style.borderRadius = '12px';
            banner.style.boxShadow = '0 4px 10px rgba(0,0,0,0.2)';
            banner.style.display = 'flex';
            banner.style.alignItems = 'center';
            banner.style.justifyContent = 'center';
            banner.style.color = 'white';
            banner.style.fontSize = '1.1rem';
            banner.style.fontWeight = 'bold';
            banner.style.textShadow = '1px 1px 4px rgba(0,0,0,0.6)';
            banner.style.cursor = 'pointer';
            banner.style.transition = 'transform 0.2s';

            banner.textContent = dashboardTitle;

            banner.addEventListener('mouseenter', () => {
                banner.style.transform = 'scale(1.02)';
            });
            banner.addEventListener('mouseleave', () => {
                banner.style.transform = 'scale(1)';
            });

            banner.addEventListener('click', () => {
                window.location.href = `/panel/${dashboardUid}`;
            });

            // 버튼 컨테이너 생성
            const buttonContainer = document.createElement('div');
            buttonContainer.style.position = 'absolute';
            buttonContainer.style.top = '10px';
            buttonContainer.style.right = '10px';
            buttonContainer.style.display = 'flex';
            buttonContainer.style.gap = '8px'; // 버튼 간격
            buttonContainer.style.zIndex = '2';

            // 삭제 버튼
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '삭제';
            deleteBtn.style.backgroundColor = '#e74c3c';
            deleteBtn.style.border = 'none';
            deleteBtn.style.color = 'white';
            deleteBtn.style.padding = '6px 10px';
            deleteBtn.style.borderRadius = '6px';
            deleteBtn.style.cursor = 'pointer';
            deleteBtn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';

            // 수정 버튼
            const updateBtn = document.createElement('button');
            updateBtn.textContent = '수정';
            updateBtn.style.backgroundColor = '#2ecc71';
            updateBtn.style.border = 'none';
            updateBtn.style.color = 'white';
            updateBtn.style.padding = '6px 10px';
            updateBtn.style.borderRadius = '6px';
            updateBtn.style.cursor = 'pointer';
            updateBtn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';

            // 수정 버튼 클릭 시 페이지 이동
            updateBtn.addEventListener('click', function (e) {
                e.stopPropagation(); // 배너 클릭 방지
                window.location.href = `/test/${d.dashboardId}`;
            });

            // 삭제 버튼 클릭 이벤트
            deleteBtn.addEventListener('click', async (e) => {
                e.stopPropagation();
                if (!confirm(`정말 "${dashboardTitle}" 대시보드를 삭제하시겠습니까?`)) return;

                try {
                    const res = await fetch("https://luckyseven.live/api/dashboards", {
                        method: 'DELETE',
                        credentials: 'include',
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            dashboardUid: dashboardUid
                        })
                    });

                    if (!res.ok) throw new Error('삭제 실패');

                    bannerWrapper.remove(); // UI에서 제거
                } catch (err) {
                    alert('삭제 중 오류 발생: ' + err.message);
                }
            });

            // 버튼 컨테이너에 버튼 추가
            buttonContainer.appendChild(updateBtn);
            buttonContainer.appendChild(deleteBtn);

            // 삭제 버튼 추가
            /*const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '삭제';
            deleteBtn.style.position = 'absolute';
            deleteBtn.style.top = '10px';
            deleteBtn.style.right = '10px';
            deleteBtn.style.backgroundColor = '#e74c3c';
            deleteBtn.style.border = 'none';
            deleteBtn.style.color = 'white';
            deleteBtn.style.padding = '6px 10px';
            deleteBtn.style.borderRadius = '6px';
            deleteBtn.style.cursor = 'pointer';
            deleteBtn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
            deleteBtn.style.zIndex = '2';

            deleteBtn.addEventListener('click', async (e) => {
                e.stopPropagation(); // 배너 클릭 이벤트 방지

                if (!confirm(`정말 "${dashboardTitle}" 대시보드를 삭제하시겠습니까?`)) return;

                try {
                    const res = await fetch("https://luckyseven.live/api/dashboards", {
                        method: 'DELETE',
                        credentials: 'include',
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            dashboardUid: dashboardUid
                        })
                    });

                    if (!res.ok) throw new Error('삭제 실패');

                    // UI에서 제거
                    bannerWrapper.remove();
                } catch (err) {
                    alert('삭제 중 오류 발생: ' + err.message);
                }
            });

            // 수정 버튼
            const updateBtn = document.createElement('button');
            updateBtn.textContent = '삭제';
            updateBtn.style.position = 'absolute';
            updateBtn.style.top = '10px';
            updateBtn.style.right = '10px';
            updateBtn.style.backgroundColor = '#00ff78'; // '#e74c3c';
            updateBtn.style.border = 'none';
            updateBtn.style.color = 'white';
            updateBtn.style.padding = '6px 10px';
            updateBtn.style.borderRadius = '6px';
            updateBtn.style.cursor = 'pointer';
            updateBtn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
            updateBtn.style.zIndex = '2';

            updateBtn.addEventListener('click', function () {
                window.location.href = 'test/${d.dashboardId}';
            });*/

            bannerWrapper.appendChild(banner);
            bannerWrapper.appendChild(buttonContainer);
            container.appendChild(bannerWrapper);
        });

        dashboardList.appendChild(container);

    } catch (error) {
        console.error('대시보드 로딩 실패:', error);
        dashboardList.textContent = '대시보드 목록을 불러오는 데 실패했습니다.';
    }
});