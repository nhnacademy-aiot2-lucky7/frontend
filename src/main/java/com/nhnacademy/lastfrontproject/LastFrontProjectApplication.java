package com.nhnacademy.lastfrontproject;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class LastFrontProjectApplication {

    public static void main(String[] args) {
        SpringApplication.run(LastFrontProjectApplication.class, args);
    }

}