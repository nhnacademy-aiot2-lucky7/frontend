package com.nhnacademy.lastfrontproject.controller;

import com.nhnacademy.lastfrontproject.dto.dashboard.AdminDashboardResponse;
import com.nhnacademy.lastfrontproject.dto.gateway.AdminGatewayResponse;
import com.nhnacademy.lastfrontproject.dto.user.UserResponse;
import org.springframework.boot.autoconfigure.kafka.KafkaProperties;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Controller
public class DashboardController {
    @GetMapping("/dashboard-info")
    public String dashboardInfo(){
        return "pages/member/dashboard/pages-dashboard-info";
    }

    @GetMapping("/admin/dashboard-info")
    public String adminDashboardInfo(
            Model model,
            @RequestParam(value = "department", required = false) String department,
            @RequestParam(value = "keyword", required = false) String keyword) {

        // 샘플 데이터 생성
        List<AdminDashboardResponse> dashboardList = List.of(
                new AdminDashboardResponse("운영팀", "서버룸"),
                new AdminDashboardResponse("운영팀", "전력사용량"),
                new AdminDashboardResponse("운영팀", "출입제어"),
                new AdminDashboardResponse("운영팀", "장비"),
                new AdminDashboardResponse("운영팀", "화재/침수"),

                new AdminDashboardResponse("보안팀", "서버룸"),
                new AdminDashboardResponse("보안팀", "전력사용량"),
                new AdminDashboardResponse("보안팀", "출입제어"),
                new AdminDashboardResponse("보안팀", "장비"),
                new AdminDashboardResponse("보안팀", "화재/침수"),

                new AdminDashboardResponse("시설팀", "서버룸"),
                new AdminDashboardResponse("시설팀", "전력사용량"),
                new AdminDashboardResponse("시설팀", "출입제어"),
                new AdminDashboardResponse("시설팀", "장비"),
                new AdminDashboardResponse("시설팀", "화재/침수")
        );

        // 필터링 전 전체 부서 목록 추출
        List<String> allDepartments = dashboardList.stream()
                .map(AdminDashboardResponse::getDepartment)
                .distinct()
                .collect(Collectors.toList());

        // 모델에 전체 부서 목록 추가
        model.addAttribute("allDepartments", allDepartments);

        // 원본 데이터 복사 (필터링용)
        List<AdminDashboardResponse> filteredList = new ArrayList<>(dashboardList);

        // 부서 필터링
        if (department != null && !department.isEmpty()) {
            filteredList = filteredList.stream()
                    .filter(d -> d.getDepartment().equals(department))
                    .collect(Collectors.toList());
        }

        // 검색어 필터링
        if (keyword != null && !keyword.trim().isEmpty()) {
            filteredList = filteredList.stream()
                    .filter(d -> d.getTitle().contains(keyword))
                    .collect(Collectors.toList());
        }

        // 부서별로 그룹화
        Map<String, List<AdminDashboardResponse>> grouped = filteredList.stream()
                .collect(Collectors.groupingBy(AdminDashboardResponse::getDepartment));

        // 모델에 데이터 추가
        model.addAttribute("dashboardGroups", grouped.entrySet().stream()
                .map(e -> new DashboardGroup(e.getKey(), e.getValue()))
                .toList());

        return "pages/admin/pages-dashboard-info";
    }

    @GetMapping("/add-dashboard")
    public String addDashboard(){
        return "pages/member/dashboard/pages-add-dashboard";
    }

    @GetMapping("/dashboard-detail")
    public String serverRoomInfo(){
        return "pages/pages-dashboard-detail";
    }

        record DashboardGroup(String departmentName, List<AdminDashboardResponse> dashboards) {}
}
