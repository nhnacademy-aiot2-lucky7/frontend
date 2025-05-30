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

@FeignClient(name = "dashboard", url = "${feign.client.dashboard-service.url}", path = "/api")
public interface DashboardAdapter {

    @GetMapping("/folders")
    ResponseEntity<List<FolderInfoResponse>> getFolders();

    @GetMapping("/dashboards")
    ResponseEntity<List<String>> getDashboardName(@RequestHeader("X-User-Id") String userId);

    @GetMapping("/dashboards")
    ResponseEntity<List<InfoDashboardResponse>> getAllDashboard(@RequestHeader("X-User-Id") String userId);

    @GetMapping("/panels")
    ResponseEntity<List<IframePanelResponse>> getPanel(
            @RequestBody ReadPanelRequest readPanelRequest);

    @PostMapping("/dashboards")
    ResponseEntity<Void> createDashboard(
            @RequestHeader("X-User-Id") String userId,
            @RequestBody CreateDashboardRequest createDashboardRequest
    );

    @PostMapping("/panels/filter")
    ResponseEntity<List<IframePanelResponse>> getFilterPanel(
            @RequestBody ReadPanelRequest readFilterPanelRequest,
            @RequestParam List<Integer> offPanelId
    );

    @PostMapping("/panels")
    ResponseEntity<Void> createPanel(
            @RequestHeader("X-User-Id") String userId,
            @RequestBody @Valid CreatePanelRequest createPanelRequest
    );

    @PutMapping("/dashboards")
    ResponseEntity<Void> updateDashboard(
            @RequestHeader("X-User-Id") String userId,
            @RequestBody UpdateDashboardNameRequest updateDashboardNameRequest
    );

    @PutMapping("/panels")
    ResponseEntity<Void> updatePanel(
            @RequestHeader("X-User-Id") String userId,
            @RequestBody UpdatePanelRequest updateRequest
    );

    @PutMapping("/panels/priority")
    ResponseEntity<Void> updatePriority(
            @RequestHeader("X-User-Id") String userId,
            @RequestBody UpdatePanelPriorityRequest updatePriority
    );

    @DeleteMapping("/dashboards")
    ResponseEntity<Void> deleteDashboard(
            @RequestHeader("X-User-Id") String userId,
            @RequestBody DeleteDashboardRequest deleteDashboardRequest);

    @DeleteMapping("/panels")
    ResponseEntity<Void> deletePanel(
            @RequestHeader("X-User-Id") String userId,
            @RequestBody DeletePanelRequest deletePanelRequest);

}
