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

            // ✅ 비율 유지용 div 생성 (16:9 비율 유지)
            const aspectBox = document.createElement('div');
            aspectBox.className = 'aspect-ratio-box';

            // iframe 생성
            const iframe = document.createElement('iframe');
            iframe.src = `https://grafana.luckyseven.live/d-solo/${panel.dashboardUid}?orgId=1&from=${panel.from}&to=${panel.now}&panelId=${panel.panelId}&theme=light`;
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.frameBorder = '0';
            iframe.className = 'grafana-iframe';

            wrapper.appendChild(iframe);
            // makeResizableAndDraggable(wrapper, iframe);
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

// function makeResizableAndDraggable(wrapper, iframe) {
//     const resizer = document.createElement('div');
//     resizer.className = 'resizer';
//     wrapper.appendChild(resizer);
//
//     const dragHandle = document.createElement('div');
//     dragHandle.className = 'drag-handle';
//     dragHandle.textContent = '☰ 이동';
//     wrapper.prepend(dragHandle);
//
//     // 크기 조절
//     resizer.addEventListener('mousedown', initResize);
//
//     function initResize(e) {
//         e.preventDefault();
//         window.addEventListener('mousemove', resize);
//         window.addEventListener('mouseup', stopResize);
//     }
//
//     function resize(e) {
//         const rect = wrapper.getBoundingClientRect();
//         wrapper.style.width = `${e.clientX - rect.left}px`;
//         wrapper.style.height = `${e.clientY - rect.top}px`;
//         iframe.style.width = '100%';
//         iframe.style.height = '100%';
//     }
//
//     function stopResize() {
//         window.removeEventListener('mousemove', resize);
//         window.removeEventListener('mouseup', stopResize);
//     }
//
//     // 드래그
//     let offsetX = 0, offsetY = 0;
//     const container = document.getElementById('panelList');
//
//     dragHandle.addEventListener('mousedown', e => {
//         const rect = wrapper.getBoundingClientRect();
//         offsetX = e.clientX - rect.left;
//         offsetY = e.clientY - rect.top;
//
//         document.addEventListener('mousemove', drag);
//         document.addEventListener('mouseup', stopDrag);
//     });
//
//     function drag(e) {
//         const containerRect = container.getBoundingClientRect();
//
//         let newLeft = e.clientX - containerRect.left - offsetX;
//         let newTop = e.clientY - containerRect.top - offsetY;
//
//         // 이동 제한 (0 ~ 최대값)
//         const maxLeft = container.clientWidth - wrapper.offsetWidth;
//         const maxTop = container.clientHeight - wrapper.offsetHeight;
//
//         // maxLeft, maxTop가 음수가 될 경우 대비
//         const boundedLeft = Math.min(Math.max(0, newLeft), Math.max(0, maxLeft));
//         const boundedTop = Math.min(Math.max(0, newTop), Math.max(0, maxTop));
//
//         wrapper.style.left = `${boundedLeft}px`;
//         wrapper.style.top = `${boundedTop}px`;
//     }
//
//     function stopDrag() {
//         document.removeEventListener('mousemove', drag);
//         document.removeEventListener('mouseup', stopDrag);
//     }
// }


