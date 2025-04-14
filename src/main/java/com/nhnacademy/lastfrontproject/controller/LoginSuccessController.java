package com.nhnacademy.lastfrontproject.controller;

import com.nhnacademy.lastfrontproject.adaptor.OAuthUserAdaptor;
import com.nhnacademy.lastfrontproject.dto.OAuthUserRequest;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class LoginSuccessController {

    private final OAuthUserAdaptor oAuthUserAdaptor;

    public LoginSuccessController(OAuthUserAdaptor oAuthUserAdaptor) {
        this.oAuthUserAdaptor = oAuthUserAdaptor;
    }

    @GetMapping("/loginSuccess")
    public String loginSuccess(@AuthenticationPrincipal OAuth2User oAuth2User) {

        String oauth2UserName = oAuth2User.getAttribute("name");
        String oauth2UserEmail = oAuth2User.getAttribute("email");

        OAuthUserRequest userRequest = new OAuthUserRequest(oauth2UserName, oauth2UserEmail);

        oAuthUserAdaptor.sendOAuthUserInfo(userRequest);

        return "oauth-check";
    }

}
