package com.nhnacademy.lastfrontproject.service;

import com.nhnacademy.lastfrontproject.dto.analysis.AnalysisRequest;
import com.nhnacademy.lastfrontproject.dto.analysis.AnalysisResponse;
import com.nhnacademy.lastfrontproject.dto.gateway.GatewaySummaryResponse;
import com.nhnacademy.lastfrontproject.dto.sensor.SensorDataMappingWebResponse;

import java.util.List;

public interface CorrelationAnalysisService {

    List<GatewaySummaryResponse> getGatewayListByDepartmentId(String departmentId);

    List<SensorDataMappingWebResponse> getSensorListByGatewayId(Long gatewayId);

    AnalysisResponse requestCorrelationAnalysis(AnalysisRequest analysisRequest, String encryptedEmail);

}