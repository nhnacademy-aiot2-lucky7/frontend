package com.nhnacademy.lastfrontproject.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class AdminDashboardResponse {
    private String department;
    private String title; // 배너 제목 필드 추가

    // 기존 생성자 유지
    public AdminDashboardResponse(String department) {
        this.department = department;
        this.title = ""; // 기본값 설정
    }
}