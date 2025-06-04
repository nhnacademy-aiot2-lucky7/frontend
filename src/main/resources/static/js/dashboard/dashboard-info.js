async function fetchAndStoreDashboards() {
    try {
        const response = await fetch('/dashboard', {
            method: 'GET',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'}
        });

        if (!response.ok) {
            new Error('대시보드 조회 실패');
        }

        const dashboards = await response.json();

        localStorage.setItem('dashboards', JSON.stringify(dashboards));

        console.log('대시보드&부서 정보를 로컬스토리지에 저장했습니다.');

    } catch (error) {
        console.error('대시보드 조회 중 오류 발생:', error);
        alert('대시보드 목록을 불러오는 데 실패했습니다.');
    }
}

// DOMContentLoaded 등 적절한 시점에 호출
document.addEventListener('DOMContentLoaded',  () => {
    fetchAndStoreDashboards().then(() => {
        console.log('대시보드 로딩 완료');
    }).catch(error => {
        console.error('대시보드 로딩 실패:', error);
    });
});
