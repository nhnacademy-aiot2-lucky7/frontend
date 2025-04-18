package com.nhnacademy.lastfrontproject;

import io.github.cdimascio.dotenv.Dotenv;
import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Configuration;

@Configuration
public class EnvLoader {

    @PostConstruct
    public void loadEnv() {
        Dotenv dotenv = Dotenv.configure()
                .directory("./") // .env가 위치한 디렉토리
                .ignoreIfMalformed()
                .ignoreIfMissing()
                .load();

        System.setProperty("OAUTH_CLIENT_ID", dotenv.get("OAUTH_CLIENT_ID"));
        System.setProperty("OAUTH_CLIENT_SECRET", dotenv.get("OAUTH_CLIENT_SECRET"));
    }
}
