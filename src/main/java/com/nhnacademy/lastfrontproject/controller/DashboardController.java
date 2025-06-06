package com.nhnacademy.lastfrontproject.controller;

import com.nhnacademy.lastfrontproject.dto.grafana.dashboard.UpdateDashboardNameRequest;
import com.nhnacademy.lastfrontproject.dto.grafana.panel.DeletePanelRequest;
import com.nhnacademy.lastfrontproject.dto.grafana.panel.IframePanelResponse;
import com.nhnacademy.lastfrontproject.dto.grafana.panel.ReadPanelRequest;
import com.nhnacademy.lastfrontproject.dto.grafana.panel.UpdatePanelPriorityRequest;
import com.nhnacademy.lastfrontproject.dto.grafana.panel.UpdatePanelRequest;
import com.nhnacademy.lastfrontproject.service.DashboardService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Slf4j
@Controller
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    // 대시보드 추가
    @GetMapping({"/add-dashboard"})
    public String showDashboardPage() {
        return "pages/member/dashboard/pages-add-dashboard";
    }

    // 사용자 대시보드 정보 조회
    @GetMapping("/dashboard-info")
    public String getUserDashboards() {
        return "pages/member/dashboard/pages-dashboard-info";
    }

    // admin 대시보드 정보 조회
    @GetMapping("/admin/dashboard-info")
    public String getAdminDashboards() {
        return "pages/admin/dashboard/pages-dashboard-info";
    }

    // 패널 추가
    @GetMapping("/panels")
    public String createPanel(@RequestParam("dashboardUid") String dashboardUid, Model model) {
        model.addAttribute("dashboardUid", dashboardUid);
        return "pages/member/dashboard/pages-add-panel";
    }

    // 패널 조회
    @GetMapping("/panel/{dashboardUid}")
    public String getPanels(Model model,
                            @PathVariable String dashboardUid) {
        log.info("getPanels 실행");
        List<IframePanelResponse> panelResponses = dashboardService.getPanel(dashboardUid);

        // 리스트가 비어있지 않다면 dashboardTitle 하나 꺼내서 model에 추가
        String dashboardTitle = panelResponses.isEmpty() ? "제목 없음" : panelResponses.getFirst().getDashboardTitle();

        model.addAttribute("panels", panelResponses);
        model.addAttribute("dashboardUid", dashboardUid);
        model.addAttribute("dashboardTitle", dashboardTitle);

        return "pages/member/dashboard/pages-panel-list";
    }

    // 5. 필터링된 패널 조회
    @PostMapping("/panels/filtered")
    public List<IframePanelResponse> getFilteredPanels(
            @RequestBody ReadPanelRequest readPanelRequest,
            @RequestParam List<Integer> offPanelId) {
        return dashboardService.getFilterPanel(readPanelRequest, offPanelId);
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

    // 12. 패널 삭제
    @DeleteMapping("/panel")
    public void deletePanel(@RequestBody DeletePanelRequest request) {
        dashboardService.deletePanel(request);
    }
}