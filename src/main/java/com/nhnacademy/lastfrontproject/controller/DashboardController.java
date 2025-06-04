package com.nhnacademy.lastfrontproject.controller;

import com.nhnacademy.lastfrontproject.dto.grafana.dashboard.DeleteDashboardRequest;
import com.nhnacademy.lastfrontproject.dto.grafana.dashboard.UpdateDashboardNameRequest;
import com.nhnacademy.lastfrontproject.dto.grafana.folder.FolderInfoResponse;
import com.nhnacademy.lastfrontproject.dto.grafana.panel.*;
import com.nhnacademy.lastfrontproject.service.DashboardService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
public class DashboardController {
    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService){
        this.dashboardService = dashboardService;
    }

    // 폴더 조회
    @GetMapping("/admin/folders")
    public List<FolderInfoResponse> getFolders() {
        return dashboardService.getFolders();
    }

    // 대시보드 추가
    @GetMapping({"/user/dashboards", "/admin/dashboards"})
    public String showDashboardPage(Model model,
                                    @RequestParam(name = "departmentId", required = false) String departmentId) {
        model.addAttribute("departmentId", departmentId);
        return "pages/member/dashboard/pages-add-dashboard";
    }

    // 2. 대시보드 이름 조회
    @GetMapping("/dashboards/names")
    public List<String> getDashboardNames() {
        return dashboardService.getDashboardName();
    }

    // 사용자 대시보드 정보 조회
    @GetMapping("/user/dashboard-info")
    public String getUserDashboards(){
        return "pages/member/dashboard/pages-dashboard-info";
    }

    // admin 대시보드 정보 조회
    @GetMapping("/admin/dashboard-info")
    public String getAdminDashboards(){
        return "pages/admin/dashboard/pages-dashboard-info";
    }

    // 패널 조회
    @GetMapping({"/user/panels", "/admin/panels"})
    public String getPanels(ReadPanelRequest request) {
        dashboardService.getPanel(request);
        return "pages/member/dashboard/pages-panel-list";
    }

    // 5. 필터링된 패널 조회
    @PostMapping("/panels/filtered")
    public List<IframePanelResponse> getFilteredPanels(
            @RequestBody ReadPanelRequest readPanelRequest,
            @RequestParam List<Integer> offPanelId) {
        return dashboardService.getFilterPanel(readPanelRequest, offPanelId);
    }

    // 패널 생성
    @PostMapping({"/user/panels", "/admin/panels"})
    public String createPanel(@RequestBody CreatePanelRequest request) {
        dashboardService.createPanel(request);
        return "pages/member/dashboard/pages-add-panel";
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