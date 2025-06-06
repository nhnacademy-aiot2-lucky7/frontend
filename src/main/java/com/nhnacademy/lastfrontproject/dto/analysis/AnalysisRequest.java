package com.nhnacademy.lastfrontproject.dto.analysis;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class AnalysisRequest {
    private SensorInfo sensor1;
    private SensorInfo sensor2;
}