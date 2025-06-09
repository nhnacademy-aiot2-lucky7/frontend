package com.nhnacademy.lastfrontproject.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AiAnalyzeController {

    @GetMapping("/ai-result")
    public String ai(){
        return "pages/member/pages-ai-result";
    }

    @GetMapping("/pages/admin/ai-result")
    public String aiAdmin(){
        return "pages/admin/pages-ai-result-adm";
    }

    @GetMapping("/correlation-analysis")
    public String correlationAnalysis() {
        return "pages/ai-risk-analyze";
    }

    @GetMapping("/ai-main")
    public String aiMain() {
        return "index";
    }
}
