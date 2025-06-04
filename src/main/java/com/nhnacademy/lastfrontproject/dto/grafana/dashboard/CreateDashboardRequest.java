package com.nhnacademy.lastfrontproject.dto.grafana.dashboard;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class CreateDashboardRequest {
    private String dashboardTitle;
}