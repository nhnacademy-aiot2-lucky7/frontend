package com.nhnacademy.lastfrontproject.config;

//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
//import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
//import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
//import org.springframework.security.web.SecurityFilterChain;
//
//@Configuration
//@EnableWebSecurity
//public class SecurityConfig {
//
//    @Bean
//    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
//        http
//                .csrf((AbstractHttpConfigurer::disable))
//                .headers(headers -> headers
//                        // iframe으로부터의 클릭재킹 방지 (같은 도메인만 허용)
//                        .frameOptions(HeadersConfigurer.FrameOptionsConfig::sameOrigin)
//
//                        // 브라우저에게 HTTPS만 허용하라고 지시 (Strict-Transport-Security)
//                        .httpStrictTransportSecurity(hsts -> hsts
//                                .includeSubDomains(true)
//                                .maxAgeInSeconds(31536000)
//                        )
//
//                        // 콘텐츠 보안 정책 설정 (XSS, 외부 스크립트 방지 등)
//                        .contentSecurityPolicy(csp -> csp
//                                .policyDirectives("default-src 'self'; script-src 'self'; object-src 'none';")
//                        )
//                )
//                .authorizeHttpRequests(auth -> auth
//                        .requestMatchers(
//                                "/", "/login", "/favicon.ico",
//                                "/css/**", "/js/**", "/img/**", "/webjars/**"
//                        ).permitAll()
//                        .anyRequest().authenticated()
//                );
//
//        return http.build();
//    }
//}


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;


@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/", "/pages-sign-in", "/pages-sign-up",
                                "/loginSuccess",
                                "/css/**", "/js/**", "/img/**", "/webjars/**").permitAll()
                        .anyRequest().authenticated() // 🔥 여기가 핵심
                )
                .oauth2Login(oauth -> oauth
                        .defaultSuccessUrl("/loginSuccess", true)
                )
                .logout(logout -> logout
                        .logoutSuccessUrl("/") // 로그아웃 후 이동할 페이지
                        .invalidateHttpSession(true) // 세션 무효화
                        .deleteCookies("JSESSIONID") // 쿠키 삭제
                );
        return http.build();
    }
}
