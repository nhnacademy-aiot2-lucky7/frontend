package com.nhnacademy.lastfrontproject.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AiAnalyzeController {

    @GetMapping("/ai-analyze")
    public String ai(){
        return "pages/member/pages-ai-analyze";
    }

    @GetMapping("/admin/ai-analyze")
    public String aiAdmin(){
        return "pages/admin/pages-ai-analyze-adm";
    }
}
