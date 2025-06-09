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
    @GetMapping("/dashboard/admin/dashboard-info")
    public String getAdminDepartment() {
        return "pages/admin/dashboard/pages-dashboard-info";
    }

    @GetMapping("/all-dashboard")
    public String getAllDashboards() {
        return "pages/admin/dashboard/pages-admin-all-dashboard";
    }

    @GetMapping("/dashboard/admin/dashboard-list")
    public String getAdminDashboards(@RequestParam("title") String dashboardTitle, Model model) {
        model.addAttribute("title", dashboardTitle);
        return "pages/admin/dashboard/pages-admin-dashboard-list";
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

    @GetMapping("/panel/{dashboardUid}/{panelTitle}")
    public String getPanel(Model model,
                            @PathVariable String dashboardUid,
                           @PathVariable String panelTitle) {
        List<IframePanelResponse> panelResponses = dashboardService.getPanel(dashboardUid);

        // 리스트가 비어있지 않다면 dashboardTitle 하나 꺼내서 model에 추가
        String dashboardTitle = panelResponses.isEmpty() ? "제목 없음" : panelResponses.getFirst().getDashboardTitle();

        model.addAttribute("panels", panelResponses);
        model.addAttribute("dashboardUid", dashboardUid);
        model.addAttribute("dashboardTitle", dashboardTitle);
        model.addAttribute("panelTitle", panelTitle);

        return "pages/member/dashboard/pages-panel-list";
    }

    @GetMapping("/panel/edit")
    public String editPanel(@RequestParam("dashboardUid") String dashboardUid,
                            @RequestParam("panelId") int panelId, Model model) {
        model.addAttribute("dashboardUid", dashboardUid);
        model.addAttribute("panelId", panelId);

        // "editPanel"은 수정할 페이지의 뷰 이름
        return "pages/member/dashboard/pages-edit-panel";
    }

    // 5. 필터링된 패널 조회
    @PostMapping("/panels/filtered")
    public List<IframePanelResponse> getFilteredPanels(
            @RequestBody ReadPanelRequest readPanelRequest,
            @RequestParam List<Integer> offPanelId) {
        return dashboardService.getFilterPanel(readPanelRequest, offPanelId);
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