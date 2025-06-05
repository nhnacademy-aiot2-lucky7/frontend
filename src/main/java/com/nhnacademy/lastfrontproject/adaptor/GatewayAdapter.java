package com.nhnacademy.lastfrontproject.adaptor;

import com.nhnacademy.lastfrontproject.dto.gateway.AdminGatewayResponse;
import com.nhnacademy.lastfrontproject.dto.gateway.GatewayResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@FeignClient(
        name = "gateway-service",
        url = "${feign.client.gateway-service.url}"
)
@RequestMapping("/api")
public interface GatewayAdapter {
    @GetMapping("/gateways/department/{departmentId}")
    List<GatewayResponse> getGatewaySummaries(
            @PathVariable String departmentId
    );

    @GetMapping("/admin/gateways")
    List<AdminGatewayResponse> getGatewayAdminSummaries();
}
