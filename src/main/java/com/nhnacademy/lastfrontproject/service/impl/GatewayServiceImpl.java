package com.nhnacademy.lastfrontproject.service.impl;

import com.nhnacademy.lastfrontproject.adaptor.GatewayAdapter;
import com.nhnacademy.lastfrontproject.dto.gateway.AdminGatewayResponse;
import com.nhnacademy.lastfrontproject.dto.gateway.GatewayResponse;
import com.nhnacademy.lastfrontproject.service.GatewayService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class GatewayServiceImpl implements GatewayService {

    private final GatewayAdapter gatewayAdapter;

    @Override
    public List<GatewayResponse> getGatewaySummaryList(String departmentId) {
        try {
            List<GatewayResponse> response = gatewayAdapter.getGatewaySummaries(departmentId);
            log.info("gateway summary 조회 완료!! 개수:{}", response.size());
            return response;
        } catch (Exception e) {
            log.warn("gateway summary 조회 실패: {}", departmentId, e);
            return List.of();
        }
    }

    @Override
    public List<AdminGatewayResponse> getAdminGatewaySummaryList() {
        try {
            return gatewayAdapter.getGatewayAdminSummaries();
        } catch (Exception e) {
            log.warn("gateway summary 조회 실패");
            return List.of();
        }
    }
}
