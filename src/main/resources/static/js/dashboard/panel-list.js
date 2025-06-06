document.addEventListener('DOMContentLoaded', () => {
    const dashboardUid = document.getElementById('panelList').dataset.dashboardUid;
    loadIframes(dashboardUid);
});

async function loadIframes(dashboardUid) {
    try {
        const endpoint = `https://luckyseven.live/api/panels/${dashboardUid}`;

        const res = await fetch(endpoint);
        if (!res.ok) new Error('패널 정보를 불러오지 못했습니다.');

        const panels = await res.json();
        const container = document.getElementById('panelList');
        container.innerHTML = ''; // 초기화

        console.log('로그 확인: ', panels);
        console.log('삭제 요청 panelId: ', panels.panelId);

        panels.forEach(panel => {
            const wrapper = document.createElement('div');
            wrapper.className = 'panel-card';

            // 제목
            const title = document.createElement('h3');
            title.textContent = panel.dashboardTitle || '제목 없음';
            title.className = 'panel-title';
            wrapper.appendChild(title);

            // 삭제 버튼
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '삭제';
            deleteBtn.className = 'delete-button';
            deleteBtn.addEventListener('click', async () => {
                console.log('삭제 시도 panel:', panel); // 디버깅용

                const confirmed = confirm(`"${panel.dashboardTitle || '제목 없음'}" 패널을 삭제하시겠습니까?`);
                if (!confirmed) return;

                try {
                    const res = await fetch("https://luckyseven.live/api/panels", {
                        method: 'DELETE',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            dashboardUid: panel.dashboardUid,
                            panelId: panel.panelId  // 하드코딩 제거!
                        })
                    });

                    if (res.status === 204) {
                        wrapper.remove(); // 성공 시 DOM에서 제거
                    } else {
                        alert('패널 삭제에 실패했습니다.');
                    }
                } catch (err) {
                    console.error('삭제 중 오류:', err);
                    alert('서버 오류로 삭제에 실패했습니다.');
                }
            });


            wrapper.appendChild(deleteBtn);

            // iframe 생성
            const iframe = document.createElement('iframe');
            iframe.src = `https://grafana.luckyseven.live/d-solo/${panel.dashboardUid}?orgId=1&from=${panel.from}&to=${panel.now}&panelId=${panel.panelId}`;
            iframe.width = '450';
            iframe.height = '200';
            iframe.frameBorder = '0';
            iframe.className = 'grafana-iframe';

            wrapper.appendChild(iframe);
            container.appendChild(wrapper);
        });
    } catch (error) {
        console.error('iframe 로딩 오류:', error);
    }
}