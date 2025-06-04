document.addEventListener('DOMContentLoaded', () => {
    const notificationList = document.getElementById("notification-list");
    const unreadTab = document.getElementById("tab-unread");
    const readTab = document.getElementById("tab-read");
    const unreadCountSpan = document.getElementById("unread-count");
    const deleteReadBtn = document.getElementById("deleteReadBtn");

    let isRead = false;

    async function fetchNotifications() {
        const response = await fetch(`http://localhost:10232/notifications?isRead=${isRead}&size=10`, {
            method: 'GET',
            credentials: 'include'
        });
        const data = await response.json();
        return data.content || [];
    }

    async function fetchUnreadCount() {
        const response = await fetch(`http://localhost:10232/notifications/unread-count`, {
            method: 'GET',
            credentials: 'include'
        });
        const count = await response.json();
        unreadCountSpan.textContent = count;
    }

    async function markAsRead(notificationNo) {
        await fetch(`http://localhost:10232/notifications/${notificationNo}`, {
            method: 'GET',
            credentials: 'include'
        }); // GET 호출로 읽음 처리
        renderList();
    }

    async function deleteReadNotifications() {
        await fetch(`http://localhost:10232/notifications/read`, {
            method: 'DELETE',
            credentials: 'include'
        });
        if (isRead) {
            renderList();
        }
        fetchUnreadCount();
    }

    function formatDateTime(dateTimeStr) {
        const dt = new Date(dateTimeStr);
        return dt.toLocaleString('ko-KR');
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

        fetchUnreadCount();
    }

    unreadTab.onclick = () => {
        isRead = false;
        unreadTab.classList.add("active");
        readTab.classList.remove("active");
        renderList();
    };

    readTab.onclick = () => {
        isRead = true;
        readTab.classList.add("active");
        unreadTab.classList.remove("active");
        renderList();
    };

    deleteReadBtn.onclick = () => {
        deleteReadNotifications();
    };

    renderList();
});
