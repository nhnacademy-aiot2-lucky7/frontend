package com.nhnacademy.lastfrontproject.dto.analysis;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class SensorInfo {

    private String gatewayId;
    private String sensorId;
    private String sensorType;
}