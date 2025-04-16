package com.nhnacademy.lastfrontproject.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class IndexController {
    @GetMapping("/")
    public String welcome(){
        return "welcome";
    }

    @GetMapping("/dashboard")
    public String dashboard(){
        return "index";
    }

    @GetMapping("/sidebar")
    public String sidebar(){
        return "sidebar";
    }

    @GetMapping("/profile")
    public String empty(){
        return "pages-profile";
    }

    @GetMapping("/helpdesk")
    public String helpdesk(){
        return "pages-helpdesk";
    }

    @GetMapping("/edit_profile")
    public String editprofile(){
        return "pages-profile-edit";
    }

}