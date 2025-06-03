package com.nhnacademy.lastfrontproject.dto.grafana.dashboard;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UpdateDashboardNameRequest {
    private String dashboardUid;
    private String dashboardNewTitle;
}
