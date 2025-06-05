package com.nhnacademy.lastfrontproject.adaptor;

import com.nhnacademy.lastfrontproject.dto.grafana.dashboard.CreateDashboardRequest;
import com.nhnacademy.lastfrontproject.dto.grafana.dashboard.DeleteDashboardRequest;
import com.nhnacademy.lastfrontproject.dto.grafana.dashboard.InfoDashboardResponse;
import com.nhnacademy.lastfrontproject.dto.grafana.dashboard.UpdateDashboardNameRequest;
import com.nhnacademy.lastfrontproject.dto.grafana.folder.FolderInfoResponse;
import com.nhnacademy.lastfrontproject.dto.grafana.panel.*;
import jakarta.validation.Valid;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(name = "dashboard", url = "${feign.client.gateway-service.url}")
public interface DashboardAdapter {

    @GetMapping("/folders")
    ResponseEntity<List<FolderInfoResponse>> getFolders();

    @GetMapping("/dashboards")
    ResponseEntity<List<InfoDashboardResponse>> getAllDashboard();

    @GetMapping("/panels")
    ResponseEntity<List<IframePanelResponse>> getPanel(
            @RequestBody ReadPanelRequest readPanelRequest);

    @PostMapping("/dashboards")
    ResponseEntity<Void> createDashboard(
            @RequestBody CreateDashboardRequest createDashboardRequest
    );

    @PostMapping("/panels/filter")
    ResponseEntity<List<IframePanelResponse>> getFilterPanel(
            @RequestBody ReadPanelRequest readFilterPanelRequest,
            @RequestParam List<Integer> offPanelId
    );

    @PostMapping("/panels")
    ResponseEntity<Void> createPanel(
            @RequestBody @Valid CreatePanelRequest createPanelRequest
    );

    @PutMapping("/dashboards")
    ResponseEntity<Void> updateDashboard(
            @RequestBody UpdateDashboardNameRequest updateDashboardNameRequest
    );

    @PutMapping("/panels")
    ResponseEntity<Void> updatePanel(
            @RequestBody UpdatePanelRequest updateRequest
    );

    @PutMapping("/panels/priority")
    ResponseEntity<Void> updatePriority(
            @RequestBody UpdatePanelPriorityRequest updatePriority
    );

        @DeleteMapping("/dashboards")
    ResponseEntity<Void> deleteDashboard(
            @RequestBody DeleteDashboardRequest deleteDashboardRequest);

    @DeleteMapping("/panels")
    ResponseEntity<Void> deletePanel(
            @RequestBody DeletePanelRequest deletePanelRequest);


}