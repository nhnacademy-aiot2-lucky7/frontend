// latest-multi-charts.js
Chart.register(ChartDataLabels);

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('latest-ai-chart-container');
    if (!container) return;  // 없으면 실행 안 함

    // 공통: 최신 1건만 조회 (타입별)
    async function fetchLatestByType(type) {
        const res = await fetch(
            `https://luckyseven.live/api/analysis-results/search?page=0&size=1&type=${encodeURIComponent(type)}`,
            { credentials: 'include' }
        );
        if (!res.ok) return null;
        const json = await res.json();
        return json.content?.[0] || null;
    }

    // 공통: id로 상세 조회
    async function fetchDetail(id) {
        const res = await fetch(
            `https://luckyseven.live/api/analysis-results/${id}`,
            { credentials: 'include' }
        );
        if (!res.ok) return null;
        return res.json();
    }

    // 상관관계 렌더러 (막대+원형)
    function renderCorrelation(parent, detail) {
        const result = detail.resultJson ? JSON.parse(detail.resultJson) : detail;
        const labels = result.predictedData.map(d => d.sensorInfo.sensorType);
        const values = result.predictedData.map(d => d.correlationRiskModel);

        const box = document.createElement('div');
        box.style.display = 'flex';
        box.style.gap = '2rem';
        box.style.flexWrap = 'wrap';
        box.innerHTML = `<h4 style="width:100%; text-align:center;">상관관계 위험도 (최신)</h4>`;
        parent.appendChild(box);

        // Bar
        const barCan = document.createElement('canvas');
        barCan.style.width = '600px'; barCan.style.height = '320px';
        box.appendChild(barCan);
        new Chart(barCan.getContext('2d'), {
            type: 'bar',
            data: { labels, datasets:[{ label:'Risk', data:values }]},
            options:{ responsive:true, maintainAspectRatio:false }
        });

        // Pie
        const pieCan = document.createElement('canvas');
        pieCan.style.width = '320px'; pieCan.style.height = '320px';
        box.appendChild(pieCan);
        new Chart(pieCan.getContext('2d'), {
            type: 'pie',
            data: { labels, datasets:[{ data:values }]},
            options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'top' } } }
        });
    }

    // 단일 예측 렌더러 (꺾은선)
    function renderSingle(parent, detail) {
        const result = detail.resultJson ? JSON.parse(detail.resultJson) : detail;
        const labels = result.predictedData.map(d => {
            const dt = new Date(d.predictedDate);
            return `${dt.getFullYear()}-${dt.getMonth()+1}-${dt.getDate()}`;
        });
        const values = result.predictedData.map(d => d.predictedValue);

        const box = document.createElement('div');
        box.style.marginTop = '2rem';
        box.innerHTML = `<h4 style="text-align:center;">예측값 추이 (최신)</h4>`;
        parent.appendChild(box);

        const can = document.createElement('canvas');
        can.style.width = '100%'; can.style.height = '320px';
        box.appendChild(can);
        new Chart(can.getContext('2d'), {
            type: 'line',
            data: { labels, datasets:[{ label:'Predicted', data:values, tension:0.3 }]},
            options:{ responsive:true, maintainAspectRatio:false }
        });
    }

    // 실제 실행
    (async () => {
        container.innerHTML = '';  // 완전 초기화

        // 1) 상관관계 최신 1건
        const corr = await fetchLatestByType('CORRELATION_RISK_PREDICT');
        if (corr) {
            const d = await fetchDetail(corr.id);
            if (d) renderCorrelation(container, d);
        }

        // 2) 단일 예측 최신 1건
        const single = await fetchLatestByType('SINGLE_SENSOR_PREDICT');
        if (single) {
            const d = await fetchDetail(single.id);
            if (d) renderSingle(container, d);
        }
    })();
});
