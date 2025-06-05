package com.nhnacademy.lastfrontproject.dto.gateway;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class GatewayInfoResponse{

    @JsonProperty("gateway_id")
    private Long gatewayId;

    @JsonProperty("gateway_name")
    private String gatewayName;
}