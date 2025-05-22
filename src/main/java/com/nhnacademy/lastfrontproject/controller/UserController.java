package com.nhnacademy.lastfrontproject.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nhnacademy.lastfrontproject.dto.user.UserResponse;
import com.nhnacademy.lastfrontproject.util.CookieUtil;
import com.nhnacademy.lastfrontproject.util.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class UserController {

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/profile")
    public String profile(Model model, HttpServletRequest request) {
        String accessToken = CookieUtil.getAccessToken(request);
        if (accessToken == null) {
            return "redirect:/sign-in";
        }
        UserResponse user = jwtUtil.fetchUser(accessToken);
        model.addAttribute("user", user);
        return "pages/member/pages-profile";
    }

    @GetMapping("/edit-profile")
    public String editProfile(Model model, HttpServletRequest request) {
        String accessToken = CookieUtil.getAccessToken(request);
        if (accessToken == null) {
            return "redirect:/sign-in";
        }
        UserResponse user = jwtUtil.fetchUser(accessToken);
        model.addAttribute("user", user);
        return "pages/member/pages-profile-edit";
    }

}
