package com.nhnacademy.lastfrontproject.service;

import com.nhnacademy.lastfrontproject.dto.gateway.AdminGatewayResponse;
import com.nhnacademy.lastfrontproject.dto.gateway.GatewayResponse;

import java.util.List;

public interface GatewayService {

    List<GatewayResponse> getGatewayResponses(String departmentId);

    List<AdminGatewayResponse> getAdminGatewayResponses();
}
