document.addEventListener('DOMContentLoaded', async () => {
    const dashboardUid = document.getElementById('panelList').dataset.dashboardUid;
    await loadIframes(dashboardUid);
});

async function loadIframes(dashboardUid) {
    try {
        const endpoint = `https://luckyseven.live/api/panels/${dashboardUid}`;
        const res = await fetch(endpoint);
        if (!res.ok) throw new Error('패널 정보를 불러오지 못했습니다.');

        const panels = await res.json();
        const container = document.getElementById('panelList');
        container.innerHTML = '';

        console.log('패널 목록:', panels);

        panels.forEach(panel => {
            const card = createPanelCard(panel);
            container.appendChild(card);
        });

    } catch (error) {
        console.error('iframe 로딩 오류:', error);
        alert('패널을 불러오는 중 오류가 발생했습니다.');
    }
}

function createPanelCard(panel) {
    const wrapper = document.createElement('div');
    wrapper.className = 'panel-card';

    const startMatch = panel.query.match(/range\(start:\s*([^)]+)\)/);
    let start = startMatch ? startMatch[1].trim() : '-12h';

    const iframe = document.createElement('iframe');
    iframe.src = `https://grafana.luckyseven.live/d-solo/${panel.dashboardUid}?orgId=1&from=now${start}&to=${panel.now}&panelId=${panel.panelId}&transparent=1&refresh=1m`;
    iframe.className = 'grafana-iframe';
    wrapper.appendChild(iframe);

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'iframe-button-container';

    // 수정 버튼
    const editBtn = document.createElement('a');
    editBtn.href = `/panel/edit?dashboardUid=${panel.dashboardUid}&panelId=${panel.panelId}`;
    const editImg = document.createElement('img');
    editImg.src = '/img/icons/icon-edit-button.png';
    editImg.alt = '수정';
    editImg.classList.add('icon-img', 'icon-edit-img');  // 공통 + 수정용 클래스 적용
    editBtn.appendChild(editImg);
    buttonContainer.appendChild(editBtn);

    // 삭제 버튼
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    const deleteImg = document.createElement('img');
    deleteImg.src = '/img/icons/icon-cancel.png';
    deleteImg.alt = '삭제';
    deleteImg.classList.add('icon-img', 'icon-delete-img'); // 공통 + 삭제용 클래스 적용
    deleteBtn.appendChild(deleteImg);

    deleteBtn.addEventListener('click', async () => await handleDelete(panel, wrapper));
    buttonContainer.appendChild(deleteBtn);

    wrapper.appendChild(buttonContainer);

    return wrapper;
}

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
