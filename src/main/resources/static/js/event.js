const pageSize = 10;
let currentPage = 0;

const loadingIndicator = document.getElementById('loading-indicator');
const errorMessageEl = document.getElementById('error-message');
const detailModalEl = document.getElementById('detail-modal');
const detailModal = new bootstrap.Modal(detailModalEl);

function formatDateTime(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleString('ko-KR', {hour12: false});
}

function showLoading(show) {
    loadingIndicator.classList.toggle('d-none', !show);
}

function showError(msg) {
    if (!msg) {
        errorMessageEl.classList.add('d-none');
        errorMessageEl.textContent = '';
        return;
    }
    errorMessageEl.textContent = msg;
    errorMessageEl.classList.remove('d-none');
    setTimeout(() => {
        errorMessageEl.classList.add('d-none');
        errorMessageEl.textContent = '';
    }, 4000);
}

function getFormValues() {
    const form = document.getElementById('search-form');
    const formData = new FormData(form);
    const levels = formData.getAll('eventLevels');
    return {
        keyword: formData.get('keyword')?.trim() || null,
        startAt: formData.get('startAt') ? new Date(formData.get('startAt')).toISOString() : null,
        endAt: formData.get('endAt') ? new Date(formData.get('endAt')).toISOString() : null,
        eventLevels: levels.length ? levels : null,
    };
}

function renderTable(events) {
    const tbody = document.getElementById('table-body');
    if (!events || events.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="py-5 text-muted fst-italic">이벤트 내역이 없습니다.</td></tr>`;
        return;
    }

    tbody.innerHTML = events.map(e => {
        const levelClass = {
            INFO: 'text-info',
            WARN: 'text-warning',
            ERROR: 'text-danger',
        }[e.eventLevel] || '';

        return `
      <tr data-event-no="${e.eventNo}">
        <td class="${levelClass}">${e.eventLevel}</td>
        <td>${e.eventSource?.sourceId || ''}</td>
        <td class="text-start">${e.eventDetails}</td>
        <td>${formatDateTime(e.eventAt)}</td>
      </tr>`;
    }).join('');

    tbody.querySelectorAll('tr').forEach(tr => {
        tr.onclick = () => fetchEventDetail(tr.dataset.eventNo);
    });
}

function renderPagination(totalPages, current) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    if (totalPages <= 1) return;

    // 이전 버튼
    const prevLi = document.createElement('li');
    prevLi.className = 'page-item' + (current === 0 ? ' disabled' : '');
    const prevBtn = document.createElement('button');
    prevBtn.className = 'page-link';
    prevBtn.textContent = '이전';
    prevBtn.disabled = current === 0;
    prevBtn.onclick = () => loadPage(current - 1);
    prevLi.appendChild(prevBtn);
    pagination.appendChild(prevLi);

    // 페이지 번호 (최대 7개)
    const maxPagesToShow = 7;
    let startPage = Math.max(0, current - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;
    if (endPage >= totalPages) {
        endPage = totalPages - 1;
        startPage = Math.max(0, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        const li = document.createElement('li');
        li.className = 'page-item' + (i === current ? ' active' : '');
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'page-link';
        btn.textContent = i + 1;
        btn.disabled = i === current;
        btn.onclick = () => loadPage(i);
        li.appendChild(btn);
        pagination.appendChild(li);
    }

    // 다음 버튼
    const nextLi = document.createElement('li');
    nextLi.className = 'page-item' + (current === totalPages - 1 ? ' disabled' : '');
    const nextBtn = document.createElement('button');
    nextBtn.className = 'page-link';
    nextBtn.textContent = '다음';
    nextBtn.disabled = current === totalPages - 1;
    nextBtn.onclick = () => loadPage(current + 1);
    nextLi.appendChild(nextBtn);
    pagination.appendChild(nextLi);
}

async function loadPage(page, fromPopState = false) {
    const body = getFormValues();
    currentPage = page;
    showError(null);
    showLoading(true);

    if (!fromPopState) {
        const url = new URL(window.location);
        url.searchParams.set('page', page);
        if (body.keyword) url.searchParams.set('keyword', body.keyword);
        else url.searchParams.delete('keyword');
        if (body.startAt) url.searchParams.set('startAt', body.startAt.split('T')[0]);
        else url.searchParams.delete('startAt');
        if (body.endAt) url.searchParams.set('endAt', body.endAt.split('T')[0]);
        else url.searchParams.delete('endAt');

        url.searchParams.delete('eventLevels');
        if (body.eventLevels) {
            body.eventLevels.forEach(level => url.searchParams.append('eventLevels', level));
        }

        history.pushState({page, body}, '', url.toString());
    }

    try {
        const res = await fetch(`https://luckyseven.live/api/events/search?page=${page}&size=${pageSize}`, {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error('서버 오류');
        const data = await res.json();
        renderTable(data.content);
        renderPagination(data.totalPages, data.number);
    } catch {
        showError('이벤트 목록 불러오기 실패');
    } finally {
        showLoading(false);
    }
}

async function fetchEventDetail(eventNo) {
    if (!eventNo) return;
    showLoading(true);
    showError(null);

    try {
        const res = await fetch(`https://luckyseven.live/api/events/${eventNo}`, {credentials: 'include'});
        if (!res.ok) throw new Error('이벤트 상세 불러오기 실패');
        const e = await res.json();
        showDetailModal(e);
    } catch {
        showError('이벤트 상세 조회 실패');
    } finally {
        showLoading(false);
    }
}

function showDetailModal(event) {
    document.getElementById('detail-eventNo').textContent = event.eventNo || '-';
    document.getElementById('detail-departmentId').textContent = event.departmentId || '-';
    document.getElementById('detail-eventLevel').textContent = event.eventLevel || '-';
    document.getElementById('detail-eventAt').textContent = formatDateTime(event.eventAt) || '-';
    document.getElementById('detail-eventDetails').textContent = event.eventDetails || '-';
    document.getElementById('detail-sourceId').textContent = event.eventSource?.sourceId || '-';
    document.getElementById('detail-sourceType').textContent = event.eventSource?.sourceType || '-';

    detailModal.show();
}

document.getElementById('search-form').addEventListener('submit', e => {
    e.preventDefault();
    loadPage(0);
});

// 페이지 진입 시 URL 쿼리 파라미터를 폼에 세팅 후 로드
function loadFromURL() {
    const url = new URL(window.location);
    const keyword = url.searchParams.get('keyword');
    const startAt = url.searchParams.get('startAt');
    const endAt = url.searchParams.get('endAt');
    const levels = url.searchParams.getAll('eventLevels');
    const page = parseInt(url.searchParams.get('page') || '0', 10);

    const form = document.getElementById('search-form');
    if (keyword) form.keyword.value = keyword;
    if (startAt) form.startAt.value = startAt;
    if (endAt) form.endAt.value = endAt;

    document.querySelectorAll('.level-checkbox').forEach(cb => {
        cb.checked = levels.includes(cb.value);
    });

    loadPage(page, true);
}

window.addEventListener('popstate', e => {
    if (e.state) {
        const {page, body} = e.state;
        const form = document.getElementById('search-form');

        form.keyword.value = body.keyword || '';
        form.startAt.value = body.startAt ? body.startAt.split('T')[0] : '';
        form.endAt.value = body.endAt ? body.endAt.split('T')[0] : '';

        document.querySelectorAll('.level-checkbox').forEach(cb => {
            cb.checked = body.eventLevels?.includes(cb.value) || false;
        });

        loadPage(page, true);
    }
});

loadFromURL();
