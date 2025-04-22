package com.nhnacademy.lastfrontproject.controller;

import com.nhnacademy.lastfrontproject.dto.gateway.GatewayResponse;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
public class GatewayController {
    @GetMapping("/gateway")
    public String showGateway(Model model){
        List<GatewayResponse> gatewayList = List.of(
                new GatewayResponse(1L, "센터동-GTW1", true, 12),
                new GatewayResponse(2L, "센터동-GTW2", false, 0),
                new GatewayResponse(3L, "본관-GTW1", true, 8),
                new GatewayResponse(4L, "본관-GTW2", true, 5),
                new GatewayResponse(5L, "신관-GTW1", false, 2),
                new GatewayResponse(6L, "외부-GTW1", true, 15)
        );

        model.addAttribute("gateways", gatewayList);
        return "pages/gateway/pages-gateway";
    }
}
