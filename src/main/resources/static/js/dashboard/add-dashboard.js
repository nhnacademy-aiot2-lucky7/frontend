document.addEventListener('DOMContentLoaded', function() {
    const folderSelect = document.getElementById('folderSelect');
    // 폴더 목록 불러오기
    fetch('http://localhost:10232/folders', {
        headers: {
            'X-User-Id': currentUser.userNo
        }
    })
        .then(res => res.json())
        .then(folders => {
            folders.forEach(folder => {
                const option = document.createElement('option');
                option.value = folder.uid;
                option.textContent = folder.title;
                folderSelect.appendChild(option);
            });
        });

    const saveBtn = document.getElementById('saveBtn');
    const dashboardForm = document.getElementById('dashboardForm');

    saveBtn.addEventListener('click', function() {
        if (!dashboardForm.checkValidity()) {
            dashboardForm.reportValidity();
            return;
        }

        const nameInput = document.getElementById('name');
        const descriptionInput = document.getElementById('description');
        const folderUid = folderSelect.value;

        const dashboardData = {
            dashboardTitle: nameInput.value,
            description: descriptionInput.value,
            folderUid: folderUid
        };

        fetch('http://localhost:10232/dashboards', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'X-User-Id': currentUser.userNo
            },
            body: JSON.stringify(dashboardData)
        })
            .then(response => {
                if (response.ok) {
                    alert('대시보드가 생성되었습니다.');
                    if (currentUser.userRole === 'ROLE_ADMIN') {
                        window.location.href = '/admin/dashboard-info';
                    } else {
                        window.location.href = '/dashboard-info';
                    }
                } else {
                    return response.text().then(msg => { throw new Error(msg); });
                }
            })
            .catch(error => {
                alert('대시보드 생성 실패: ' + error.message);
            });
    });
});