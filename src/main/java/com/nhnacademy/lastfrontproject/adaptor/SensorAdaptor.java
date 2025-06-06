package com.nhnacademy.lastfrontproject.adaptor;

import com.nhnacademy.lastfrontproject.dto.sensor.DataTypeInfoResponse;
import com.nhnacademy.lastfrontproject.dto.sensor.SensorDataMappingIndexResponse;
import com.nhnacademy.lastfrontproject.dto.sensor.SensorDataDetailResponse;
import com.nhnacademy.lastfrontproject.dto.sensor.ThresholdBoundResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.Set;

@FeignClient(name = "sensor", url = "${feign.client.gateway-service.url}")
public interface SensorAdaptor {

    @GetMapping("/api/sensor-data-mappings")
    ResponseEntity<Set<SensorDataMappingIndexResponse>> getSensorData();

    @GetMapping("/api/threshold-histories/gateway-id/{gateway-id}/sensor-id/{sensor-id}/type-en-name/{type-en-name}")
    ResponseEntity<ThresholdBoundResponse> getSensorBound(
            @PathVariable("gateway-id") Long gatewayId,
            @PathVariable("sensor-id") String sensorId,
            @PathVariable("type-en-name") String typeEnName
    );

    @GetMapping("/api/data-types/{typeEnName}")
    ResponseEntity<DataTypeInfoResponse> getDataTypeKrName(@PathVariable("typeEnName") String typeEnName) ;

    @GetMapping("/api/sensor-data-mappings/gateway-id/{gateway-id}/sensors")
    ResponseEntity<List<SensorDataDetailResponse>> getSensorDataByGatewayId(
            @PathVariable("gateway-id") Long gatewayId);
    }
