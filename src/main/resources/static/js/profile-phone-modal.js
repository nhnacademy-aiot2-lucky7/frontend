document.addEventListener('DOMContentLoaded', function () {
    // 모달 열기/닫기
    const modal = document.getElementById('phoneModal');
    const openBtn = document.getElementById('openPhoneModal');
    const closeBtn = modal.querySelector('.close');
    const saveBtn = document.getElementById('modalSavePhone');

    openBtn.addEventListener('click', function () {
        modal.style.display = 'block';
    });
    closeBtn.addEventListener('click', function () {
        modal.style.display = 'none';
        resetModal();
    });
    window.addEventListener('click', function (e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            resetModal();
        }
    });

    // 인증번호 발송
    document.getElementById('modalSendSmsBtn').addEventListener('click', function () {
        const phoneNum = document.getElementById('modalNewPhone').value.trim();
        const smsMsg = document.getElementById('modalSmsMsg');
        smsMsg.textContent = '';
        if (!phoneNum.match(/^01[016789][0-9]{7,8}$/)) {
            smsMsg.textContent = "올바른 휴대전화 번호를 입력하세요.";
            smsMsg.style.color = "#dc2626";
            return;
        }
        fetch('/sms/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phoneNum })
        })
            .then(res => res.text())
            .then(msg => {
                smsMsg.textContent = msg + " 인증번호를 입력해 주세요.";
                smsMsg.style.color = "#3b7ddd";
            })
            .catch(() => {
                smsMsg.textContent = "문자 발송 실패! 다시 시도하세요.";
                smsMsg.style.color = "#dc2626";
            });
    });

    // 인증번호 확인
    document.getElementById('modalCheckCertBtn').addEventListener('click', function () {
        const phoneNum = document.getElementById('modalNewPhone').value.trim();
        const certCode = document.getElementById('modalCertCode').value.trim();
        const certMsg = document.getElementById('modalCertMsg');
        certMsg.textContent = '';
        if (!phoneNum || !certCode) {
            certMsg.textContent = "휴대전화 번호와 인증번호를 모두 입력하세요.";
            certMsg.style.color = "#dc2626";
            return;
        }
        fetch('/sms/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phoneNum, certCode })
        })
            .then(res => res.text())
            .then(msg => {
                certMsg.textContent = msg;
                if (msg === '인증 성공') {
                    certMsg.style.color = "#43a047";
                    saveBtn.disabled = false;
                    // 인증 성공 시 저장 버튼 활성화
                } else {
                    certMsg.style.color = "#dc2626";
                    saveBtn.disabled = true;
                }
            })
            .catch(() => {
                certMsg.textContent = "인증 확인 실패! 다시 시도하세요.";
                certMsg.style.color = "#dc2626";
                saveBtn.disabled = true;
            });
    });

    // 인증 성공 시 회원정보 수정 폼의 input 값만 변경 (DB 저장 X)
    saveBtn.addEventListener('click', function () {
        const phoneNum = document.getElementById('modalNewPhone').value.trim();
        document.getElementById('userPhone').value = phoneNum;
        modal.style.display = 'none';
        resetModal();
    });

    function resetModal() {
        document.getElementById('modalNewPhone').value = '';
        document.getElementById('modalCertCode').value = '';
        document.getElementById('modalSmsMsg').textContent = '';
        document.getElementById('modalCertMsg').textContent = '';
        document.getElementById('modalSavePhone').disabled = true;
    }
});
