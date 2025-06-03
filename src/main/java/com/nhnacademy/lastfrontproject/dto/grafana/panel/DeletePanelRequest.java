package com.nhnacademy.lastfrontproject.dto.grafana.panel;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class DeletePanelRequest {
    private String dashboardUid;
    private Integer panelId;
}
