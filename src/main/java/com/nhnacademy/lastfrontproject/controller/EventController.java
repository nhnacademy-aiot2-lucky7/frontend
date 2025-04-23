package com.nhnacademy.lastfrontproject.controller;

import com.nhnacademy.lastfrontproject.dto.event.AdminEventResponse;
import com.nhnacademy.lastfrontproject.dto.event.EventResponse;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.time.LocalDateTime;
import java.util.List;

@Controller
public class EventController {
    @GetMapping("/admin/event")
    public String showAdminEvent(Model model){
        List<AdminEventResponse> events = List.of(
                new AdminEventResponse("설비", 1, "센서-A1", "온도 경고 발생", LocalDateTime.now().minusHours(1)),
                new AdminEventResponse("보안", 2, "센서-B2", "출입 이상 감지", LocalDateTime.now().minusHours(3)),
                new AdminEventResponse("네트워크", 3, "센서-C3", "패킷 유실 감지", LocalDateTime.now().minusDays(1)),
                new AdminEventResponse("운영", 1, "센서-D4", "전력 사용 급증", LocalDateTime.now().minusMinutes(45)),
                new AdminEventResponse("개발", 2, "센서-E5", "통신 오류 발생", LocalDateTime.now().minusMinutes(10)),
                new AdminEventResponse("보안", 3, "센서-F6", "문 열림 감지", LocalDateTime.now().minusHours(5)),
                new AdminEventResponse("설비", 2, "센서-G7", "습도 이상 감지", LocalDateTime.now().minusHours(2)),
                new AdminEventResponse("네트워크", 1, "센서-H8", "스위치 재부팅 발생", LocalDateTime.now().minusDays(2))
        );

        model.addAttribute("events", events);
        return "pages/admin/pages-event";
    }

    @GetMapping("/event")
    public String showEvent(Model model){
        List<EventResponse> events = List.of(
                new EventResponse(1, "센서-A1", "온도 경고 발생", LocalDateTime.now().minusHours(1)),
                new EventResponse(2, "센서-B2", "습도 초과 감지", LocalDateTime.now().minusHours(2)),
                new EventResponse(3, "센서-C3", "진동 이상 감지", LocalDateTime.now().minusDays(1)),
                new EventResponse(1, "센서-D4", "전력 급증", LocalDateTime.now().minusMinutes(30)),
                new EventResponse(2, "센서-E5", "통신 오류 발생", LocalDateTime.now().minusMinutes(10))
        );

        model.addAttribute("events", events);
        return "pages/member/pages-event";
    }
}
