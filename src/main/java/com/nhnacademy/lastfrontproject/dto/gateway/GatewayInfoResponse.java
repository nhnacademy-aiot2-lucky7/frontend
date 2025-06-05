package com.nhnacademy.lastfrontproject.dto.gateway;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Value;

import java.time.LocalDateTime;

@Value
public class GatewayInfoResponse {

    @JsonProperty("gateway_id")
    Long gatewayId;

    @JsonProperty("address")
    String gatewayAddress;

    @JsonProperty("port")
    Integer gatewayPort;

    @JsonProperty("protocol")
    String ioTProtocol;

    @JsonProperty("gateway_name")
    String gatewayName;

    @JsonProperty("client_id")
    String clientId;

    @JsonProperty("department_id")
    String departmentId;

    @JsonProperty("description")
    String description;

    @JsonProperty("created_at")
    LocalDateTime createdAt;

    @JsonProperty("updated_at")
    LocalDateTime updatedAt;

    @JsonProperty("threshold_status")
    Boolean thresholdStatus;
}
