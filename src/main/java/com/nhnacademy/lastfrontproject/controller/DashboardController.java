package com.nhnacademy.lastfrontproject.controller;

import com.nhnacademy.lastfrontproject.service.DashboardService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.List;

@Controller
public class DashboardController {
    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService){
        this.dashboardService = dashboardService;
    }

    @GetMapping
    public List<String> getDashboardName(
            @RequestHeader("X-User-Id") String encryptedUserId
    ){
        List<String> dashboardNames = dashboardService.getDashboardName(encryptedUserId);
        return dashboardNames;
    }
}
