package com.nhnacademy.lastfrontproject.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class IndexController {
    public String index(){
        return "index";
    }

    @GetMapping("/loginSuccess")
    public String googleCallBack(@AuthenticationPrincipal OAuth2User oAuth2User, Model model){

        model.addAttribute("userAttributes", oAuth2User.getAttributes());

        return "oauth-check";
    }

}
