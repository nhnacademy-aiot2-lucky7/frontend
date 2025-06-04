package com.nhnacademy.lastfrontproject.dto.sensor;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class SensorDataMappingIndexResponse {

    private long gatewayId;

    private String sensorId;

    @JsonProperty("type_en_name")
    private String dataTypeEnName;
}