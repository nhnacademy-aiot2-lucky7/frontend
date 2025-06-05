package com.nhnacademy.lastfrontproject.service;

import com.nhnacademy.lastfrontproject.dto.gateway.AdminGatewayResponse;
import com.nhnacademy.lastfrontproject.dto.gateway.GatewayResponse;

import java.util.List;

public interface GatewayService {

    List<GatewayResponse> getGatewaySummaryList(String departmentId);

    List<AdminGatewayResponse> getAdminGatewaySummaryList();
}
