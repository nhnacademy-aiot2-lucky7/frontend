// latest-two-charts.js
Chart.register(ChartDataLabels);

document.addEventListener('DOMContentLoaded', () => {
    const root = document.getElementById('latest-ai-chart-container');
    if (!root) return;                // container가 없으면 바로 종료

    // 1) 최신 1건만 조회 (타입별)
    async function fetchLatestByType(analysisType) {
        const res = await fetch(
            `https://luckyseven.live/api/analysis-results/search?page=0&size=1&type=${encodeURIComponent(analysisType)}`,
            { credentials: 'include' }
        );
        if (!res.ok) {
            console.warn(`${analysisType} 조회 실패: ${res.status}`);
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
            console.warn(`detail 조회 실패(id=${id}): ${res.status}`);
            return null;
        }
        return res.json();
    }

    // 3a) 상관관계 차트 렌더링 (막대 + 원형)
    function renderCorrelation(section, detail) {
        let result = detail.resultJson ? JSON.parse(detail.resultJson) : detail;
        const labels = result.predictedData.map(d => d.sensorInfo.sensorType);
        const values = result.predictedData.map(d => d.correlationRiskModel);

        // 센서 테이블 (필요 시)
        // ...

        // 차트 컨테이너
        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.gap     = '2.5rem';
        wrapper.style.flexWrap= 'wrap';
        section.appendChild(wrapper);

        // — Bar
        const barCanvas = document.createElement('canvas');
        wrapper.appendChild(barCanvas);
        new Chart(barCanvas.getContext('2d'), {
            type: 'bar',
            data: { labels, datasets: [{ label:'Corr Risk', data:values }] },
            options: { responsive:true, maintainAspectRatio:false }
        });

        // — Pie
        const pieCanvas = document.createElement('canvas');
        wrapper.appendChild(pieCanvas);
        new Chart(pieCanvas.getContext('2d'), {
            type: 'pie',
            data: { labels, datasets: [{ data:values }] },
            options: {
                responsive:true,
                maintainAspectRatio:false,
                plugins: { legend:{ position:'top' } }
            }
        });
    }

    // 3b) 단일 예측 차트 렌더링 (꺾은선)
    function renderSingle(section, detail) {
        let result = detail.resultJson ? JSON.parse(detail.resultJson) : detail;
        const labels = result.predictedData.map(d => {
            const dt = new Date(d.predictedDate);
            return `${dt.getFullYear()}-${dt.getMonth()+1}-${dt.getDate()}`;
        });
        const values = result.predictedData.map(d => d.predictedValue);

        const canvas = document.createElement('canvas');
        section.appendChild(canvas);
        new Chart(canvas.getContext('2d'), {
            type: 'line',
            data: { labels, datasets: [{ label:'Predicted', data:values, tension:0.3 }] },
            options: { responsive:true, maintainAspectRatio:false }
        });
    }

    // 4) 실제 실행
    (async () => {
        root.innerHTML = '';  // 초기화

        // 차트를 담을 두 개의 섹션을 미리 생성
        const corrSection   = document.createElement('section');
        corrSection.innerHTML = `<h3 style="text-align:center;">상관관계 위험도 (최신)</h3>`;
        root.appendChild(corrSection);

        const singleSection = document.createElement('section');
        singleSection.innerHTML = `<h3 style="text-align:center;">예측값 추이 (최신)</h3>`;
        root.appendChild(singleSection);

        // — 상관관계
        const corrLatest = await fetchLatestByType('CORRELATION_RISK_PREDICT');
        if (corrLatest) {
            const corrDetail = await fetchDetail(corrLatest.id);
            if (corrDetail) renderCorrelation(corrSection, corrDetail);
            else corrSection.append('상세 조회 실패');
        } else {
            corrSection.append('데이터 없음');
        }

        // — 단일 예측
        const singleLatest = await fetchLatestByType('SINGLE_SENSOR_PREDICT');
        if (singleLatest) {
            const singleDetail = await fetchDetail(singleLatest.id);
            if (singleDetail) renderSingle(singleSection, singleDetail);
            else singleSection.append('상세 조회 실패');
        } else {
            singleSection.append('데이터 없음');
        }
    })();
});
