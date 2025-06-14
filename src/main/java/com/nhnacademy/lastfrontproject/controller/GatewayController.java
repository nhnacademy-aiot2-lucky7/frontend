package com.nhnacademy.lastfrontproject.controller;

import com.nhnacademy.lastfrontproject.dto.gateway.AdminGatewayResponse;
import com.nhnacademy.lastfrontproject.dto.gateway.GatewayDetailResponse;
import com.nhnacademy.lastfrontproject.dto.gateway.SensorResponse;
import com.nhnacademy.lastfrontproject.service.GatewayService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class GatewayController {

    private final GatewayService gatewayService;

    @GetMapping("/gateway")
    public String showGateway(Model model) {
//        List<GatewayResponse> gateways =
////                gatewayService.getGatewaySummaryList(DepartmentContextHolder.getDepartmentId());
//
//        model.addAttribute("gateways", gateways);
        return "pages/member/gateway/pages-gateway";
    }

    @GetMapping("/add-gateway")
    public String showAddGateway() {
        return "pages/member/gateway/pages-add-gateway";
    }

    @GetMapping("/pages/admin/gateway")
    public String showAdminGateway(Model model) {
        List<AdminGatewayResponse> gateways =
                gatewayService.getAdminGatewaySummaryList();

        model.addAttribute("gateways", gateways);
        return "pages/admin/gateway/pages-gateway";
    }

    @GetMapping("/gateway/{id}")
    public String showDetailGateway(@PathVariable("id") Long id, Model model) {
        List<GatewayDetailResponse> gatewayDetails = List.of(
                new GatewayDetailResponse(1L, "센터동-GTW1", true, 12, "MQTT", "192.168.0.1", 1883, "client-center-1", "센터동의 메인 게이트웨이"),
                new GatewayDetailResponse(2L, "센터동-GTW2", false, 0, "MQTT", "192.168.0.2", 1883, "client-center-2", "예비용 센터 게이트웨이"),
                new GatewayDetailResponse(3L, "본관-GTW1", true, 8, "MQTT", "192.168.1.1", 1883, "client-main-1", "본관 1층 커버"),
                new GatewayDetailResponse(4L, "본관-GTW2", true, 5, "MQTT", "192.168.1.2", 1883, "client-main-2", "본관 2층 커버"),
                new GatewayDetailResponse(5L, "신관-GTW1", false, 2, "MQTT", "192.168.2.1", 1883, "client-new-1", "신관 게이트웨이"),
                new GatewayDetailResponse(6L, "외부-GTW1", true, 15, "MQTT", "10.0.0.1", 1883, "client-out-1", "외부 환경 센서 수집")
        );

        List<SensorResponse> sensors = List.of(
                new SensorResponse(1L, "온도", "서버실 1층", "Temperature-Module-A"),
                new SensorResponse(2L, "습도", "서버실 1층", "Humidity-Module-A"),
                new SensorResponse(3L, "조도", "복도 중앙", "Light-Module-B"),
                new SensorResponse(4L, "연기 감지", "주방 천장", "Smoke-Sensor-X"),
                new SensorResponse(5L, "진동", "기계실 바닥", "Vibration-Sensor-Z"),
                new SensorResponse(6L, "가스", "보일러실", "Gas-Sensor-MQ2")
        );

        GatewayDetailResponse gateway = gatewayDetails.stream()
                .filter(g -> g.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "게이트웨이 없음"));

        model.addAttribute("gateway", gateway);
        model.addAttribute("sensors", sensors);

        return "pages/member/gateway/pages-detail-gateway";
    }

    @GetMapping("/delete-gateway")
    public String deleteGateway() {
        return "redirect:/gateway";
    }

    record GatewayGroup(String departmentName, List<AdminGatewayResponse> gateways) {
    }
}
