package com.nhnacademy.lastfrontproject.controller;

import com.nhnacademy.lastfrontproject.dto.OAuthUserRequest;
import com.nhnacademy.lastfrontproject.service.OAuthUserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class LoginSuccessController {

    private final OAuthUserService oAuthUserService;

    public LoginSuccessController(OAuthUserService oAuthUserService) {
        this.oAuthUserService = oAuthUserService;
    }

    @GetMapping("/loginSuccess")
    public String loginSuccess(@AuthenticationPrincipal OAuth2User oAuth2User, HttpServletResponse response) {

        String name = oAuth2User.getAttribute("name");
        String email = oAuth2User.getAttribute("email");

        OAuthUserRequest userRequest = new OAuthUserRequest(name, email);

        String jwtToken = oAuthUserService.sendOAuthUserInfo(userRequest);

        Cookie jwtCookie = new Cookie("jwtToken", jwtToken);
        jwtCookie.setHttpOnly(true);
        jwtCookie.setPath("/");
        jwtCookie.setMaxAge(60 * 60); // 1시간
        response.addCookie(jwtCookie);

        return "redirect:/index";
    }

}
