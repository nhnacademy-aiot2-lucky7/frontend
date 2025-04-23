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

    @GetMapping("/helpdesk")
    public String helpdesk(){
        return "pages/pages-helpdesk";
    }

//    @GetMapping("/profile")
//    public String profile(){
//        return "pages/pages-profile";
//    }
//
//    @GetMapping("/edit-profile")
//    public String editProfile(){
//        return "pages/pages-profile-edit";
//    }

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

    @GetMapping("/privacy")
    public String privacy(){
        return "pages/pages-privacy";
    }

    @GetMapping("/server-room-info")
    public String serverRoomInfo(){
        return "pages/pages-server-room-info";
    }

    @GetMapping("/power-usage_info")
    public String powerUsageInfo(){
        return "pages/pages-power-usage-info";
    }

    @GetMapping("/access-control-info")
    public String accessControlInfo(){
        return "pages/pages-access-control";
    }

    @GetMapping("/equipment-info")
    public String equipmentInfo(){
        return "pages/pages-equipment-info";
    }

    @GetMapping("/calamity-info")
    public String calamityInfo(){
        return "pages/pages-calamity-info";
    }

}