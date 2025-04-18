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
    public String profile(){
        return "pages-profile";
    }

    @GetMapping("/helpdesk")
    public String helpdesk(){
        return "pages-helpdesk";
    }

    @GetMapping("/edit-profile")
    public String editProfile(){
        return "pages-profile-edit";
    }

    @GetMapping("/server-room")
    public String serverRoom(){
        return "pages-server-room";
    }

    @GetMapping("/power-usage")
    public String powerUsage(){
        return "pages-power-usage";
    }

    @GetMapping("/access-control")
    public String accessControl(){
        return "pages-access-control";
    }

    @GetMapping("/equipment")
    public String equipment(){
        return "pages-equipment";
    }

    @GetMapping("/calamity")
    public String calamity(){
        return "pages-calamity";
    }

    @GetMapping("/alert")
    public String alert(){
        return "pages-alert";
    }

    @GetMapping("/add-sensor")
    public String addSensor(){
        return "pages-add-sensor";
    }

    @GetMapping("/add-dashboard")
    public String addDashboard(){
        return "pages-add-dashboard";
    }

    @GetMapping("/settings")
    public String settings(){
        return "pages-settings";
    }

}