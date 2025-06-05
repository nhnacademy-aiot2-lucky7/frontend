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

@FeignClient(name = "auth", url = "https://luckyseven.live")
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

    @GetMapping("/admin/users")
    List<UserResponse> getAllMembers();

    @PutMapping("/admin/users/roles")
    void updateMemberRole(@RequestBody Map<String, String> request);

    @DeleteMapping("/admin/users/{userEmail}")
    void deleteMember(@PathVariable("userEmail") String userEmail);

    @GetMapping("/images/{userEmail}")
    ResponseEntity<ImageResponse> getImage(@PathVariable String userEmail);
}
