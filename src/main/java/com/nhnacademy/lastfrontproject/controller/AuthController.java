package com.nhnacademy.lastfrontproject.controller;

import com.nhnacademy.lastfrontproject.adaptor.AuthAdaptor;
import com.nhnacademy.lastfrontproject.dto.auth.LoginRequest;
import com.nhnacademy.lastfrontproject.dto.auth.RegisterRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class AuthController {
    private final AuthAdaptor authAdaptor;

    public AuthController(AuthAdaptor authAdaptor){
        this.authAdaptor = authAdaptor;
    }

    @GetMapping("/sign-in")
    public String signInPage(){
        return "pages-sign-in";
    }

    @GetMapping("/sign-up")
    public String signUnPage(){
        return "pages-sign-up";
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
}
