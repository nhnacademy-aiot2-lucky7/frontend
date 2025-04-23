package com.nhnacademy.lastfrontproject.dto.gateway;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class AdminGatewayResponse {
    private Long id;
    private String name;
    private boolean active;
    private int sensorCount;
    private String department;
}
