package com.nhnacademy.lastfrontproject.adaptor;

import com.nhnacademy.lastfrontproject.dto.auth.LoginRequest;
import com.nhnacademy.lastfrontproject.dto.auth.RegisterRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "auth", url = "${external.auth-service.url}")
public interface AuthAdaptor {
    @PostMapping("/auth/register")
    void register(@RequestBody RegisterRequest registerRequest);

    @PostMapping("/auth/login")
    void login(@RequestBody LoginRequest loginRequest);
}
