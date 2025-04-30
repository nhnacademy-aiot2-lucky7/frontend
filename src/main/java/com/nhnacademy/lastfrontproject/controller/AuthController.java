package com.nhnacademy.lastfrontproject.controller;

import com.nhnacademy.lastfrontproject.adaptor.AuthAdaptor;
import com.nhnacademy.lastfrontproject.dto.auth.LoginRequest;
import com.nhnacademy.lastfrontproject.dto.auth.RegisterRequest;
import com.nhnacademy.lastfrontproject.service.OAuthUserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.UUID;

@Controller
public class AuthController {
    private final AuthAdaptor authAdaptor;
    private final OAuthUserService oAuthUserService;

    public AuthController(AuthAdaptor authAdaptor, OAuthUserService oAuthUserService){
        this.authAdaptor = authAdaptor;
        this.oAuthUserService = oAuthUserService;
    }

    @GetMapping("/sign-in")
    public String signInPage(){
        return "pages/member/pages-sign-in";
    }

    @GetMapping("/sign-up")
    public String signUnPage(){
        return "pages/member/pages-sign-up";
    }

    @PostMapping("/sign-in")
    public String signIn(@ModelAttribute LoginRequest loginRequest){
        try {
            authAdaptor.login(loginRequest);
            return "redirect:/dashboard";
        } catch (Exception e) {
            return "pages-sign-in";
        }
    }

    @PostMapping("/sign-up")
    public String signUp(@ModelAttribute RegisterRequest registerRequest){
        try {
            authAdaptor.register(registerRequest);
            return "redirect:/sign-in";
        } catch (Exception e) {
            return "pages-sign-up";
        }
    }

    @GetMapping("/loginSuccess")
    public String loginSuccess(@AuthenticationPrincipal OAuth2User oAuth2User, HttpServletResponse response) {

        String name = oAuth2User.getAttribute("name");
        String email = oAuth2User.getAttribute("email");

        RegisterRequest registerRequest = RegisterRequest.ofNewRegisterRequest(email, name, UUID.randomUUID().toString());

        String jwtToken = oAuthUserService.sendOAuthUserInfo(registerRequest);

        Cookie jwtCookie = new Cookie("jwtToken", jwtToken);
        jwtCookie.setHttpOnly(true);
        jwtCookie.setPath("/");
        jwtCookie.setMaxAge(60 * 60); // 1시간
        response.addCookie(jwtCookie);

        return "redirect:/index";
    }
}
