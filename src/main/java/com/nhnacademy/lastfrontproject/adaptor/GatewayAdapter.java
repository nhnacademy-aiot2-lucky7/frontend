package com.nhnacademy.lastfrontproject.adaptor;

import com.nhnacademy.lastfrontproject.dto.gateway.GatewayInfoResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(
        name = "gateway-service",
        url = "${feign.client.gateway-service.url}"
)
public interface GatewayAdapter {

    @GetMapping("/department-id/{department-id}")
    ResponseEntity<List<GatewayInfoResponse>> getGateways(
            @PathVariable("department-id") String departmentId
    );
}
