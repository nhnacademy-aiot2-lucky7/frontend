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

    @GetMapping("/profile")
    public String profile(){
        return "pages/member/pages-profile";
    }

    @GetMapping("/helpdesk")
    public String helpdesk(){
        return "pages/member/pages-helpdesk";
    }

    @GetMapping("/edit-profile")
    public String editProfile(){
        return "pages/member/pages-profile-edit";
    }

    @GetMapping("/server-room")
    public String serverRoom(){
        return "pages/member/pages-server-room";
    }

    @GetMapping("/power-usage")
    public String powerUsage(){
        return "pages/member/pages-power-usage";
    }

    @GetMapping("/access-control")
    public String accessControl(){
        return "pages/member/pages-access-control";
    }

    @GetMapping("/equipment")
    public String equipment(){
        return "pages/member/pages-equipment";
    }

    @GetMapping("/calamity")
    public String calamity(){
        return "pages/member/pages-calamity";
    }

    @GetMapping("/add-dashboard")
    public String addDashboard(){
        return "pages/member/pages-add-dashboard";
    }

    @GetMapping("/settings")
    public String settings(){
        return "pages/member/pages-settings";
    }

    @GetMapping("/privacy")
    public String privacy(){
        return "pages/member/pages-privacy";
    }

}