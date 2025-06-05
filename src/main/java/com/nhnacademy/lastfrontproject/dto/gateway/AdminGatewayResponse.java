package com.nhnacademy.lastfrontproject.dto.gateway;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class AdminGatewayResponse {
    @JsonProperty("gateway_id")
    private Long id;
    @JsonProperty("gateway_name")
    private String name;
    @JsonProperty("iot_protocol")
    private String protocol;
    @JsonProperty("department_id")
    private String departmentId;
    @JsonProperty("sensor_count")
    private int sensorCount;
    @JsonProperty("threshold_status")
    private boolean active;
    @JsonProperty("updated_at")
    private String updatedAt;
}
