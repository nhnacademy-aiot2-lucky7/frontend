package com.nhnacademy.lastfrontproject.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class IndexController {
    public String index(){
        return "index";
    }

    @GetMapping("/loginSuccess")
    public String googleCallBack(){
        return "oauth-check";
    }

}
