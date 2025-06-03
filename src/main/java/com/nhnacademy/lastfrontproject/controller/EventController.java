package com.nhnacademy.lastfrontproject.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class EventController {
    @GetMapping("/admin/event")
    public String showAdminEvent() {
        return "pages/admin/pages-event";
    }

    @GetMapping("/event")
    public String showEvent() {
        return "pages/member/pages-event";
    }
}
