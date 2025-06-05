package com.nhnacademy.lastfrontproject.dto.grafana.panel;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.nhnacademy.lastfrontproject.dto.grafana.GridPos;
import lombok.*;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class CreatePanelRequest {

    /**
     * 대시보드의 고유 식별자.
     */
    private String dashboardUid;

    /**
     * 패널의 아이디.
     */
    private Integer panelId;

    /**
     * 패널의 이름.
     */
    private String panelTitle;

    @JsonProperty("type_en_name")
    private String field;

    @JsonProperty("gateway_id")
    private Long gatewayId;

    @JsonProperty("sensor_id")
    private String sensorId;

    @JsonProperty("type_kr_name")
    private String dataTypeKrName;

    /**
     * 패널의 위치 정보.
     */
    private GridPos gridPos;

    /**
     * 패널의 타입 (예: 그래프, 테이블 등).
     */
    private String type;

    /**
     * 데이터 집계 방식 (예: 평균, 합계 등).
     */
    private String aggregation;

    /**
     * 데이터를 가져올 시간 범위 (예: 1시간, 1일 등).
     */
    private String time;

    @JsonProperty("threshold_min")
    private Double thresholdMin;

    @JsonProperty("threshold_max")
    private Double thresholdMax;

    /**
     * 데이터를 조회할 InfluxDB 버킷 이름.
     */
    @Builder.Default
    private String bucket = "temporary-data-handler";

    /**
     * 데이터를 조회할 InfluxDB 측정값(measurement) 이름 (예: sensor-data).
     */
    @Builder.Default
    private String measurement = "sensor-data";
}