package com.nhnacademy.lastfrontproject.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/fragments")
public class FragmentController {

    @GetMapping("/sidebar_adm")
    public String getAdminSidebar() {
        return "fragments/sidebar_adm";
    }

    @GetMapping("/sidebar_user")
    public String getUserSidebar() {
        return "fragments/sidebar";
    }

    @GetMapping("/sidebar_guest")
    public String getGuestSidebar() {
        return "fragments/sidebar_guest";
    }

    @GetMapping("/navbar")
    public String getNavbar() {
        return "fragments/navbar";
    }

    @GetMapping("/footer")
    public String getFooter() {
        return "fragments/footer";
    }
}

