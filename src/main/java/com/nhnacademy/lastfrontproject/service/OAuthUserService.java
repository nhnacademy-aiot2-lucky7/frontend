package com.nhnacademy.lastfrontproject.service;

import com.nhnacademy.lastfrontproject.dto.OAuthUserRequest;

public interface OAuthUserService {
    String sendOAuthUserInfo(OAuthUserRequest oAuthUserRequest);
}
