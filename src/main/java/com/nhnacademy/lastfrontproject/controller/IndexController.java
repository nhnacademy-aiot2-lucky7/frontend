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
        return "pages/pages-profile";
    }

    @GetMapping("/helpdesk")
    public String helpdesk(){
        return "pages/pages-helpdesk";
    }

    @GetMapping("/edit-profile")
    public String editProfile(){
        return "pages/pages-profile-edit";
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
        return "pages/pages-access-control";
    }

    @GetMapping("/equipment")
    public String equipment(){
        return "pages/pages-equipment";
    }

    @GetMapping("/calamity")
    public String calamity(){
        return "pages/pages-calamity";
    }

    @GetMapping("/event")
    public String alert(){
        return "pages/pages-event";
    }

    @GetMapping("/add-sensor")
    public String addSensor(){
        return "pages/pages-add-sensor";
    }

    @GetMapping("/add-dashboard")
    public String addDashboard(){
        return "pages/pages-add-dashboard";
    }

    @GetMapping("/settings")
    public String settings(){
        return "pages/pages-settings";
    }

}