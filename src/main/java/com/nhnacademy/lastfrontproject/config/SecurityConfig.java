package com.nhnacademy.lastfrontproject.config;


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
                        .requestMatchers("/", "/sign-in", "/sign-up",
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
