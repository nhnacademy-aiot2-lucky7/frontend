package com.nhnacademy.lastfrontproject.dto.gateway;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public final class GatewaySummaryResponse {

    @JsonProperty("gateway_id")
    private final long gatewayId;

    @JsonProperty("gateway_name")
    private final String gatewayName;

    @JsonProperty("iot_protocol")
    private final IoTProtocol ioTProtocol;

    @JsonProperty("sensor_count")
    private final int sensorCount;

    @JsonProperty("threshold_status")
    private final boolean thresholdStatus;

    @JsonProperty("updated_at")
    @JsonFormat(
            shape = JsonFormat.Shape.STRING,
            pattern = "yyyy.MM.dd"
    )
    private final LocalDateTime updatedAt;
}
