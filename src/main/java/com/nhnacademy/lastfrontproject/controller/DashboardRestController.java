package com.nhnacademy.lastfrontproject.controller;

import com.nhnacademy.lastfrontproject.dto.grafana.dashboard.InfoDashboardResponse;
import com.nhnacademy.lastfrontproject.dto.grafana.folder.FolderInfoResponse;
import com.nhnacademy.lastfrontproject.dto.grafana.panel.SensorFieldRequestDto;
import com.nhnacademy.lastfrontproject.dto.sensor.DataTypeInfoResponse;
import com.nhnacademy.lastfrontproject.dto.sensor.SensorDataMappingIndexResponse;
import com.nhnacademy.lastfrontproject.dto.sensor.ThresholdBoundResponse;
import com.nhnacademy.lastfrontproject.service.DashboardService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@Slf4j
@RestController
@RequestMapping("/api")
public class DashboardRestController {

    private final DashboardService dashboardService;

    public DashboardRestController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    // 폴더 조회
    @CrossOrigin(origins = "*")
    @GetMapping("/admin/folders")
    public List<FolderInfoResponse> getFolders() {
        log.info("📡 폴더 리스트 조회 시작");
        List<FolderInfoResponse> folders = dashboardService.getFolders();
        log.info("📦 폴더 수: {}", folders.size());
        return folders;
    }

    @GetMapping({"/dashboards"})
    public List<InfoDashboardResponse> getDashboardInfo() {
        return dashboardService.getAllDashboard();
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
