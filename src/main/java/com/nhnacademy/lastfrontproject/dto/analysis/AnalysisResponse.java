package com.nhnacademy.lastfrontproject.dto.analysis;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class AnalysisResponse {
    private Result result;

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Result {
        private String analysisType;
        private List<SensorInfo> sensorInfo;
        private String model;
        private List<PredictedData> predictedData;
        private long analyzedAt;
    }

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PredictedData {
        private SensorInfo sensorInfo;
        private double singleRiskModel;
        private double correlationRiskModel;
    }

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SensorInfo {
        private String gatewayId;
        private String sensorId;
        private String sensorType;
        private String location;
    }
}