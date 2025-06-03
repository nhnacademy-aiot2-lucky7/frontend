package com.nhnacademy.lastfrontproject.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class UserController {

    @GetMapping("/profile")
    public String profile() {
        return "pages/member/pages-profile";
    }

    @GetMapping("/edit-profile")
    public String editProfile() {
        return "pages/member/pages-profile-edit";
    }
}
