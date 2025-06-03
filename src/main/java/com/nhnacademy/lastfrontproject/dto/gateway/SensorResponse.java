package com.nhnacademy.lastfrontproject.dto.gateway;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class SensorResponse {
    private Long id;
    private String type;
    private String location;
    private String hardware;
}
