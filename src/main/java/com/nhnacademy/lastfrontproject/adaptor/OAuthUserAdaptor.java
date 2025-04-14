package com.nhnacademy.lastfrontproject.adaptor;

import com.nhnacademy.lastfrontproject.dto.OAuthUserRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "gateway-service", url = "${feign.client.gateway-service.url}")
public interface OAuthUserAdaptor {

    @PostMapping("/register")
    ResponseEntity<String> sendOAuthUserInfo(@Validated @RequestBody OAuthUserRequest oAuthUserRequest);
}
