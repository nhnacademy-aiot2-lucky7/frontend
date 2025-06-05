package com.nhnacademy.lastfrontproject.controller;

import com.nhnacademy.lastfrontproject.dto.grafana.dashboard.DeleteDashboardRequest;
import com.nhnacademy.lastfrontproject.dto.grafana.dashboard.UpdateDashboardNameRequest;
import com.nhnacademy.lastfrontproject.dto.grafana.panel.*;
import com.nhnacademy.lastfrontproject.service.DashboardService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/pages")
public class DashboardController {
    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService){
        this.dashboardService = dashboardService;
    }

    // 대시보드 추가
    @GetMapping({"/add-dashboard"})
    public String showDashboardPage(Model model,
                                    @RequestParam(name = "departmentId", required = false) String departmentId) {
        model.addAttribute("departmentId", departmentId);
        return "pages/member/dashboard/pages-add-dashboard";
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
    @GetMapping("/panels/{dashboardUid}")
    public String getPanels(Model model,
                            @PathVariable String dashboardUid) {
        model.addAttribute("dashboardUid", dashboardUid);
        return "pages/member/dashboard/pages-add-panel";
    }

    // 5. 필터링된 패널 조회
    @PostMapping("/panels/filtered")
    public List<IframePanelResponse> getFilteredPanels(
            @RequestBody ReadPanelRequest readPanelRequest,
            @RequestParam List<Integer> offPanelId) {
        return dashboardService.getFilterPanel(readPanelRequest, offPanelId);
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