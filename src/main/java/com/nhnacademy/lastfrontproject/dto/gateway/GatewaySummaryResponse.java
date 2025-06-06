package com.nhnacademy.lastfrontproject.dto.gateway;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Getter
public class GatewaySummaryResponse {
    private long gatewayId;
    private String gatewayName;
}