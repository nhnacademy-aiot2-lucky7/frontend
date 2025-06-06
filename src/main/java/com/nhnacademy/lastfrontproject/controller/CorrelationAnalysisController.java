package com.nhnacademy.lastfrontproject.controller;

import com.nhnacademy.lastfrontproject.dto.analysis.AnalysisRequest;
import com.nhnacademy.lastfrontproject.dto.analysis.AnalysisResponse;
import com.nhnacademy.lastfrontproject.dto.gateway.GatewaySummaryResponse;
import com.nhnacademy.lastfrontproject.dto.sensor.SensorDataDetailResponse;
import com.nhnacademy.lastfrontproject.service.CorrelationAnalysisService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class CorrelationAnalysisController {

    private final CorrelationAnalysisService correlationAnalysisService;

    @GetMapping("/gateway-list/{department-id}")
    public ResponseEntity<List<GatewaySummaryResponse>> getGateways(@PathVariable("department-id") String departmentId) {
        List<GatewaySummaryResponse> gateways = correlationAnalysisService.getGatewayListByDepartmentId(departmentId);

        return ResponseEntity.ok(gateways);
    }

    @GetMapping("/sensor-list/{gateway-id}")
    public ResponseEntity<List<SensorDataDetailResponse>> getSensors(@PathVariable("gateway-id") Long gatewayId) {
        List<SensorDataDetailResponse> sensors = correlationAnalysisService.getSensorListByGatewayId(gatewayId);

        return ResponseEntity.ok(sensors);
    }

    @PostMapping("/correlation-analysis-start")
    public ResponseEntity<AnalysisResponse> correlationAnalysisStart(
            @RequestBody AnalysisRequest request,
            @RequestHeader("X-User-Id") String encryptedEmail
    ) {
        AnalysisResponse result = correlationAnalysisService.requestCorrelationAnalysis(request, encryptedEmail);

        return ResponseEntity.ok(result);
    }
}