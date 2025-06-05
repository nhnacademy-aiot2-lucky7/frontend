package com.nhnacademy.lastfrontproject.dto.sensor;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
public class SensorDataMappingWebResponse {

    @JsonProperty("gateway_id")
    private Long gatewayId;

    @JsonProperty("sensor_id")
    private String sensorId;

    @JsonProperty("type_en_name")
    private String typeEnName;

    @JsonProperty("location")
    private String sensorLocation;
}