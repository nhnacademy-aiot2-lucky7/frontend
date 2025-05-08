package com.nhnacademy.lastfrontproject.service;

import com.nhnacademy.lastfrontproject.dto.SmsRequestDto;

public interface SmsService {
    String SendSms(SmsRequestDto smsRequestDto);
}
