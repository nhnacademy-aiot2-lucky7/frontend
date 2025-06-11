function updateClock() {
    const now = new Date();
    const formatted = now.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
    const clockElement = document.getElementById('clock');
    if (clockElement) {
        clockElement.textContent = formatted;
    }
}

setInterval(updateClock, 1000);
updateClock();
