document.addEventListener('DOMContentLoaded', () => {
    const dashboardUid = document.getElementById('panelList').dataset.dashboardUid;
    loadIframes(dashboardUid);
});

async function loadIframes(dashboardUid) {
    try {
        const endpoint = `https://luckyseven.live/api/panels/${dashboardUid}`;

        const res = await fetch(endpoint);
        if (!res.ok) throw new Error('패널 정보를 불러오지 못했습니다.');

        const panels = await res.json();
        const container = document.getElementById('panelList');
        container.innerHTML = ''; // 초기화

        console.log('패널 목록:', panels);

        panels.forEach(panel => {
            const wrapper = document.createElement('div');
            wrapper.className = 'panel-card';

            // 제목
            const title = document.createElement('h3');
            title.textContent = panel.dashboardTitle || '제목 없음';
            title.className = 'panel-title';
            wrapper.appendChild(title);

            // 수정 버튼 (a 태그)
            const editBtn = document.createElement('a');
            editBtn.textContent = '차트 수정';
            editBtn.className = 'edit-button';
            editBtn.href = `/panel/edit?dashboardUid=${panel.dashboardUid}&panelId=${panel.panelId}`;
            wrapper.appendChild(editBtn);

            // 삭제 버튼
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '삭제';
            deleteBtn.className = 'delete-button';
            deleteBtn.addEventListener('click', async () => await handleDelete(panel, wrapper));
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
        alert('패널을 불러오는 중 오류가 발생했습니다.');
    }
}

// ✅ 삭제 기능만 따로 분리
async function handleDelete(panel, wrapper) {
    console.log('삭제 시도 panel:', panel);

    const confirmed = confirm(`"${panel.dashboardTitle || '제목 없음'}" 패널을 삭제하시겠습니까?`);
    if (!confirmed) return;

    const deleteRequest = {
        dashboardUid: panel.dashboardUid,
        panelId: panel.panelId
    };

    try {
        const res = await fetch("https://luckyseven.live/api/panels", {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(deleteRequest)
        });

        if (res.status === 204) {
            wrapper.remove();
            alert(`${panel.dashboardTitle || '제목 없음'} 패널이 삭제되었습니다.`);
        } else {
            alert('패널 삭제에 실패했습니다. 다시 시도해주세요.');
        }
    } catch (err) {
        console.error('삭제 중 오류:', err);
        alert('서버 오류로 삭제에 실패했습니다.');
    }
}
