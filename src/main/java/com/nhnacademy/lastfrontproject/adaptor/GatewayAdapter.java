package com.nhnacademy.lastfrontproject.adaptor;

import com.nhnacademy.lastfrontproject.dto.gateway.AdminGatewayResponse;
import com.nhnacademy.lastfrontproject.dto.gateway.GatewayResponse;
import com.nhnacademy.lastfrontproject.dto.gateway.GatewaySummaryResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@FeignClient(
        name = "gateway-service",
        url = "${feign.client.gateway-service.url}"
)
public interface GatewayAdapter {
    @GetMapping("/api/gateways")
    List<GatewayResponse> getGatewaySummaries(
            @RequestBody String departmentId
    );

    @GetMapping("/api/admin/gateways")
    List<AdminGatewayResponse> getGatewayAdminSummaries();

    @GetMapping("/api/gateways/department/{department-id}")
    ResponseEntity<List<GatewaySummaryResponse>> getGatewayListByDepartmentId(
            @PathVariable("department-id") String departmentId);
}
