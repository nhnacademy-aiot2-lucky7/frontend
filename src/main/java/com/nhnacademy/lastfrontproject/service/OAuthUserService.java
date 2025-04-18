package com.nhnacademy.lastfrontproject.service;

import com.nhnacademy.lastfrontproject.dto.auth.RegisterRequest;

public interface OAuthUserService {
    String sendOAuthUserInfo(RegisterRequest registerRequest);
}
