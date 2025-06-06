package com.nhnacademy.lastfrontproject.adaptor;

import com.nhnacademy.lastfrontproject.dto.ImageResponse;
import com.nhnacademy.lastfrontproject.dto.auth.LoginRequest;
import com.nhnacademy.lastfrontproject.dto.auth.RegisterRequest;
import com.nhnacademy.lastfrontproject.dto.user.UserResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@FeignClient(name = "auth", url = "${feign.client.gateway-service.url}")
public interface AuthAdaptor {
    @PostMapping("/api/auth/register")
    ResponseEntity<String> register(@RequestBody RegisterRequest registerRequest);

    @PostMapping("/api/auth/login")
    void login(@RequestBody LoginRequest loginRequest);

    @GetMapping("/api/users/{userEmail}")
    Boolean existsByEmail(@PathVariable String userEmail);

    @PostMapping("/api/auth/social/signIn")
    ResponseEntity<Void> socialSignIn(@RequestBody String email, @RequestHeader("Authorization") String accessTokenHeader);

    @GetMapping("/api/users/me")
    ResponseEntity<UserResponse> getMyInfo();

    @GetMapping("/api/admin/users")
    List<UserResponse> getAllMembers();

    @PutMapping("/api/admin/users/roles")
    void updateMemberRole(@RequestBody Map<String, String> request);

    @DeleteMapping("/api/admin/users/{userEmail}")
    void deleteMember(@PathVariable("userEmail") String userEmail);

    @GetMapping("/api/images/{userEmail}")
    ResponseEntity<ImageResponse> getImage(@PathVariable String userEmail);
}
