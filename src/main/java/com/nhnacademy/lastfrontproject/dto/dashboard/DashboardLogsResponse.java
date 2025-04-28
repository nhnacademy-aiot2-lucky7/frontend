package com.nhnacademy.lastfrontproject.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class DashboardLogsResponse {
    private String department;
    private int loglevel;
    private String chartName;
    private String message;
    private LocalDateTime dateTime;
}
