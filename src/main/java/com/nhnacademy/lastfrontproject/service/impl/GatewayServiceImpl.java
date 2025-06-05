package com.nhnacademy.lastfrontproject.service.impl;

import com.nhnacademy.lastfrontproject.adaptor.GatewayAdapter;
import com.nhnacademy.lastfrontproject.adaptor.SensorAdapter;
import com.nhnacademy.lastfrontproject.dto.gateway.AdminGatewayResponse;
import com.nhnacademy.lastfrontproject.dto.gateway.GatewayInfoResponse;
import com.nhnacademy.lastfrontproject.dto.gateway.GatewayResponse;
import com.nhnacademy.lastfrontproject.dto.sensor.SensorDataMappingWebResponse;
import com.nhnacademy.lastfrontproject.service.GatewayService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class GatewayServiceImpl implements GatewayService {

    private final GatewayAdapter gatewayAdapter;

    private final SensorAdapter sensorAdapter;

    /// TODO: 4xx ~ 5xx 예외처리 추가
    private List<GatewayInfoResponse> getGatewayList(String departmentId) {
        ResponseEntity<List<GatewayInfoResponse>> responseEntity =
                gatewayAdapter.getGateways(departmentId);

        return responseEntity.getStatusCode().is2xxSuccessful() ?
                responseEntity.getBody()
                : List.of();
    }

    /// TODO: 게이트웨이에 속한 센서의 카운트를 알려면, 센서 서비스와의 상호작용 하는 기능이 필요합니다.
    private int getGatewayToSensorCount(long gatewayId) {
        ResponseEntity<List<SensorDataMappingWebResponse>> responseEntity =
                sensorAdapter.getSensorsByGatewayId(gatewayId);

        return responseEntity.getStatusCode().is2xxSuccessful() ?
                Objects.nonNull(responseEntity.getBody()) ?
                        responseEntity.getBody().size()
                        : 0
                : 0;
    }

    @Override
    public List<GatewayResponse> getGatewayResponses(String departmentId) {
        Map<Long, Integer> gatewayToSensorCount = new HashMap<>();
        List<GatewayResponse> result = new ArrayList<>();

        for (GatewayInfoResponse response : getGatewayList(departmentId)) {
            long gatewayId = response.getGatewayId();
            if (!gatewayToSensorCount.containsKey(response.getGatewayId())) {
                gatewayToSensorCount.put(gatewayId, getGatewayToSensorCount(gatewayId));
            }
            result.add(
                    new GatewayResponse(
                            response.getGatewayId(),
                            response.getGatewayName(),
                            response.getThresholdStatus(),
                            gatewayToSensorCount.get(gatewayId)
                    )
            );
        }
        return result;
    }

    /// TODO: departmentId가 아닌, 모든 gateway 데이터 및 모든 sensor 정보들을 연계해서 가져와야 합니다.
    @Override
    public List<AdminGatewayResponse> getAdminGatewayResponses() {
        Map<Long, Integer> gatewayToSensorCount = new HashMap<>();
        List<AdminGatewayResponse> result = new ArrayList<>();

        for (GatewayInfoResponse response : getGatewayList("nhnacademy")) {
            long gatewayId = response.getGatewayId();
            if (!gatewayToSensorCount.containsKey(response.getGatewayId())) {
                gatewayToSensorCount.put(gatewayId, getGatewayToSensorCount(gatewayId));
            }
            result.add(
                    new AdminGatewayResponse(
                            response.getGatewayId(),
                            response.getGatewayName(),
                            response.getThresholdStatus(),
                            gatewayToSensorCount.get(gatewayId),
                            "nhnacademy"
                    )
            );
        }
        return result;
    }
}
