package com.nhnacademy.lastfrontproject.controller;

import com.nhnacademy.lastfrontproject.dto.grafana.dashboard.CreateDashboardRequest;
import com.nhnacademy.lastfrontproject.dto.grafana.dashboard.DeleteDashboardRequest;
import com.nhnacademy.lastfrontproject.dto.grafana.dashboard.InfoDashboardResponse;
import com.nhnacademy.lastfrontproject.dto.grafana.dashboard.UpdateDashboardNameRequest;
import com.nhnacademy.lastfrontproject.dto.grafana.folder.FolderInfoResponse;
import com.nhnacademy.lastfrontproject.dto.grafana.panel.*;
import com.nhnacademy.lastfrontproject.service.DashboardService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/api")
public class DashboardController {
    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService){
        this.dashboardService = dashboardService;
    }

    // 1. 폴더 조회
    @GetMapping("/folders")
    public List<FolderInfoResponse> getFolders() {
        return dashboardService.getFolders();
    }

    // 2. 대시보드 이름 조회
    @GetMapping("/dashboards/names")
    public List<String> getDashboardNames() {
        return dashboardService.getDashboardName();
    }

    // 3. 전체 대시보드 정보 조회
    @GetMapping("/dashboards")
    public List<InfoDashboardResponse> getDashboards(){
        return dashboardService.getAllDashboard();
    }

    // 4. 패널 조회
    @GetMapping("/panels")
    public List<IframePanelResponse> getPanels(ReadPanelRequest request) {
        return dashboardService.getPanel(request);
    }

    // 5. 필터링된 패널 조회
    @PostMapping("/panels/filtered")
    public List<IframePanelResponse> getFilteredPanels(
            @RequestBody ReadPanelRequest readPanelRequest,
            @RequestParam List<Integer> offPanelId) {
        return dashboardService.getFilterPanel(readPanelRequest, offPanelId);
    }

    // 6. 대시보드 생성
    @PostMapping("/dashboards")
    public void createDashboard(@RequestBody CreateDashboardRequest request) {
        dashboardService.createDashboard(request);
    }

    // 7. 패널 생성
    @PostMapping("/panels")
    public void createPanel(@RequestBody CreatePanelRequest request) {
        dashboardService.createPanel(request);
    }

    // 8. 대시보드 이름 수정
    @PutMapping("/dashboards")
    public void updateDashboard(@RequestBody UpdateDashboardNameRequest request) {
        dashboardService.updateDashboard(request);
    }

    // 9. 패널 수정
    @PutMapping("/panels")
    public void updatePanel(@RequestBody UpdatePanelRequest request) {
        dashboardService.updatePanel(request);
    }

    // 10. 패널 우선순위 수정
    @PutMapping("/panels/priority")
    public void updatePriority(@RequestBody UpdatePanelPriorityRequest request) {
        dashboardService.updatePriority(request);
    }

    // 11. 대시보드 삭제
    @DeleteMapping("/dashboard")
    public void deleteDashboard(@RequestBody DeleteDashboardRequest request) {
        dashboardService.deleteDashboard(request);
    }

    // 12. 패널 삭제
    @DeleteMapping("/panel")
    public void deletePanel(@RequestBody DeletePanelRequest request) {
        dashboardService.deletePanel(request);
    }
}