package com.nhnacademy.lastfrontproject.controller;

import com.nhnacademy.lastfrontproject.dto.user.UserResponse;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;

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

    @GetMapping("/helpdesk")
    public String helpdesk(){
        return "pages/member/pages-helpdesk";
    }

//    @GetMapping("/settings")
//    public String settings(){
//        return "pages/member/pages-settings";
//    }

    @GetMapping("/privacy")
    public String privacy(){
        return "pages/member/pages-privacy";
    }

    @GetMapping("/server-room")
    public String serverRoom(){
        return "pages/pages-server-room";
    }
    @GetMapping("/power-usage")
    public String powerUsage(){
        return "pages/pages-power-usage";
    }

    @GetMapping("/access-control")
    public String accessControl(){
        return "pages/member/pages-access-control";
    }

    @GetMapping("/equipment")
    public String equipment(){
        return "pages/pages-equipment";
    }

    @GetMapping("/calamity")
    public String calamity(){
        return "pages/pages-calamity";
    }

    @GetMapping("/management")
    public String management(@ModelAttribute("user") UserResponse user) {
        if (user == null) {
            return "redirect:/sign-in";
        }

        boolean isAdmin = "ROLE_ADMIN".equalsIgnoreCase(user.getUserRole());

        if (isAdmin) {
            return "pages/admin/dashboard/pages-management";
        } else {
            return "pages/member/dashboard/pages-dashboard-info";
        }
    }
}