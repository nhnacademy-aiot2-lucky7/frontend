package com.nhnacademy.lastfrontproject.dto;

public class OAuthUserRequest {
    private final String OAuthUserName;

    private final String oAuthUserEmail;

    public OAuthUserRequest(String OAuthUserName, String oAuthUserEmail) {
        this.OAuthUserName = OAuthUserName;
        this.oAuthUserEmail = oAuthUserEmail;
    }

    public String getOAuthUserName() {
        return OAuthUserName;
    }

    public String getoAuthUserEmail() {
        return oAuthUserEmail;
    }
}
