// datalabels 플러그인 등록
Chart.register(ChartDataLabels);

document.addEventListener('DOMContentLoaded', () => {
    // 1) 타입별로 최신 1건만 조회
    async function fetchLatestByType(analysisType) {
        const res = await fetch(
            `https://luckyseven.live/api/analysis-results/search?page=0&size=1&type=${encodeURIComponent(analysisType)}`,
            { credentials: 'include' }
        );
        if (!res.ok) {
            console.warn(`${analysisType} 리스트 조회 실패`);
            return null;
        }
        const data = await res.json();
        return data.content?.[0] || null;
    }

    // 2) 상세 데이터 조회 (변경 없음)
    async function fetchDetail(id) {
        const res = await fetch(
            `https://luckyseven.live/api/analysis-results/${id}`,
            { credentials: 'include' }
        );
        if (!res.ok) {
            console.warn(`상세 조회 실패 for id=${id}`);
            return null;
        }
        return res.json();
    }

    // 3) 각 타입별 렌더러
    function renderCorrelationChart(container, detail) {
        let result = JSON.parse(detail.resultJson || '{}');
        const labels = result.predictedData.map(d => d.sensorInfo.sensorType);
        const values = result.predictedData.map(d => d.correlationRiskModel);

        // 차트 래퍼 생성
        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.gap = '2.5rem';
        container.appendChild(wrapper);

        // Bar
        const barCanvas = document.createElement('canvas');
        wrapper.appendChild(barCanvas);
        new Chart(barCanvas.getContext('2d'), {
            type: 'bar',
            data: { labels, datasets:[{ label:'Corr Risk', data:values }]},
            options:{ responsive:true, maintainAspectRatio:false }
        });

        // Pie
        const pieCanvas = document.createElement('canvas');
        wrapper.appendChild(pieCanvas);
        new Chart(pieCanvas.getContext('2d'), {
            type:'pie',
            data:{ labels, datasets:[{ data:values }]},
            options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'top' } } }
        });
    }

    function renderLineChart(container, detail) {
        let result = JSON.parse(detail.resultJson || '{}');
        const labels = result.predictedData.map(d => {
            const dt = new Date(d.predictedDate);
            return `${dt.getFullYear()}-${dt.getMonth()+1}-${dt.getDate()}`;
        });
        const values = result.predictedData.map(d => d.predictedValue);

        const canvas = document.createElement('canvas');
        container.appendChild(canvas);
        new Chart(canvas.getContext('2d'), {
            type:'line',
            data:{ labels, datasets:[{ label:'Predicted', data:values, tension:0.3 }] },
            options:{ responsive:true, maintainAspectRatio:false }
        });
    }

    // 4) 초기 실행: correlation + single
    (async () => {
        // 컨테이너 미리 만들어두기 (HTML에 두 개의 div를 둬도 되고, JS에서 생성해도 됩니다)
        const root = document.getElementById('latest-ai-chart-container');
        root.innerHTML = ''; // 초기화

        const types = [
            { key:'CORRELATION_RISK_PREDICT', title:'상관관계 위험도', renderer: renderCorrelationChart },
            { key:'SINGLE_SENSOR_PREDICT',  title:'예측값 추이',    renderer: renderLineChart }
        ];

        for (const {key, title, renderer} of types) {
            // 제목
            const section = document.createElement('section');
            section.style.marginBottom = '2rem';
            section.innerHTML = `<h3 style="text-align:center;">${title} (최신)</h3>`;
            root.appendChild(section);

            // fetch & render
            const latest = await fetchLatestByType(key);
            if (!latest) {
                section.append('데이터 없음');
                continue;
            }
            const detail = await fetchDetail(latest.id);
            if (!detail) {
                section.append('상세 조회 실패');
                continue;
            }
            renderer(section, detail);
        }
    })();
});
