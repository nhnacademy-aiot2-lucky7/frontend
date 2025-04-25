package com.nhnacademy.lastfrontproject.dto.gateway;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
@AllArgsConstructor
public class GatewayDetailResponse {
    private Long id;
    private String name;
    private boolean active;
    private int sensorCount;
    private String protocol;
    private String brokerIp;
    private int port;
    private String clientId;
    private String description;
}
