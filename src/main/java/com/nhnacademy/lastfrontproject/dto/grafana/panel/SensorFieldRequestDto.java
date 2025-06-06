package com.nhnacademy.lastfrontproject.dto.grafana.panel;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class SensorFieldRequestDto {

    @JsonProperty("type_en_name")
    private String field;

    @JsonProperty("gateway_id")
    private Long gatewayId;

    @JsonProperty("sensor_id")
    private String sensorId;
}

