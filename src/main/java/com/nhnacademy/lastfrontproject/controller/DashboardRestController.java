package com.nhnacademy.lastfrontproject.controller;

import com.nhnacademy.lastfrontproject.dto.grafana.dashboard.CreateDashboardRequest;
import com.nhnacademy.lastfrontproject.dto.grafana.dashboard.InfoDashboardResponse;
import com.nhnacademy.lastfrontproject.dto.grafana.folder.FolderInfoResponse;
import com.nhnacademy.lastfrontproject.dto.sensor.SensorDataMappingIndexResponse;
import com.nhnacademy.lastfrontproject.service.DashboardService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping
public class DashboardRestController {

    private final DashboardService dashboardService;

    public DashboardRestController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    // 폴더 조회
    @GetMapping("/admin/folders")
    public List<FolderInfoResponse> getFolders() {
        return dashboardService.getFolders();
    }

    @GetMapping({"/dashboards"})
    public List<InfoDashboardResponse> getDashboardPage() {
        return dashboardService.getAllDashboard();
    }

    @PostMapping({"/dashboard"})
    public ResponseEntity<Void> createDashboardPage(
            @RequestBody CreateDashboardRequest createDashboardRequest) {
        dashboardService.createDashboard(createDashboardRequest);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    // 2. 대시보드 이름 조회
    @GetMapping("/dashboards/names")
    public List<String> getDashboardNames() {
        return dashboardService.getDashboardName();
    }

    @GetMapping("/sensor")
    public ResponseEntity<Set<SensorDataMappingIndexResponse>> getSensorData(){

        return null;
    }
}
