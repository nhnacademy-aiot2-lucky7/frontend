package com.nhnacademy.lastfrontproject.service.impl;

import com.nhnacademy.lastfrontproject.adaptor.CorrelationAdaptor;
import com.nhnacademy.lastfrontproject.adaptor.GatewayAdaptor;
import com.nhnacademy.lastfrontproject.adaptor.SensorAdapter;
import com.nhnacademy.lastfrontproject.dto.analysis.AnalysisRequest;
import com.nhnacademy.lastfrontproject.dto.analysis.AnalysisResponse;
import com.nhnacademy.lastfrontproject.dto.gateway.GatewayInfoResponse;
import com.nhnacademy.lastfrontproject.dto.sensor.SensorDataMappingWebResponse;
import com.nhnacademy.lastfrontproject.service.CorrelationAnalysisService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CorrelationAnalysisServiceImpl implements CorrelationAnalysisService {

    private final GatewayAdaptor gatewayAdaptor;
    private final SensorAdapter sensorAdapter;
    private final CorrelationAdaptor correlationAdaptor;

    @Override
    public List<GatewayInfoResponse> getGatewayListByDepartmentId(String departmentId) {
        ResponseEntity<List<GatewayInfoResponse>> gatewayList = gatewayAdaptor.getGatewayListByDepartmentId(departmentId);
        return gatewayList.getBody();
    }

    @Override
    public List<SensorDataMappingWebResponse> getSensorListByGatewayId(Long gatewayId) {
        ResponseEntity<List<SensorDataMappingWebResponse>> sensorList = sensorAdapter.getSensorDataByGatewayId(gatewayId);
        return sensorList.getBody();
    }

    @Override
    public AnalysisResponse requestCorrelationAnalysis(AnalysisRequest analysisRequest, String encryptedEmail) {
        ResponseEntity<AnalysisResponse> analysisResult = correlationAdaptor.analyzeCorrelation(analysisRequest, encryptedEmail);
        return analysisResult.getBody();
    }
}