package com.nhnacademy.lastfrontproject;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.oauth2.client.servlet.OAuth2ClientAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication
        // Security를 api로 옮겨도 계속 security 로그인이 떠서 설정함
        (exclude = { SecurityAutoConfiguration.class, OAuth2ClientAutoConfiguration.class })
public class LastFrontProjectApplication {

    public static void main(String[] args) {
        SpringApplication.run(LastFrontProjectApplication.class, args);
    }

}