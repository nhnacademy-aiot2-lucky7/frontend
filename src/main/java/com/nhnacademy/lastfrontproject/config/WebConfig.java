package com.nhnacademy.lastfrontproject.config;

import com.nhnacademy.lastfrontproject.util.interceptor.DepartmentIdInterceptor;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
public class WebConfig implements WebMvcConfigurer {
    private final DepartmentIdInterceptor interceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(interceptor)
                .addPathPatterns("/**") // 모든 경로에 대해 적용
                .excludePathPatterns("/static/**", "/css/**", "/js/**", "/images/**", "/favicon.ico"); // 정적 리소스 제외
    }
}