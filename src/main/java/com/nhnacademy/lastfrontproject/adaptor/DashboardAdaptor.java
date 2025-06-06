package com.nhnacademy.lastfrontproject.adaptor;

import com.nhnacademy.lastfrontproject.dto.grafana.dashboard.CreateDashboardRequest;
import com.nhnacademy.lastfrontproject.dto.grafana.dashboard.DeleteDashboardRequest;
import com.nhnacademy.lastfrontproject.dto.grafana.dashboard.InfoDashboardResponse;
import com.nhnacademy.lastfrontproject.dto.grafana.dashboard.UpdateDashboardNameRequest;
import com.nhnacademy.lastfrontproject.dto.grafana.folder.FolderInfoResponse;
import com.nhnacademy.lastfrontproject.dto.grafana.panel.*;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(name = "dashboard", url = "${feign.client.gateway-service.url}")
public interface DashboardAdaptor {

    @GetMapping("/api/folders")
    ResponseEntity<List<FolderInfoResponse>> getFolders();

    @GetMapping("/api/dashboards")
    ResponseEntity<List<InfoDashboardResponse>> getAllDashboard();

    @GetMapping("/api/panels/{dashboardUid}")
    ResponseEntity<List<IframePanelResponse>> getPanel(
            @PathVariable String dashboardUid);

    @PostMapping("/api/dashboards")
    ResponseEntity<Void> createDashboard(
            @RequestBody CreateDashboardRequest createDashboardRequest
    );

    @PostMapping("/api/panels/filter")
    ResponseEntity<List<IframePanelResponse>> getFilterPanel(
            @RequestBody ReadPanelRequest readFilterPanelRequest,
            @RequestParam List<Integer> offPanelId
    );

    @PostMapping("/api/panels")
    ResponseEntity<Void> createPanel(
            @RequestBody PanelWithRuleRequest panelWithRuleRequest
    );

    @PostMapping("/api/panels/test")
    ResponseEntity<Void> createPaneltest(
            @RequestBody CreatePanelRequest createPanelRequest
    );

    @PutMapping("/api/dashboards")
    ResponseEntity<Void> updateDashboard(
            @RequestBody UpdateDashboardNameRequest updateDashboardNameRequest
    );

    @PutMapping("/api/panels")
    ResponseEntity<Void> updatePanel(
            @RequestBody UpdatePanelRequest updateRequest
    );

    @PutMapping("/api/panels/priority")
    ResponseEntity<Void> updatePriority(
            @RequestBody UpdatePanelPriorityRequest updatePriority
    );

    @DeleteMapping("/api/dashboards")
    ResponseEntity<Void> deleteDashboard(
            @RequestBody DeleteDashboardRequest deleteDashboardRequest);

    @DeleteMapping("/api/panels")
    ResponseEntity<Void> deletePanel(
            @RequestBody DeletePanelRequest deletePanelRequest);
}