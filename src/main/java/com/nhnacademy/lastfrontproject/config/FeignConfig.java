package com.nhnacademy.lastfrontproject.config;

import feign.RequestInterceptor;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Configuration
public class FeignConfig {

    @Bean
    public RequestInterceptor requestInterceptor() {
        return requestTemplate -> {
            // 현재 HTTP 요청의 쿠키 가져오기
            HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
            String cookie = request.getHeader("Cookie");

            // 쿠키가 있을 경우 Feign 요청에 쿠키 추가
            if (cookie != null) {
                requestTemplate.header("Cookie", cookie);
            }
        };
    }
}