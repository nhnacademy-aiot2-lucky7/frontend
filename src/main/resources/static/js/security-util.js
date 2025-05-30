const AES_KEY = '84NpGyzp3kh26lyGyr4PMSipEmrKHNvY4veZpgPUlC8=';

async function encryptEmailGCM(email, base64Key) {
    // 키 디코딩
    const keyBytes = Uint8Array.from(atob(base64Key), c => c.charCodeAt(0));
    const cryptoKey = await window.crypto.subtle.importKey(
        'raw',
        keyBytes,
        { name: 'AES-GCM' },
        false,
        ['encrypt']
    );

    // IV(12바이트)
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    // 암호화
    const enc = new TextEncoder();
    const ciphertext = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: iv, tagLength: 128 },
        cryptoKey,
        enc.encode(email)
    );

    // [IV + 암호문+태그]를 합쳐서 base64 인코딩
    const combined = new Uint8Array(iv.length + ciphertext.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(ciphertext), iv.length);

    // base64 인코딩 반환
    return btoa(String.fromCharCode(...combined));
}