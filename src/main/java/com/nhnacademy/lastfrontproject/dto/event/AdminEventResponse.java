package com.nhnacademy.lastfrontproject.dto.event;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class AdminEventResponse {
    private String department;
    private int level;
    private String sensorName;
    private String message;
    private LocalDateTime dateTime;
}
