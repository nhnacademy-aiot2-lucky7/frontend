const unitMap = {
    temperature: "℃",
    humidity: "%",
    light: "lx",
    gas: "ppm",
    vibration: "㎨",
    smoke: "%"
};

const dummyRules = {
    "1": [
        {
            dataType: { value: "temperature", desc: "온도가" },
            thresholdBasis: { value: "MAX", desc: "최고" },
            value: 35,
            action: { value: "event", desc: "이벤트를 기록합니다." },
            valueConfig: { min: 30, max: 50, step: 5 }
        },
        {
            dataType: { value: "temperature", desc: "온도가" },
            thresholdBasis: { value: "MIN", desc: "최저" },
            value: 5,
            action: { value: "alert", desc: "알림을 울립니다." },
            valueConfig: { min: 0, max: 20, step: 5 }
        },
        {
            dataType: { value: "temperature", desc: "온도가" },
            thresholdBasis: { value: "AVERAGE", desc: "평균" },
            operator: { value: ">", desc: "초과하면" },
            value: 25,
            action: { value: "control", desc: "장비를 제어합니다." },
            valueConfig: { min: 10, max: 40, step: 10 }
        }
    ],
    "2": [ // 습도 센서
        {
            dataType: { value: "humidity", desc: "습도가" },
            thresholdBasis: { value: "MAX", desc: "최고" },
            value: 90,
            action: { value: "event", desc: "이벤트를 기록합니다." },
            valueConfig: { min: 70, max: 100, step: 10 }
        },
        {
            dataType: { value: "humidity", desc: "습도가" },
            thresholdBasis: { value: "MIN", desc: "최저" },
            value: 30,
            action: { value: "alert", desc: "알림을 울립니다." },
            valueConfig: { min: 10, max: 40, step: 10 }
        },
        {
            dataType: { value: "humidity", desc: "습도가" },
            thresholdBasis: { value: "AVERAGE", desc: "평균" },
            operator: { value: "<", desc: "미만이면" },
            value: 50,
            action: { value: "control", desc: "장비를 제어합니다." },
            valueConfig: { min: 30, max: 80, step: 10 }
        }
    ],
    "3": [] // 조도 센서
};

function getRuleDescription(rule) {
    const unit = unitMap[rule.dataType.value] || "";
    let operatorDesc;

    if (rule.thresholdBasis.value === "MAX") {
        operatorDesc = "초과하면";
    } else if (rule.thresholdBasis.value === "MIN") {
        operatorDesc = "미만이면";
    } else if (rule.thresholdBasis.value === "AVERAGE" && rule.operator) {
        operatorDesc = rule.operator.desc;
    } else {
        operatorDesc = ""; // 안전 처리
    }

    return `${rule.thresholdBasis.desc} ${rule.dataType.desc} ${rule.value}${unit}  ${operatorDesc} ${rule.action.desc}`;
}

const sensorCards = document.querySelectorAll('.sensor-btn');
const modal = document.getElementById('rule-modal');
const sensorInfo = document.getElementById('sensor-info');
const ruleList = document.getElementById('rule-list');

sensorCards.forEach(btn => {
    btn.addEventListener('click', () => {
        const sensorId = btn.dataset.sensorId;
        const type = btn.dataset.type;
        const location = btn.dataset.location;
        const hardware = btn.dataset.hardware;

        // 센서 요약 표시
        sensorInfo.innerHTML = `
            <p><strong>종류:</strong> ${type}</p>
            <p><strong>위치:</strong> ${location}</p>
            <p><strong>하드웨어:</strong> ${hardware}</p>
        `;

        const rules = dummyRules[sensorId] || [];

        if (rules.length === 0) {
            ruleList.innerHTML = '<li>등록된 룰이 없습니다.</li>';
        } else {
            ruleList.innerHTML = rules.map((rule, idx) => {
                return `
                    <li class="rule-item-card" data-index="${idx}" data-sensor-id="${sensorId}">
                        <div class="rule-item-content">
                            <p class="rule-text">${getRuleDescription(rule)}</p>
                            <button class="btn btn-edit-rule">수정</button>
                        </div>
                    </li>
                `;
            }).join('');
        }

        modal.classList.remove('hidden');
    });
});

ruleList.addEventListener('click', (e) => {
    const editBtn = e.target.closest('.btn-edit-rule');
    if (!editBtn) return;

    const currentItem = editBtn.closest('.rule-item-card');
    const sensorId = currentItem.dataset.sensorId;
    const index = currentItem.dataset.index;
    const rule = dummyRules[sensorId][index];
    const unit = unitMap[rule.dataType.value];

    // 모든 수정 버튼 숨기기
    document.querySelectorAll('.btn-edit-rule').forEach(btn => btn.classList.add('hidden'));

    const editForm = document.createElement('div');
    editForm.innerHTML = generateEditForm(rule, unit);
    currentItem.appendChild(editForm);

    editForm.querySelector('.btn-save-rule').addEventListener('click', () => {
        const selectedRadio = editForm.querySelector('input[name="value-radio"]:checked');
        const customInput = editForm.querySelector('.custom-value-input');
        const threshold = document.querySelector('.threshold-basis').dataset.value;
        const action = editForm.querySelector('input[name="action"]:checked').value;
        let actionDesc = null;
        const operator = editForm.querySelector('input[name="operator"]:checked')?.value;

        if(action === "event"){
            actionDesc = "이벤트를 기록합니다.";
        }else if(action === "alert"){
            actionDesc = "알림을 울립니다.";
        }else{
            actionDesc = "장비를 제어합니다.";
        }

        const value = selectedRadio.value === 'custom'
            ? Number(customInput.value)
            : Number(selectedRadio.value);

        const sensorId = currentItem.dataset.sensorId;
        const index = currentItem.dataset.index;
        const rule = dummyRules[sensorId][index];
        const { min, max } = rule.valueConfig || { min: 0, max: 100 };

        // 유효성 검사
        if (selectedRadio.value === 'custom' && (value < min || value > max)) {
            alert(`임계값은 ${min} ~ ${max}${unitMap[rule.dataType.value]} 사이여야 합니다.`);
            return;
        }

        // 🔁 rule 데이터 업데이트
        rule.value = value;
        rule.action.value = action;
        rule.action.desc = actionDesc;

        if (threshold === "AVERAGE") {
            rule.operator = { value: operator, desc: operator === ">" ? "초과하면" : "미만이면" };
        } else {
            delete rule.operator; // AVERAGE 아니면 operator 제거
        }

        // 📋 UI 업데이트
        const ruleText = currentItem.querySelector('.rule-text');
        ruleText.textContent = getRuleDescription(rule); // 수정된 텍스트 반영

        editForm.remove(); // 폼 제거
        document.querySelectorAll('.btn-edit-rule').forEach(btn => btn.classList.remove('hidden'));
    });

    editForm.querySelectorAll('input[name="value-radio"]').forEach(radio => {
        radio.addEventListener('change', () => {
            // 모든 custom-value input 비활성화
            editForm.querySelectorAll('.custom-value-input').forEach(input => {
                input.disabled = true;
            });

            // 클릭한 라디오가 custom이면, 같은 label 안의 input 활성화
            if (radio.value === 'custom') {
                const label = radio.closest('label');
                const customInput = label.querySelector('.custom-value-input');
                if (customInput) {
                    customInput.disabled = false;
                    customInput.focus();
                }
            }
        });
    });

    // 기준값 선택 시 operator 보여주기
    editForm.querySelectorAll('input[name="threshold"]').forEach(radio => {
        radio.addEventListener('change', () => {
            const opGroup = editForm.querySelector('.operator-group');
            if (radio.value === "AVERAGE") {
                opGroup.classList.remove('hidden');
            } else {
                opGroup.classList.add('hidden');
            }
        });
    });

    // 취소 버튼 이벤트 추가
    editForm.querySelector('.btn-cancel-rule').addEventListener('click', () => {
        editForm.remove();
        // 수정 버튼 다시 보이기
        document.querySelectorAll('.btn-edit-rule').forEach(btn => btn.classList.remove('hidden'));
    });

});

function generateEditForm(rule, unit) {
    const valueConfig = rule.valueConfig || { min: 0, max: 100, step: 50 };

    const options = [];
    for (let v = valueConfig.min; v <= valueConfig.max; v += valueConfig.step) {
        options.push(v);
    }

    return `
        <div class="rule-edit-form">
            <div class="threshold-basis" data-value="${rule.thresholdBasis.value}"></div>
        
            <div class="form-group operator-group ${rule.thresholdBasis.value === 'AVERAGE' ? '' : 'hidden'}">
                <label>조건</label>
                <label><input type="radio" name="operator" value=">" ${rule.operator?.value === '>' ? 'checked' : ''}> 초과</label>
                <label><input type="radio" name="operator" value="<" ${rule.operator?.value === '<' ? 'checked' : ''}> 미만</label>
            </div>

            <div class="form-group">
                <label>임계값</label>
                <div class="value-radio-group">
                    ${options.map(val => `
                        <label>
                            <input type="radio" name="value-radio" value="${val}" ${rule.value === val ? 'checked' : ''}> ${val}${unit}
                        </label>
                    `).join('')}
                    <label class="custom-input-label">
                        <input type="radio" name="value-radio" value="custom" ${!options.includes(rule.value) ? 'checked' : ''}>
                        직접 입력
                        <input type="number"
                               name="custom-value"
                               class="custom-value-input"
                               min="${valueConfig.min}"
                               max="${valueConfig.max}"
                               step="1"
                               value="${rule.value}"
                               ${!options.includes(rule.value) ? '' : 'disabled'}>
                        <span class="unit-label">${unit}</span>
                    </label>
                </div>
            </div>

            <div class="form-group">
                <label>액션</label>
                <div class="radio-group">
                    <label><input type="radio" name="action" value="event" ${rule.action.value === 'event' ? 'checked' : ''}> 이벤트</label>
                    <label><input type="radio" name="action" value="alert" ${rule.action.value === 'alert' ? 'checked' : ''}> 알림</label>
                    <label><input type="radio" name="action" value="control" ${rule.action.value === 'control' ? 'checked' : ''}> 장비제어</label>
                </div>
            </div>

            <div class="form-buttons">
                <button class="btn btn-primary btn-save-rule">저장</button>
                <button class="btn btn-secondary btn-cancel-rule">취소</button>
            </div>
        </div>
    `;
}

document.getElementById('close-rule-modal').addEventListener('click', () => {
    modal.classList.add('hidden');
    ruleList.innerHTML = '';
});

