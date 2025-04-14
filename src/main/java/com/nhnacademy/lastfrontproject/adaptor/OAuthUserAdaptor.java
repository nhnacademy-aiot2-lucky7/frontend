package com.nhnacademy.lastfrontproject.adaptor;

import com.nhnacademy.lastfrontproject.dto.OAuthUserRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "gateway-service", url = "http://s2.java21.net:10232")
public interface OAuthUserAdaptor {

    @PostMapping("/api/user/info")
    String sendOAuthUserInfo(@Validated @RequestBody OAuthUserRequest oAuthUserRequest);
}
