package com.nhnacademy.lastfrontproject.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;
import java.util.Map;

@RestController
public class AuthRestController {
    @PostMapping("/set-token-cookie")
    public ResponseEntity<Void> setTokenCookie(@RequestBody Map<String, String> body) {
        String token = body.get("token");

        ResponseCookie cookie = ResponseCookie.from("accessToken", token)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(Duration.ofHours(1))
                .sameSite("None")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .build();
    }
}
