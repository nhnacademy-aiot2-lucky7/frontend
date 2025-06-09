document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('latest-ai-chart-container');

    // 1) 최신 1건만 리스트 조회
    async function fetchLatestItem() {
        const res = await fetch(
            'https://luckyseven.live/api/analysis-results/search?page=0&size=1',
            { credentials: 'include' }
        );
        if (!res.ok) {
            container.innerText = '리스트 조회 실패';
            return null;
        }
        const data = await res.json();
        return data.content?.[0] || null;
    }

    // 2) 상세 데이터 조회
    async function fetchDetail(id) {
        const res = await fetch(
            `https://luckyseven.live/api/analysis-results/${id}`,
            { credentials: 'include' }
        );
        if (!res.ok) {
            container.innerText = '상세 조회 실패';
            return null;
        }
        return res.json();
    }

    // 3) 실제 차트 그리기
    function renderCharts(detail) {
        let result;
        try {
            result = detail.resultJson ? JSON.parse(detail.resultJson) : detail;
        } catch {
            return container.innerText = '파싱 오류';
        }

        // 예시: CORRELATION_RISK_PREDICT 타입만
        if (!Array.isArray(result.predictedData)
            || !/CORRELATION[-_]RISK[-_]PREDICT/i.test(result.type)) {
            return container.innerText = '지원하지 않는 분석 타입';
        }

        // 컨테이너 초기화
        container.innerHTML = '';

        const labels = result.predictedData.map(d => d.sensorInfo.sensorType);
        const values = result.predictedData.map(d => d.correlationRiskModel);

        // Bar 캔버스
        const barCanvas = document.createElement('canvas');
        barCanvas.style.flex = '1';
        container.appendChild(barCanvas);

        // Pie 캔버스
        const pieCanvas = document.createElement('canvas');
        pieCanvas.style.width = '200px';
        container.appendChild(pieCanvas);

        // Bar 차트
        new Chart(barCanvas, {
            type: 'bar',
            data: { labels, datasets: [{ label: '위험도', data: values }] },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    datalabels: {
                        anchor: 'end',
                        align: 'end',
                        formatter: v => v.toFixed(2),
                    }
                }
            },
            plugins: [ChartDataLabels]
        });

        // Pie 차트
        new Chart(pieCanvas, {
            type: 'pie',
            data: { labels, datasets: [{ data: values }] },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    datalabels: {
                        formatter: v => v.toFixed(2),
                    }
                }
            },
            plugins: [ChartDataLabels]
        });
    }

    // 4) 실행 순서
    (async () => {
        container.innerText = '로딩 중…';
        const latest = await fetchLatestItem();
        if (!latest) return;
        const detail = await fetchDetail(latest.id);
        if (!detail) return;
        renderCharts(detail);
    })();
});
