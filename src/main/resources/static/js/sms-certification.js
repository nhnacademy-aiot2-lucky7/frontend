window.isPhoneVerified = false;

// 문자 발송 (입력값 유효성 검사)
document.getElementById('sendSmsBtn').addEventListener('click', function() {
    const phoneNum = document.getElementById('userPhone').value.trim();
    const smsMsg = document.getElementById('smsMsg');
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
        .catch((err) => {
            smsMsg.textContent = "문자 발송 실패! 다시 시도하세요.";
            smsMsg.style.color = "#dc2626";
            console.error(err);
        });
});

// 인증번호 확인
document.getElementById('checkCertBtn').addEventListener('click', function() {
    const phoneNum = document.getElementById('userPhone').value.trim();
    const certCode = document.getElementById('certCode').value.trim();
    const certMsg = document.getElementById('certMsg');
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
                document.getElementById('checkCertBtn').disabled = true;
                document.getElementById('sendSmsBtn').disabled = true;
                document.getElementById('certCode').disabled = true;
                // 인증 상태 저장
                window.isPhoneVerified = true;
            } else {
                certMsg.style.color = "#dc2626";
                window.isPhoneVerified = false;
            }
        })
        .catch((err) => {
            certMsg.textContent = "인증 확인 실패! 다시 시도하세요.";
            certMsg.style.color = "#dc2626";
            console.error(err);
        });
});
