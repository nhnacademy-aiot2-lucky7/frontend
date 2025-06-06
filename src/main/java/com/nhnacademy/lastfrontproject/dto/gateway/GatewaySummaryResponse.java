package com.nhnacademy.lastfrontproject.dto.gateway;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public final class GatewaySummaryResponse {

    private final long gatewayId;

    private final String gatewayName;

    @JsonProperty("iot_protocol") // JSON key가 iot_protocol이니까 필드명과 매칭 위해 붙임
    private final IoTProtocol ioTProtocol;

    private final int sensorCount;

    private final boolean thresholdStatus;

    @JsonFormat(
            shape = JsonFormat.Shape.STRING,
            pattern = "yyyy.MM.dd"
    )
    private final LocalDateTime updatedAt;
}