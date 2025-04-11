package com.nhnacademy.lastfrontproject.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class IndexController {
    @GetMapping("/")
    public String index(){
        return "index";
    }

    @GetMapping("/pages-sign-in")
    public String signIn() {
        return "pages-sign-in";
    }

//    @GetMapping("/api/member/oauth-callback/googleplus/")
//    public String googleCallBack(@RequestParam String code, Model model) {
//    model.addAttribute("code", code);

    @GetMapping("/loginSuccess")
    public String googleCallBack(@AuthenticationPrincipal OAuth2User oAuth2User, Model model){
//        model.addAttribute("sub", oAuth2User.getAttribute("sub"));
//        model.addAttribute("name", oAuth2User.getAttribute("name"));
//        model.addAttribute("given_name", oAuth2User.getAttribute("given_name"));
//        model.addAttribute("family_name", oAuth2User.getAttribute("family_name"));
//        model.addAttribute("picture", oAuth2User.getAttribute("picture"));
//        model.addAttribute("email", oAuth2User.getAttribute("email"));
//        model.addAttribute("email_verified", oAuth2User.getAttribute("email_verified"));
//        model.addAttribute("locale", oAuth2User.getAttribute("locale"));

        model.addAttribute("userAttributes", oAuth2User.getAttributes());

        return "oauth-check";
    }

}
