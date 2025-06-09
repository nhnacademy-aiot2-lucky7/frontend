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
        const response = await fetch('https://luckyseven.live/api/dashboards/user', {
            method: 'GET',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'}
        });

        if (!response.ok) throw new Error('대시보드 조회 실패');

        const dashboards = await response.json();
        console.log("사용자의 대시보드 리스트 조회: ", dashboards);

        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.flexWrap = 'wrap';
        container.style.gap = '16px';

        const departmentId = window.currentUser.department.departmentId;
        const mainDashboardUid = await fetch(`https://luckyseven.live/api/main/dashboard/${departmentId}`, {
            method: 'GET',
            credentials: 'include'
        })
            .then(response => response.json())
            .then(json => json.dashboardUid());

        dashboards.forEach(d => {
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
            updateBtn.style.backgroundColor = '#1e3a8a';
            updateBtn.style.border = 'none';
            updateBtn.style.color = 'white';
            updateBtn.style.padding = '6px 10px';
            updateBtn.style.borderRadius = '6px';
            updateBtn.style.cursor = 'pointer';
            updateBtn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';

            // 메인 토글 스위치 생성
            const mainToggleWrapper = document.createElement('label');
            mainToggleWrapper.className = 'toggle-switch';
            mainToggleWrapper.style.display = 'inline-flex';
            mainToggleWrapper.style.alignItems = 'center';
            mainToggleWrapper.style.gap = '8px';
            mainToggleWrapper.style.cursor = 'pointer';

            // input[type=checkbox]
            const mainToggleInput = document.createElement('input');
            mainToggleInput.type = 'checkbox';
            mainToggleInput.className = 'main-toggle-input';
            mainToggleInput.checked = (mainDashboardUid === dashboardUid); // 활성화 여부
            mainToggleInput.disabled = (mainDashboardUid === dashboardUid); // 다른 대시보드면 비활성화

            // span
            const mainToggleSlider = document.createElement('span');
            mainToggleSlider.className = 'slider';

            // 수정 버튼 클릭 시 페이지 이동
            updateBtn.addEventListener('click', function (e) {
                e.stopPropagation(); // 배너 클릭 방지

                // 이미 입력창이 존재하는지 체크
                if (banner.querySelector('input')) return;

                const originalTitle = dashboardTitle;

                // 입력창 생성
                const input = document.createElement('input');
                input.type = 'text';
                input.value = dashboardTitle;
                input.style.padding = '4px 8px';
                input.style.fontSize = '1rem';
                input.style.borderRadius = '4px';
                input.style.border = '1px solid #ccc';
                input.style.marginRight = '8px';

                // 확인 버튼 생성
                const confirmBtn = document.createElement('button');
                confirmBtn.textContent = '확인';
                confirmBtn.style.padding = '4px 10px';
                confirmBtn.style.backgroundColor = '#10b981'; // green
                confirmBtn.style.color = 'white';
                confirmBtn.style.border = 'none';
                confirmBtn.style.borderRadius = '4px';
                confirmBtn.style.cursor = 'pointer';

                // 이벤트 전파 방지
                input.addEventListener('click', e => e.stopPropagation());
                confirmBtn.addEventListener('click', e => e.stopPropagation());

                // 기존 텍스트 제거
                banner.textContent = '';
                banner.style.justifyContent = 'flex-start';
                banner.style.paddingLeft = '24px';
                banner.appendChild(input);
                banner.appendChild(confirmBtn);

                // 저장 로직 함수
                async function saveNewTitle() {
                    const dashboardNewTitle = input.value.trim();

                    if (!dashboardNewTitle) {
                        alert('제목을 입력해주세요.');
                        return;
                    }

                    try {
                        const res = await fetch("https://luckyseven.live/api/dashboards", {
                            method: 'PUT',
                            credentials: 'include',
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                "dashboardUid": `${dashboardUid}`,
                                "dashboardNewTitle": `${dashboardNewTitle}`
                            })
                        });

                        if (!res.ok) throw new Error('업데이트 실패');

                        // 성공 시 UI 업데이트
                        banner.textContent = dashboardNewTitle;
                        banner.style.justifyContent = 'center';
                        banner.style.paddingLeft = '0';
                    } catch (err) {
                        alert('업데이트 중 오류 발생: ' + err.message);
                        // 실패 시 원래 제목 복원
                        banner.textContent = originalTitle;
                        banner.style.justifyContent = 'center';
                        banner.style.paddingLeft = '0';
                    }
                }

                // 확인 버튼 이벤트
                confirmBtn.addEventListener('click', async (event) => {
                    event.stopPropagation();
                    await saveNewTitle();
                });

                // Enter 키로 저장
                input.addEventListener('keydown', async (event) => {
                    if (event.key === 'Enter') {
                        event.stopPropagation();
                        await saveNewTitle();
                    }
                });

                input.focus();
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

            // 메인 설정 클릭 이벤트
            mainToggleInput.addEventListener('click', async (e) => {
                e.stopPropagation();

                // 이미 메인 설정된 경우
                if (mainDashboardUid === dashboardUid) {
                    alert('이미 메인으로 설정된 대시보드입니다.');
                    e.preventDefault(); // 토글 상태 안 바뀌도록 막음
                    return;
                }

                try {
                    const res = await fetch("https://luckyseven.live/api/main/dashboard", {
                        method: 'POST',
                        credentials: 'include',
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            departmentId: departmentId,
                            dashboardUid: dashboardUid,
                            dashboardTitle: dashboardTitle
                        })
                    });

                    if (!res.ok) throw new Error('메인 설정 실패');

                    // 모든 토글 초기화
                    document.querySelectorAll('.main-toggle-input').forEach(input => {
                        input.checked = false;
                        input.disabled = false;
                        const label = input.closest('label');
                        if (label) {
                            const span = label.querySelector('span');
                            if (span) {
                                span.textContent = '메인으로 설정';
                                span.style.color = '#6b7280';
                            }
                        }
                    });

                    // 현재 토글만 업데이트
                    mainToggleInput.checked = true;
                    mainToggleInput.disabled = true;
                    const label = mainToggleInput.closest('label');
                    if (label) {
                        const span = label.querySelector('span');
                        if (span) {
                            span.textContent = '메인 설정됨';
                            span.style.color = '#10b981';
                        }
                    }
                } catch (err) {
                    alert('메인 설정 중 오류 발생: ' + err.message);
                    mainToggleInput.checked = false;
                }
            });

            mainToggleWrapper.appendChild(mainToggleInput);
            mainToggleWrapper.appendChild(mainToggleSlider);

            // 버튼 컨테이너에 버튼 추가
            buttonContainer.appendChild(updateBtn);
            buttonContainer.appendChild(deleteBtn);
            buttonContainer.appendChild(mainToggleWrapper);

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