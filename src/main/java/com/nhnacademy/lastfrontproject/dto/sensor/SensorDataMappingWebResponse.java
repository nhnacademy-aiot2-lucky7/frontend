package com.nhnacademy.lastfrontproject.dto.sensor;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Value;

@Value
public class SensorDataMappingWebResponse {

    @JsonProperty("no")
    Long sensorNo;

    @JsonProperty("gateway_id")
    Long gatewayId;

    @JsonProperty("sensor_id")
    String sensorId;

    @JsonProperty("type_en_name")
    String typeEnName;

    @JsonProperty("location")
    String sensorLocation;

    @JsonProperty("spot")
    String sensorSpot;
}
