package com.nhnacademy.lastfrontproject.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AiController {

    @GetMapping("/ai")
    public String ai(){
        return "pages/member/pages-ai";
    }

    @GetMapping("/admin/ai")
    public String aiAdmin(){
        return "pages/admin/pages-ai-adm";
    }
}
