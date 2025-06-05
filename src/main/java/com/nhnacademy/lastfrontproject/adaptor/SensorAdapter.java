package com.nhnacademy.lastfrontproject.adaptor;

import com.nhnacademy.lastfrontproject.dto.sensor.SensorDataMappingIndexResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.Set;

@FeignClient(name = "sensor", url = "${feign.client.gateway-service.url}")
public interface SensorAdapter {

    @GetMapping("/sensor-data-mappings")
    ResponseEntity<Set<SensorDataMappingIndexResponse>> getSensorData();
}
