package com.nhnacademy.lastfrontproject.controller;

import com.nhnacademy.lastfrontproject.dto.grafana.dashboard.CreateDashboardRequest;
import com.nhnacademy.lastfrontproject.dto.grafana.dashboard.InfoDashboardResponse;
import com.nhnacademy.lastfrontproject.dto.grafana.folder.FolderInfoResponse;
import com.nhnacademy.lastfrontproject.dto.grafana.panel.CreatePanelRequest;
import com.nhnacademy.lastfrontproject.dto.grafana.panel.SensorFieldRequestDto;
import com.nhnacademy.lastfrontproject.dto.sensor.DataTypeInfoResponse;
import com.nhnacademy.lastfrontproject.dto.sensor.RuleRequest;
import com.nhnacademy.lastfrontproject.dto.sensor.SensorDataMappingIndexResponse;
import com.nhnacademy.lastfrontproject.dto.sensor.ThresholdBoundResponse;
import com.nhnacademy.lastfrontproject.service.DashboardService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
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

    @PostMapping({"/panels"})
    ResponseEntity<Void> createPanel(
            @RequestBody RuleRequest ruleRequest,
            CreatePanelRequest createPanelRequest
    ){
        return dashboardService.createPanel(createPanelRequest);
    }

    @GetMapping("/sensor")
    public Set<SensorDataMappingIndexResponse> getSensorData(){
        return dashboardService.getSensor();
    }

    @GetMapping("/sensor/bound")
    public ThresholdBoundResponse getSensorBoundData(@RequestBody SensorFieldRequestDto sensorFieldRequestDto){
        return dashboardService.getSensorBound(sensorFieldRequestDto);
    }

    @GetMapping("/data-types/{name}")
    public DataTypeInfoResponse getDataType(@PathVariable("name") String dataTypeEnName) {
        return dashboardService.getDataTypeByKrName(dataTypeEnName);
    }
}
