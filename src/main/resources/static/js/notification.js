document.addEventListener('DOMContentLoaded', () => {
    const notificationList = document.getElementById("notification-list");
    const unreadTab = document.getElementById("tab-unread");
    const readTab = document.getElementById("tab-read");
    const unreadCountSpan = document.getElementById("unread-count");
    const deleteReadBtn = document.getElementById("deleteReadBtn");

    let isRead = false;
    let page = 0;
    let totalPages = 1;

    async function fetchNotifications() {
        const endpoint = isRead ? 'read' : 'unread';
        const response = await fetch(`https://luckyseven.live/api/notifications/${endpoint}?size=10&page=${page}`, {
            method: 'GET',
            credentials: 'include'
        });
        const data = await response.json();
        totalPages = data.totalPages || 1;
        return data.content || [];
    }

    async function fetchUnreadCount() {
        const response = await fetch(`https://luckyseven.live/api/notifications/unread-count`, {
            method: 'GET',
            credentials: 'include'
        });
        const count = await response.json();
        unreadCountSpan.textContent = count;
    }

    async function markAsRead(notificationNo) {
        await fetch(`https://luckyseven.live/api/notifications/${notificationNo}`, {
            method: 'GET',
            credentials: 'include'
        });
        renderList();
    }

    async function deleteReadNotifications() {
        await fetch(`https://luckyseven.live/api/notifications/read`, {
            method: 'DELETE',
            credentials: 'include'
        });
        if (isRead) {
            page = 0;
            renderList();
        }
        fetchUnreadCount();
    }

    function formatDateTime(dateTimeStr) {
        const dt = new Date(dateTimeStr);
        return dt.toLocaleString('ko-KR');
    }

    function renderPagination() {
        const paginationContainer = document.getElementById("pagination");
        paginationContainer.innerHTML = "";

        const prevBtn = document.createElement("button");
        prevBtn.textContent = "이전";
        prevBtn.disabled = page === 0;
        prevBtn.onclick = () => {
            if (page > 0) {
                page--;
                renderList();
            }
        };

        const nextBtn = document.createElement("button");
        nextBtn.textContent = "다음";
        nextBtn.disabled = page >= totalPages - 1;
        nextBtn.onclick = () => {
            if (page < totalPages - 1) {
                page++;
                renderList();
            }
        };

        const pageInfo = document.createElement("span");
        pageInfo.textContent = ` ${page + 1} / ${totalPages} 페이지 `;

        paginationContainer.appendChild(prevBtn);
        paginationContainer.appendChild(pageInfo);
        paginationContainer.appendChild(nextBtn);
    }

    async function renderList() {
        const notifications = await fetchNotifications();

        notificationList.innerHTML = "";

        notifications.forEach(n => {
            const li = document.createElement("li");
            li.className = `notification ${isRead ? '' : 'unread'}`;
            li.innerHTML = `
                <div class="header">
                    <div>${n.eventDetails}</div>
                    <div class="meta">${n.eventLevel}</div>
                </div>
                <div class="meta">
                    발생 시각: ${formatDateTime(n.eventAt)}<br>
                    부서: ${n.departmentId}<br>
                    소스: ${n.eventSource.sourceType} (${n.eventSource.sourceId})
                </div>
            `;
            li.onclick = () => markAsRead(n.notificationNo);
            notificationList.appendChild(li);
        });

        renderPagination();
        fetchUnreadCount();
    }

    unreadTab.onclick = () => {
        isRead = false;
        page = 0;
        unreadTab.classList.add("active");
        readTab.classList.remove("active");
        renderList();
    };

    readTab.onclick = () => {
        isRead = true;
        page = 0;
        readTab.classList.add("active");
        unreadTab.classList.remove("active");
        renderList();
    };

    deleteReadBtn.onclick = () => {
        deleteReadNotifications();
    };

    renderList();
});
