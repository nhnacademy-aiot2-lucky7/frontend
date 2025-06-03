function getRandomColor(alpha = 0.7) {
    const r = Math.floor(Math.random()*256);
    const g = Math.floor(Math.random()*256);
    const b = Math.floor(Math.random()*256);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

$(document).ready(function() {
    const urlParams = new URLSearchParams(window.location.search);
    const dashboardId = parseInt(urlParams.get('id'));

    // 대시보드 제목 표시
    try {
        const storedDashboards = localStorage.getItem('dashboards');
        if (storedDashboards && dashboardId) {
            const dashboards = JSON.parse(storedDashboards);
            const dashboard = dashboards.find(d => d.id === dashboardId);
            if (dashboard) {
                $('.dashboard-title').text(dashboard.name + ' 대시보드');
            }
        }
    } catch (e) {
        console.error('localStorage 데이터 로드 중 오류:', e);
    }

    // Chart.js 인스턴스 및 패널별 설정 저장
    const chartInstances = {};
    const panelConfigs = {};

    // 4분할 패널 초기화
    initializeGridLayout();
    loadSavedLayout();

    // "+ 차트 추가" 클릭 이벤트
    $(document).on('click', '.empty-panel', function() {
        const panel = $(this).parent();
        const panelId = panel.data('panel-id');
        createChartPanel(panelId, panel);
    });

    // 패널 삭제
    $(document).on('click', '.remove-panel', function() {
        const panel = $(this).closest('.dashboard-panel');
        const panelId = panel.data('panel-id');
        panel.empty().append(`
            <div class="empty-panel" data-panel-id="${panelId}">
                <div class="empty-panel-text">+ 차트 추가</div>
            </div>
        `);
        if (chartInstances[panelId]) {
            chartInstances[panelId].destroy();
            delete chartInstances[panelId];
        }
        delete panelConfigs[panelId];
    });

    // 새로고침
    $(document).on('click', '.refresh-btn', async function() {
        const panel = $(this).closest('.dashboard-panel');
        const panelId = panel.data('panel-id');
        const config = panelConfigs[panelId];
        if (config) {
            const data = await fetchInfluxData(config);
            renderChart(panelId, data, config.label);
        }
    });

    // 시간 범위 변경
    $(document).on('change', '.time-range-select', async function() {
        const panel = $(this).closest('.dashboard-panel');
        const panelId = panel.data('panel-id');
        const config = panelConfigs[panelId];
        if (config) {
            let timeRange = $(this).val();
            config.timeRange = timeRange;
            const data = await fetchInfluxData(config);
            renderChart(panelId, data, config.label);
        }
    });

    // 차트 제목 클릭 시 인라인 수정
    $(document).on('click', '.panel-title', function() {
        const title = $(this);
        const currentText = title.text();
        const input = $(`<input type="text" class="panel-title-edit" value="${currentText}">`);
        title.replaceWith(input);
        input.focus();
        input.on('blur keypress', function(e) {
            if (e.type === 'blur' || (e.type === 'keypress' && e.which === 13)) {
                const newTitle = input.val().trim() || currentText;
                const newTitleElement = $(`<h3 class="panel-title" title="클릭하여 이름 변경">${newTitle}</h3>`);
                input.replaceWith(newTitleElement);
            }
        });
    });

    $(document).on('click', '.download-chart-btn', function() {
        const panelId = $(this).data('panel');
        const canvas = document.getElementById(`chart-panel-${panelId}`);
        if (!canvas) {
            alert('차트가 없습니다.');
            return;
        }

        // 저장 배경 흰색
        const ctx = canvas.getContext('2d');
        ctx.save();
        ctx.globalCompositeOperation = 'destination-over';
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();

        // 이미지 저장
        const url = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = url;
        link.download = `chart-panel-${panelId}.png`;
        link.click();
    });

    // 4분할 패널 생성 함수
    function initializeGridLayout() {
        $('#dashboard-grid').empty();
        for (let i = 1; i <= 4; i++) {
            $('#dashboard-grid').append(`
                <div class="dashboard-panel" data-panel-id="${i}">
                    <div class="empty-panel" data-panel-id="${i}">
                        <div class="empty-panel-text">+ 차트 추가</div>
                    </div>
                </div>
            `);
        }
    }

    // 차트 패널 생성 함수 (필드 선택 → 차트 생성)
    async function createChartPanel(panelId, panelElement) {
        // 1. 필드 목록 받아오기 (measurement는 환경에 맞게)
        const res = await fetch('/api/chart/fields?measurement=environment');
        const data = await res.json();
        const fields = data.fields;
        if (!fields || fields.length === 0) {
            alert('InfluxDB에 필드가 없습니다.');
            return;
        }

        // 2. 유저에게 필드 선택 (실제는 모달/드롭다운 추천, 예시는 prompt)
        const field = prompt('차트에 표시할 필드를 선택하세요: ' + fields.join(', '), fields[0]);
        if (!field) return;

        // 3. 데이터 받아오기 (기본 3h)
        const timeRange = 'last3h';
        panelConfigs[panelId] = {measurement: 'environment', field, timeRange, label: field};

        // 4. 패널 내용 초기화 및 차트 컨트롤/캔버스 추가
        panelElement.empty();
        panelElement.append(`
            <div class="panel-header">
                <h3 class="panel-title" title="클릭하여 이름 변경">${field} 차트</h3>
                <div class="panel-controls">
                    <button class="refresh-btn">새로고침</button>
                    <button class="download-chart-btn" data-panel="${panelId}">이미지 저장</button>
                    <select class="time-range-select">
                        <option value="last1h">최근 1시간</option>
                        <option value="last3h" selected>최근 3시간</option>
                        <option value="last6h">최근 6시간</option>
                        <option value="last12h">최근 12시간</option>
                        <option value="last24h">최근 24시간</option>
                        <option value="last7d">최근 7일</option>
                    </select>
                    <button class="remove-panel">X</button>
                </div>
            </div>
            <div class="panel-content">
                <canvas id="chart-panel-${panelId}"></canvas>
            </div>
        `);

        // 5. 차트 그리기
        renderChart(panelId, influxData, field);

        // 6. 패널 설정 저장(시간 범위/필드 등)
        panelConfigs[panelId] = {measurement: 'environment', field, timeRange, label: field};
    }

    // Chart.js 차트 생성 함수
    function renderChart(panelId, data, label = '센서값') {
        const ctx = document.getElementById(`chart-panel-${panelId}`).getContext('2d');
        if (chartInstances[panelId]) {
            chartInstances[panelId].destroy();
        }

        const borderColor = getRandomColor(0.9);
        const backgroundColor = getRandomColor(0.2);

        chartInstances[panelId] = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: label,
                    data: data.map(d => ({
                        x: d.time,      // 반드시 x, y 구조로!
                        y: d.value
                    })),
                    borderColor: borderColor,
                    backgroundColor: backgroundColor,
                    fill: true,
                    tension: 0.3,
                    pointRadius: 2,
                    pointHoverRadius: 4,
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: true },
                    tooltip: { enabled: true }
                },
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            tooltipFormat: 'yyyy-MM-dd HH:mm',
                            displayFormats: {
                                hour: 'yyyy-MM-dd HH:mm',
                                minute: 'yyyy-MM-dd HH:mm'
                            }
                        },
                        ticks: {
                            autoSkip: true,
                            maxTicksLimit: 8,
                            maxRotation: 40,
                            minRotation: 20,
                            color: '#555',
                            font: { size: 10 }
                            // callback 필요 없음, time scale이 자동 포맷
                        },
                        grid: { color: '#eee' }
                    },
                    y: {
                        title: { display: true, text: label, font: { size: 14, weight: 'bold' } },
                        ticks: { color: '#555', font: { size: 12 } },
                        grid: { color: '#eee' }
                    }
                },
                elements: {
                    point: {
                        radius: 2,
                        hoverRadius: 4
                    }
                }
            }
        });
    }

    // InfluxDB 데이터 fetch 함수 (백엔드 API 필요)
    async function fetchInfluxData({measurement, field, timeRange = 'last24h'}) {
        // Flux 쿼리에는 '3h', '1h', '24h'만 허용
        const fluxTimeRange = timeRange.replace('last', ''); // 'last3h' → '3h'
        const res = await fetch(`/api/chart/data?measurement=${measurement}&field=${field}&timeRange=${fluxTimeRange}`);
        return await res.json();
    }

    // 레이아웃 저장
    $('#save-layout').on('click', function() {
        const layout = [];
        $('.dashboard-panel').each(function() {
            const panelId = $(this).data('panel-id');
            if (panelConfigs[panelId]) {
                const title = $(this).find('.panel-title').text();
                layout.push({
                    panelId,
                    ...panelConfigs[panelId],
                    title
                });
            } else {
                // 차트가 없는 패널도 저장 (빈 패널임을 표시)
                layout.push({
                    panelId,
                    empty: true
                });
            }
        });
        localStorage.setItem('dashboardLayout-' + dashboardId, JSON.stringify(layout));
        alert('레이아웃이 저장되었습니다.');
    });

    function loadSavedLayout() {
        const savedLayout = localStorage.getItem('dashboardLayout-' + dashboardId);
        if (savedLayout) {
            const layout = JSON.parse(savedLayout);
            $('#dashboard-grid').empty();
            for (let i = 1; i <= 4; i++) {
                const panelConfig = layout.find(l => l.panelId == i);
                if (panelConfig && !panelConfig.empty) {
                    // 차트 있는 패널 복원
                    $('#dashboard-grid').append(`<div class="dashboard-panel" data-panel-id="${i}"></div>`);
                    const panel = $(`.dashboard-panel[data-panel-id="${i}"]`);
                    panelConfigs[i] = {
                        measurement: panelConfig.measurement,
                        field: panelConfig.field,
                        timeRange: panelConfig.timeRange,
                        label: panelConfig.label
                    };
                    panel.empty();
                    panel.append(`
                    <div class="panel-header">
                        <h3 class="panel-title" title="클릭하여 이름 변경">${panelConfig.title || panelConfig.field + ' 차트'}</h3>
                        <div class="panel-controls">
                            <button class="refresh-btn">새로고침</button>
                            <button class="download-chart-btn" data-panel="${i}">이미지 저장</button>
                            <select class="time-range-select">
                                <option value="last1h"${panelConfig.timeRange === 'last1h' ? ' selected' : ''}>최근 1시간</option>
                                <option value="last3h"${panelConfig.timeRange === 'last3h' ? ' selected' : ''}>최근 3시간</option>
                                <option value="last6h"${panelConfig.timeRange === 'last6h' ? ' selected' : ''}>최근 6시간</option>
                                <option value="last12h"${panelConfig.timeRange === 'last12h' ? ' selected' : ''}>최근 12시간</option>
                                <option value="last24h"${panelConfig.timeRange === 'last24h' ? ' selected' : ''}>최근 24시간</option>
                                <option value="last7d"${panelConfig.timeRange === 'last7d' ? ' selected' : ''}>최근 7일</option>
                            </select>
                            <button class="remove-panel">X</button>
                        </div>
                    </div>
                    <div class="panel-content">
                        <canvas id="chart-panel-${i}"></canvas>
                    </div>
                `);
                    // 차트 그리기
                    fetchInfluxData(panelConfigs[i]).then(data => {
                        renderChart(i, data, panelConfig.label);
                    });
                } else {
                    // 차트 없는(빈) 패널 복원
                    $('#dashboard-grid').append(`
                    <div class="dashboard-panel" data-panel-id="${i}">
                        <div class="empty-panel" data-panel-id="${i}">
                            <div class="empty-panel-text">+ 차트 추가</div>
                        </div>
                    </div>
                `);
                }
            }
        }
    }
});
