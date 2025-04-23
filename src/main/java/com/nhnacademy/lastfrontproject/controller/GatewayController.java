package com.nhnacademy.lastfrontproject.controller;

import com.nhnacademy.lastfrontproject.dto.gateway.AdminGatewayResponse;
import com.nhnacademy.lastfrontproject.dto.gateway.GatewayResponse;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
        return "pages/member/gateway/pages-gateway";
    }

    @GetMapping("/add-gateway")
    public String showAddGateway(){
        return "pages/member/gateway/pages-add-gateway";
    }

    @GetMapping("/admin/gateway")
    public String showAdminGateway(Model model) {
        List<AdminGatewayResponse> gatewayList = List.of(
                new AdminGatewayResponse(1L, "센터동-GTW1", true, 12, "시설팀"),
                new AdminGatewayResponse(2L, "센터동-GTW2", false, 0, "시설팀"),
                new AdminGatewayResponse(3L, "본관-GTW1", true, 8, "보안팀"),
                new AdminGatewayResponse(4L, "본관-GTW2", true, 5, "보안팀"),
                new AdminGatewayResponse(5L, "신관-GTW1", false, 2, "운영팀"),
                new AdminGatewayResponse(6L, "외부-GTW1", true, 15, "운영팀")
        );

        // 부서별로 그룹핑
        Map<String, List<AdminGatewayResponse>> grouped = gatewayList.stream()
                .collect(Collectors.groupingBy(AdminGatewayResponse::getDepartment));

        model.addAttribute("gatewayGroups", grouped.entrySet().stream()
                .map(e -> new GatewayGroup(e.getKey(), e.getValue()))
                .toList());

        return "pages/admin/gateway/pages-gateway";
    }

    record GatewayGroup(String departmentName, List<AdminGatewayResponse> gateways) {}
}
