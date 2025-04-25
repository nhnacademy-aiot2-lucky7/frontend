// 수정, 저장 버튼 컨트롤
const editBtn = document.getElementById('edit-toggle-btn');
const saveBtn = document.getElementById('save-btn');

editBtn.addEventListener('click', () => {
    document.querySelectorAll('[data-field]').forEach(item => {
        const field = item.dataset.field;
        const value = item.querySelector('[data-value]').innerText;

        if (field === 'description') {
            item.innerHTML = `
                <h4>설명</h4>
                <textarea name="description" class="edit-textarea">${value}</textarea>
            `;
        } else if (field !== 'status') {
            item.innerHTML = `
                <span class="label">${item.querySelector('.label').innerText}</span>
                <input type="text" class="edit-input" name="${field}" value="${value}">
            `;
        }
    });
    editBtn.style.display = 'none';
    saveBtn.style.display = 'inline-block';
});

saveBtn.addEventListener('click', () => {
    const payload = {};
    document.querySelectorAll('.edit-input').forEach(input => {
        payload[input.name] = input.value;
    });
    const desc = document.querySelector('.edit-textarea');
    if (desc) payload["description"] = desc.value;

    // 값 반영
    document.querySelectorAll('[data-field]').forEach(item => {
        const field = item.dataset.field;
        if (field === 'description') {
            item.innerHTML = `
                <h4>설명</h4>
                <div class="desc" data-value>${payload.description}</div>
            `;
        } else if (field !== 'status') {
            item.innerHTML = `
                <span class="label">${item.querySelector('.label')?.innerText || field}</span>
                <span class="value" data-value>${payload[field]}</span>
            `;
        }
    });

    // 상태는 무조건 비활성화 처리
    const statusValue = document.querySelector('.status-item .value');
    statusValue.innerText = '비활성화(데이터 수집 중)';
    statusValue.classList.remove('active');
    statusValue.classList.add('inactive');

    saveBtn.style.display = 'none';
    editBtn.style.display = 'inline-block';
    alert('입력한 데이터로 반영되었습니다. (임시 상태)');
});