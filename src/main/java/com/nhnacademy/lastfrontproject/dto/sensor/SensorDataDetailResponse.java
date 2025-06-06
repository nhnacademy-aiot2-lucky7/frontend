package com.nhnacademy.lastfrontproject.dto.sensor;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SensorDataDetailResponse {

    @JsonProperty("sensor_data_no")
    private final Long sensorNo;

    @JsonProperty("gateway_id")
    private final Long gatewayId;

    @JsonProperty("sensor_id")
    private final String sensorId;

    private final String sensorName;

    @JsonProperty("type_en_name")
    private final String typeEnName;

    @JsonProperty("location")
    private final String sensorLocation;

    @JsonProperty("spot")
    private final String sensorSpot;
}
