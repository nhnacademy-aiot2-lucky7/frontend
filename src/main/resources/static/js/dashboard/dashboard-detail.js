document.addEventListener('DOMContentLoaded', function () {
    // 먼저 localStorage에서 최신 대시보드 데이터 로드
    try {
        const storedDashboards = localStorage.getItem('dashboards');
        if (storedDashboards) {
            dashboards = JSON.parse(storedDashboards);
        }

        const storedCharts = localStorage.getItem('charts');
        if (storedCharts) {
            charts = JSON.parse(storedCharts);
        }
    } catch (e) {
        console.error('localStorage 데이터 로드 중 오류:', e);
    }

    // URL에서 대시보드 ID 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const dashboardId = parseInt(urlParams.get('id'));

    if (!dashboardId) {
        alert('대시보드 ID가 유효하지 않습니다.');
        window.location.href = '/dashboard-info';
        return;
    }

    // 대시보드 찾기
    const dashboard = dashboards.find(d => d.id === dashboardId);
    if (!dashboard) {
        alert('대시보드를 찾을 수 없습니다.');
        window.location.href = '/dashboard-info';
        return;
    }

    // // 관리자 권한 확인 및 로그 버튼 표시
    // const adminLogSection = document.getElementById('adminLogSection');
    // const viewLogBtn = document.getElementById('viewLogBtn');
    //
    // // currentUser 객체가 있고 role이 'ADMIN'인 경우에만 로그 버튼 표시
    // if (typeof currentUser !== 'undefined' && currentUser && currentUser.role === 'ADMIN') {
    //     adminLogSection.style.display = 'flex';
    //
    //     // 로그 버튼 클릭 이벤트
    //     viewLogBtn.addEventListener('click', function() {
    //         // 로그 페이지로 이동 또는 로그 모달 표시
    //         window.location.href = `/dashboard-logs?id=${dashboardId}`;
    //     });
    // }

    // 대시보드 정보 표시
    document.getElementById('pageTitle').textContent = `${dashboard.name} 대시보드 상세 내역`;
    document.getElementById('dashboardName').textContent = dashboard.name;
    document.getElementById('dashboardDescription').textContent = dashboard.description;
    document.getElementById('chartCount').textContent = dashboard.chartCount;
    document.getElementById('dashboardStatus').textContent = dashboard.active ? '활성화' : '비활성화';
    document.getElementById('createdAt').textContent = formatDate(dashboard.createdAt);
    document.getElementById('updatedAt').textContent = formatDate(dashboard.updatedAt);

    // 차트 목록 가져오기
    let dashboardCharts = charts.filter(c => c.dashboardId === dashboardId);

    // 차트 섹션 표시 여부
    const chartsSection = document.getElementById('chartsSection');
    chartsSection.style.display = dashboardCharts.length > 0 ? 'block' : 'none';

    // 차트 표시
    const chartContainer = document.getElementById('chartContainer');

    function renderCharts() {
        chartContainer.innerHTML = '';

        // 차트 순서대로 정렬
        dashboardCharts.sort((a, b) => a.displayOrder - b.displayOrder);

        dashboardCharts.forEach(chart => {
            const chartItem = document.createElement('div');
            chartItem.className = 'chart-item';
            chartItem.setAttribute('data-id', chart.id);

            chartItem.innerHTML = `
                <div class="chart-header">
                    <div class="chart-title">
                        <input type="text" class="chart-title-edit" value="${chart.name}" />
                    </div>
                    <div class="chart-controls">
                        <span class="display-text">메인페이지에 표시</span>
                        <button class="toggle-btn">${chart.displayOnMain ? 'On' : 'Off'}</button>
                        <button class="remove-chart-btn">삭제</button>
                    </div>
                </div>
                <div class="chart-content">
                    <div style="text-align: center; color: #999;">
                        ${chart.type} 유형의 차트가 여기에 표시됩니다.
                    </div>
                </div>
            `;

            chartContainer.appendChild(chartItem);

            // 차트 제목 편집 이벤트
            const titleEdit = chartItem.querySelector('.chart-title-edit');
            titleEdit.addEventListener('blur', function () {
                const chartId = parseInt(chartItem.getAttribute('data-id'));
                const chartObj = dashboardCharts.find(c => c.id === chartId);
                if (chartObj) {
                    chartObj.name = this.value;
                    // localStorage 업데이트
                    localStorage.setItem('charts', JSON.stringify(charts));
                }
            });

            // 토글 버튼 이벤트
            const toggleBtn = chartItem.querySelector('.toggle-btn');
            toggleBtn.addEventListener('click', function () {
                const chartId = parseInt(chartItem.getAttribute('data-id'));
                const chartObj = dashboardCharts.find(c => c.id === chartId);
                if (chartObj) {
                    chartObj.displayOnMain = !chartObj.displayOnMain;
                    this.textContent = chartObj.displayOnMain ? 'On' : 'Off';

                    // 클래스 토글 추가
                    if (chartObj.displayOnMain) {
                        this.classList.remove('off');
                    } else {
                        this.classList.add('off');
                    }

                    // localStorage 업데이트
                    localStorage.setItem('charts', JSON.stringify(charts));
                }
            });

            // 삭제 버튼 이벤트
            const removeBtn = chartItem.querySelector('.remove-chart-btn');
            removeBtn.addEventListener('click', function () {
                if (confirm('이 차트를 삭제하시겠습니까?')) {
                    const chartId = parseInt(chartItem.getAttribute('data-id'));
                    dashboardCharts = dashboardCharts.filter(c => c.id !== chartId);
                    chartItem.remove();

                    // 차트 수 업데이트
                    dashboard.chartCount = dashboardCharts.length;
                    document.getElementById('chartCount').textContent = dashboard.chartCount;

                    // 차트가 없으면 차트 섹션 숨기기
                    if (dashboardCharts.length === 0) {
                        chartsSection.style.display = 'none';
                    }

                    // 차트 배열에서도 제거
                    charts = charts.filter(c => c.id !== chartId);

                    // localStorage 업데이트
                    localStorage.setItem('charts', JSON.stringify(charts));
                }
            });
        });
    }

    // 초기 차트 렌더링
    renderCharts();

    // 요소 참조
    const addChartBtn = document.getElementById('addChartBtn');
    const sortChartsBtn = document.getElementById('sortChartsBtn');
    const editBtn = document.getElementById('editBtn');
    const saveBtn = document.getElementById('saveBtn');
    const deleteBtn = document.getElementById('deleteBtn');
    const backBtn = document.getElementById('backBtn');
    const addChartModal = document.getElementById('addChartModal');
    const sortChartsModal = document.getElementById('sortChartsModal');
    const addChartForm = document.getElementById('addChartForm');
    const sortableChartList = document.getElementById('sortableChartList');
    const saveSortBtn = document.getElementById('saveSortBtn');
    const closeBtns = document.querySelectorAll('.close');
    const dashboardNameElem = document.getElementById('dashboardName');
    const dashboardDescriptionElem = document.getElementById('dashboardDescription');

    // 차트 추가 버튼 클릭 이벤트 - 비활성화
    // addChartBtn.addEventListener('click', function () {
    //     addChartModal.style.display = 'block';
    // });

    // 차트 추가 페이지로 리다이렉트하는 코드로 대체 예정
    // addChartBtn.addEventListener('click', function () {
    //     window.location.href = '/add-chart?dashboardId=' + dashboardId;
    // });

    // 차트 추가 폼 제출 이벤트
    addChartForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const chartName = document.getElementById('chartName').value;
        const chartType = document.getElementById('chartType').value;

        // 새 차트 객체 생성
        const newChart = {
            id: charts.length + 1,
            dashboardId: dashboardId,
            name: chartName,
            type: chartType,
            displayOnMain: true,
            displayOrder: dashboardCharts.length
        };

        // 차트 배열에 추가
        charts.push(newChart);
        dashboardCharts.push(newChart);

        // 대시보드 차트 수 업데이트
        dashboard.chartCount = dashboardCharts.length;
        document.getElementById('chartCount').textContent = dashboard.chartCount;

        // localStorage 업데이트 - 이 부분 추가
        localStorage.setItem('charts', JSON.stringify(charts));

        // 대시보드 정보도 업데이트 (차트 수 변경)
        const storedDashboards = JSON.parse(localStorage.getItem('dashboards'));
        const dashboardIndex = storedDashboards.findIndex(d => d.id === dashboardId);
        if (dashboardIndex !== -1) {
            storedDashboards[dashboardIndex].chartCount = dashboard.chartCount;
            localStorage.setItem('dashboards', JSON.stringify(storedDashboards));
        }

        // 차트 섹션 표시
        chartsSection.style.display = 'block';

        // 차트 렌더링
        renderCharts();

        // 모달 닫기 및 폼 초기화
        addChartModal.style.display = 'none';
        addChartForm.reset();
    });

    // 차트 순서 정렬 버튼 클릭 이벤트
    sortChartsBtn.addEventListener('click', function () {
        if (dashboardCharts.length === 0) {
            alert('정렬할 차트가 없습니다. 먼저 차트를 추가해주세요.');
            return;
        }

        // 정렬 모달에 차트 목록 추가
        sortableChartList.innerHTML = '';

        dashboardCharts.forEach(chart => {
            const li = document.createElement('li');
            li.setAttribute('data-id', chart.id);
            li.innerHTML = `
                <span class="drag-handle">&#9776;</span>
                <span>${chart.name}</span>
            `;
            sortableChartList.appendChild(li);
        });

        // 드래그 앤 드롭 초기화
        initSortable();

        // 정렬 모달 표시
        sortChartsModal.style.display = 'block';
    });

    // 정렬 저장 버튼 클릭 이벤트
    saveSortBtn.addEventListener('click', function () {
        // 정렬된 순서로 차트 ID 배열 생성
        const sortedIds = Array.from(sortableChartList.querySelectorAll('li')).map(item =>
            parseInt(item.getAttribute('data-id'))
        );

        // 차트 순서 업데이트
        sortedIds.forEach((id, index) => {
            const chart = dashboardCharts.find(c => c.id === id);
            if (chart) {
                chart.displayOrder = index;
            }
        });

        // 차트 다시 렌더링
        renderCharts();

        // 정렬 모달 닫기
        sortChartsModal.style.display = 'none';

        alert('차트 순서가 저장되었습니다.');
    });

    // 수정 버튼 클릭 이벤트
    editBtn.addEventListener('click', function () {
        // 수정 가능한 요소들에 편집 가능 상태 활성화
        dashboardNameElem.setAttribute('contenteditable', 'true');
        dashboardNameElem.style.borderColor = '#ccc';
        dashboardNameElem.style.backgroundColor = '#f9f9f9';

        dashboardDescriptionElem.setAttribute('contenteditable', 'true');
        dashboardDescriptionElem.style.borderColor = '#ccc';
        dashboardDescriptionElem.style.backgroundColor = '#f9f9f9';

        // 버튼 표시 상태 변경
        editBtn.style.display = 'none';
        saveBtn.style.display = 'inline-block';
    });

    // 대시보드 저장 버튼 클릭 이벤트
    saveBtn.addEventListener('click', function () {
        // 편집 가능 상태 비활성화
        dashboardNameElem.setAttribute('contenteditable', 'false');
        dashboardNameElem.style.borderColor = 'transparent';
        dashboardNameElem.style.backgroundColor = '';

        dashboardDescriptionElem.setAttribute('contenteditable', 'false');
        dashboardDescriptionElem.style.borderColor = 'transparent';
        dashboardDescriptionElem.style.backgroundColor = '';

        // 버튼 표시 상태 변경
        saveBtn.style.display = 'none';
        editBtn.style.display = 'inline-block';

        // 대시보드 정보 업데이트
        dashboard.name = dashboardNameElem.textContent;
        dashboard.description = dashboardDescriptionElem.textContent;
        dashboard.updatedAt = new Date().toISOString();

        // 페이지 제목 업데이트
        document.getElementById('pageTitle').textContent = `${dashboard.name} 대시보드 상세 내역`;

        // 수정일 업데이트
        document.getElementById('updatedAt').textContent = formatDate(dashboard.updatedAt);

        // localStorage에 대시보드 정보 저장
        const storedDashboards = JSON.parse(localStorage.getItem('dashboards'));
        const dashboardIndex = storedDashboards.findIndex(d => d.id === dashboardId);
        if (dashboardIndex !== -1) {
            storedDashboards[dashboardIndex] = dashboard;
            localStorage.setItem('dashboards', JSON.stringify(storedDashboards));
        }

        // localStorage에 차트 정보 저장
        localStorage.setItem('charts', JSON.stringify(charts));

        alert('대시보드가 저장되었습니다.');
    });

    // 대시보드 삭제 버튼 클릭 이벤트
    deleteBtn.addEventListener('click', function () {
        if (confirm('정말로 이 대시보드를 삭제하시겠습니까?')) {
            try {
                // localStorage에서 최신 데이터 가져오기
                let storedDashboards = [];
                let storedCharts = [];

                const dashboardsData = localStorage.getItem('dashboards');
                if (dashboardsData) {
                    storedDashboards = JSON.parse(dashboardsData);
                } else {
                    storedDashboards = dashboards; // 전역 변수 사용
                }

                const chartsData = localStorage.getItem('charts');
                if (chartsData) {
                    storedCharts = JSON.parse(chartsData);
                } else {
                    storedCharts = charts; // 전역 변수 사용
                }

                // 특정 대시보드만 제거
                const updatedDashboards = storedDashboards.filter(d => d.id !== dashboardId);

                // 관련 차트 제거
                const updatedCharts = storedCharts.filter(c => c.dashboardId !== dashboardId);

                // localStorage 업데이트
                localStorage.setItem('dashboards', JSON.stringify(updatedDashboards));
                localStorage.setItem('charts', JSON.stringify(updatedCharts));

                // 전역 변수도 업데이트 (필요시)
                dashboards = updatedDashboards;
                charts = updatedCharts;

                alert('대시보드가 삭제되었습니다.');
                window.location.href = '/dashboard-info';
            } catch (e) {
                console.error('데이터 삭제 중 오류 발생:', e);
                alert('대시보드 삭제 중 오류가 발생했습니다.');
            }
        }
    });

    // 뒤로 가기 버튼 클릭 이벤트
    backBtn.addEventListener('click', function () {
        if (typeof currentUser !== 'undefined' && currentUser && currentUser.role === 'ADMIN') {
            window.location.href = '/admin/dashboard-info';
        } else {
            window.location.href = '/dashboard-info';
        }
    });

    // 모달 닫기 버튼 이벤트
    closeBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            addChartModal.style.display = 'none';
            sortChartsModal.style.display = 'none';
        });
    });

    // 모달 외부 클릭 시 닫기
    window.addEventListener('click', function (e) {
        if (e.target === addChartModal) {
            addChartModal.style.display = 'none';
        }
        if (e.target === sortChartsModal) {
            sortChartsModal.style.display = 'none';
        }
    });

    // 드래그 앤 드롭 정렬 초기화 함수
    function initSortable() {
        const items = sortableChartList.querySelectorAll('li');
        let draggedItem = null;

        items.forEach(item => {
            // 드래그 시작 이벤트
            item.addEventListener('dragstart', function () {
                draggedItem = this;
                setTimeout(() => {
                    this.style.opacity = '0.5';
                }, 0);
            });

            // 드래그 종료 이벤트
            item.addEventListener('dragend', function () {
                this.style.opacity = '1';
                draggedItem = null;
            });

            // 드래그 가능하도록 설정
            item.setAttribute('draggable', 'true');

            // 드래그 오버 이벤트
            item.addEventListener('dragover', function (e) {
                e.preventDefault();
            });

            // 드롭 이벤트
            item.addEventListener('drop', function (e) {
                e.preventDefault();
                if (this !== draggedItem) {
                    const allItems = Array.from(sortableChartList.querySelectorAll('li'));
                    const draggedIndex = allItems.indexOf(draggedItem);
                    const targetIndex = allItems.indexOf(this);

                    if (draggedIndex < targetIndex) {
                        sortableChartList.insertBefore(draggedItem, this.nextSibling);
                    } else {
                        sortableChartList.insertBefore(draggedItem, this);
                    }
                }
            });
        });
    }
});
