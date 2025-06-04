package com.nhnacademy.lastfrontproject.adaptor;

import com.nhnacademy.lastfrontproject.dto.ImageResponse;
import com.nhnacademy.lastfrontproject.dto.auth.LoginRequest;
import com.nhnacademy.lastfrontproject.dto.auth.RegisterRequest;
import com.nhnacademy.lastfrontproject.dto.user.UserResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "auth", url = "${feign.client.gateway-service.url}")
public interface AuthAdaptor {
    @PostMapping("/auth/register")
    ResponseEntity<String> register(@RequestBody RegisterRequest registerRequest);

    @PostMapping("/auth/login")
    void login(@RequestBody LoginRequest loginRequest);

    @GetMapping("/users/{userEmail}")
    Boolean existsByEmail(@PathVariable String userEmail);

    @PostMapping("/auth/social/signIn")
    ResponseEntity<Void> socialSignIn(@RequestBody String email, @RequestHeader("Authorization") String accessTokenHeader);

    @GetMapping("/users/me")
    ResponseEntity<UserResponse> getMyInfo();

    @GetMapping("/images/{userEmail}")
    ResponseEntity<ImageResponse> getImage(@PathVariable String userEmail);

}
