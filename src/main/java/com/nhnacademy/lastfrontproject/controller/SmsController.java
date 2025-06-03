package com.nhnacademy.lastfrontproject.controller;

import com.nhnacademy.lastfrontproject.service.SmsService;
import com.nhnacademy.lastfrontproject.dto.SmsRequestDto;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/sms")
public class SmsController {

    private final SmsService smsService;
    private final Map<String, String> phoneToCode = new HashMap<>();

    public SmsController(@Autowired SmsService smsService) {
        this.smsService = smsService;
    }

    @PostMapping("/send")
    public ResponseEntity<String> SendSMS(@RequestBody @Valid SmsRequestDto smsRequestDto){
        String code = smsService.SendSms(smsRequestDto);
        phoneToCode.put(smsRequestDto.getPhoneNum(), code); // 인증번호 저장
        return ResponseEntity.ok("문자를 전송했습니다.");
    }

    @PostMapping("/verify")
    public ResponseEntity<String> VerifySMS(@RequestBody Map<String, String> req){
        String phoneNum = req.get("phoneNum");
        String certCode = req.get("certCode");
        String savedCode = phoneToCode.get(phoneNum);
        if (savedCode != null && savedCode.equals(certCode)) {
            return ResponseEntity.ok("인증 성공");
        } else {
            return ResponseEntity.status(400).body("인증번호를 확인해 주세요");
        }
    }
}
