$(document).ready(function() {
    // URL에서 대시보드 ID 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const dashboardId = parseInt(urlParams.get('id'));

    // 대시보드 데이터 로드
    try {
        const storedDashboards = localStorage.getItem('dashboards');
        if (storedDashboards && dashboardId) {
            const dashboards = JSON.parse(storedDashboards);
            const dashboard = dashboards.find(d => d.id === dashboardId);
            if (dashboard) {
                // 대시보드 제목 업데이트
                $('.dashboard-title').text(dashboard.name + ' 대시보드');
            }
        }
    } catch (e) {
        console.error('localStorage 데이터 로드 중 오류:', e);
    }

    // 그리드 레이아웃 초기화
    initializeGridLayout();

    // 저장된 레이아웃 불러오기
    loadSavedLayout();

    // 차트 추가 버튼 클릭 이벤트
    $('#add-dashboard').on('click', function() {
        // 빈 패널 찾기
        const emptyPanel = $('.empty-panel').first();
        if (emptyPanel.length > 0) {
            const panelId = emptyPanel.parent().data('panel-id');
            createChartPanel(panelId, emptyPanel.parent());
        } else {
            alert('모든 패널에 차트가 추가되었습니다.');
        }
    });

    // 레이아웃 저장 버튼
    $('#save-layout').on('click', function() {
        const layout = [];
        $('.dashboard-panel').each(function() {
            const panel = $(this);
            const iframe = panel.find('iframe');

            if (iframe.length > 0) {
                layout.push({
                    id: panel.data('panel-id'),
                    src: iframe.attr('src'),
                    title: panel.find('.panel-title').text()
                });
            }
        });

        // 레이아웃 정보를 로컬 스토리지에 저장
        localStorage.setItem('dashboardLayout-' + dashboardId, JSON.stringify(layout));
        alert('레이아웃이 저장되었습니다.');
    });

    // 패널 삭제 이벤트
    $(document).on('click', '.remove-panel', function() {
        const panel = $(this).closest('.dashboard-panel');
        const panelId = panel.data('panel-id');

        // 패널 내용을 비우고 빈 패널로 변경
        panel.empty();
        panel.append(`
            <div class="empty-panel" data-panel-id="${panelId}">
                <div class="empty-panel-text">+ 차트 추가</div>
            </div>
        `);
    });

    // 빈 패널 클릭 이벤트
    $(document).on('click', '.empty-panel', function() {
        const panel = $(this).parent();
        const panelId = panel.data('panel-id');
        createChartPanel(panelId, panel);
    });

    // 새로고침 버튼 이벤트
    $(document).on('click', '.refresh-btn', function() {
        const iframe = $(this).closest('.dashboard-panel').find('iframe');
        iframe.attr('src', iframe.attr('src'));
    });

    // 시간 범위 변경 이벤트
    $(document).on('change', '.time-range-select', function() {
        const iframe = $(this).closest('.dashboard-panel').find('iframe');
        let timeRange = '';

        switch($(this).val()) {
            case 'last1h':
                timeRange = '&from=now-1h&to=now';
                break;
            case 'last6h':
                timeRange = '&from=now-6h&to=now';
                break;
            case 'last24h':
                timeRange = '&from=now-24h&to=now';
                break;
            case 'last7d':
                timeRange = '&from=now-7d&to=now';
                break;
        }

        let currentSrc = iframe.attr('src');
        currentSrc = currentSrc.replace(/&from=[^&]*&to=[^&]*/, '');

        if (currentSrc.includes('?')) {
            iframe.attr('src', currentSrc + timeRange);
        } else {
            iframe.attr('src', currentSrc + '?' + timeRange.substring(1));
        }
    });

    // 그리드 레이아웃 초기화 함수
    function initializeGridLayout() {
        // 기존 패널 제거
        $('#dashboard-grid').empty();

        // 4개의 빈 패널 생성
        for (let i = 1; i <= 4; i++) {
            $('#dashboard-grid').append(`
                <div class="dashboard-panel" data-panel-id="${i}">
                    <div class="empty-panel">
                        <div class="empty-panel-text">+ 차트 추가</div>
                    </div>
                </div>
            `);
        }
    }

    // 차트 패널 생성 함수
    function createChartPanel(panelId, panelElement) {
        panelElement.empty();
        panelElement.append(`
            <div class="panel-header">
                <h3 class="panel-title" title="클릭하여 이름 변경">차트 ${panelId}</h3>
                <div class="panel-controls">
                    <button class="refresh-btn">새로고침</button>
                    <select class="time-range-select">
                        <option value="last1h">최근 1시간</option>
                        <option value="last6h">최근 6시간</option>
                        <option value="last24h" selected>최근 24시간</option>
                        <option value="last7d">최근 7일</option>
                    </select>
                    <button class="remove-panel">X</button>
                </div>
            </div>
            <div class="panel-content">
                <iframe src="https://grafana.luckyseven.live/d-solo/3Ly2rMxNk/iot1?orgId=1&panelId=${panelId-1}" 
                        class="grafana-frame" allowfullscreen></iframe>
            </div>
        `);
    }

    // 저장된 레이아웃 불러오기 함수
    function loadSavedLayout() {
        const savedLayout = localStorage.getItem('dashboardLayout-' + dashboardId);
        if (savedLayout) {
            const layout = JSON.parse(savedLayout);

            // 저장된 레이아웃으로 패널 생성
            layout.forEach(panel => {
                const panelElement = $(`.dashboard-panel[data-panel-id="${panel.id}"]`);
                if (panelElement.length > 0) {
                    panelElement.empty();
                    panelElement.append(`
                        <div class="panel-header">
                            <h3 class="panel-title">${panel.title}</h3>
                            <div class="panel-controls">
                                <button class="refresh-btn">새로고침</button>
                                <select class="time-range-select">
                                    <option value="last1h">최근 1시간</option>
                                    <option value="last6h">최근 6시간</option>
                                    <option value="last24h" selected>최근 24시간</option>
                                    <option value="last7d">최근 7일</option>
                                </select>
                                <button class="remove-panel">X</button>
                            </div>
                        </div>
                        <div class="panel-content">
                            <iframe src="${panel.src}" class="grafana-frame" allowfullscreen></iframe>
                        </div>
                    `);
                }
            });
        }
    }

    // 차트 제목 변경 기능 추가
    $(document).on('click', '.panel-title', function() {
        const title = $(this);
        const currentText = title.text();
        const input = $(`<input type="text" class="panel-title-edit" value="${currentText}">`);

        // 제목을 입력 필드로 교체
        title.replaceWith(input);
        input.focus();

        // 입력 완료 시
        input.on('blur keypress', function(e) {
            if (e.type === 'blur' || (e.type === 'keypress' && e.which === 13)) {
                const newTitle = input.val().trim() || currentText;
                const newTitleElement = $(`<h3 class="panel-title" title="클릭하여 이름 변경">${newTitle}</h3>`);
                input.replaceWith(newTitleElement);
            }
        });
    });
});
