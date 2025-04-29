package com.nhnacademy.lastfrontproject.service.impl;

import com.nhnacademy.lastfrontproject.dto.SmsRequestDto;
import com.nhnacademy.lastfrontproject.service.SmsService;
import com.nhnacademy.lastfrontproject.util.SmsCertificationUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SmsServiceImpl implements SmsService {

    private final SmsCertificationUtil smsCertificationUtil;


    @Override // SmsService 인터페이스 메서드 구현
    public String SendSms(SmsRequestDto smsRequestDto) {
        String phoneNum = smsRequestDto.getPhoneNum(); // SmsrequestDto에서 전화번호를 가져온다.
        String certificationCode = Integer.toString((int)(Math.random() * (999999 - 100000 + 1)) + 100000); // 6자리 인증 코드를 랜덤으로 생성
        smsCertificationUtil.sendSMS(phoneNum, certificationCode); // SMS 인증 유틸리티를 사용하여 SMS 발송
        return certificationCode;
    }
}
