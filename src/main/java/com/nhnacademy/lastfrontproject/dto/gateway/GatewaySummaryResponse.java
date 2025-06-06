package com.nhnacademy.lastfrontproject.dto.gateway;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class GatewaySummaryResponse {
    private long gatewayId;
    private String gatewayName;
}
