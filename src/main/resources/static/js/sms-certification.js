document.getElementById('sendSmsBtn').addEventListener('click', function() {
    const phoneNum = document.getElementById('userPhone').value;
    fetch('/sms/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNum })
    })
        .then(res => res.text())
        .then(msg => {
            document.getElementById('smsMsg').textContent = msg;
        })
        .catch(() => {
            alert('문자 발송 실패!');
        });
});

// 인증번호 확인
document.getElementById('checkCertBtn').addEventListener('click', function() {
    const phoneNum = document.getElementById('userPhone').value;
    const certCode = document.getElementById('certCode').value;
    fetch('/sms/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNum, certCode })
    })
        .then(res => res.text())
        .then(msg => {
            document.getElementById('certMsg').textContent = msg;
            if (msg === '인증 성공') {
                // 인증 성공 처리 (ex: 회원가입 submit 활성화 등)
            }
        })
        .catch(() => {
            alert('인증 확인 실패!');
        });
});