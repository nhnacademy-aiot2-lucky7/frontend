package com.nhnacademy.lastfrontproject.controller;

import com.nhnacademy.lastfrontproject.dto.event.EventResponse;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.time.LocalDateTime;
import java.util.List;

@Controller
public class EventController {
    @GetMapping("/event")
    public String event(Model model){
        List<EventResponse> events = List.of(
                new EventResponse(1, "센서-A1", "온도 경고 발생", LocalDateTime.now().minusHours(1)),
                new EventResponse(2, "센서-B2", "습도 초과 감지", LocalDateTime.now().minusHours(2)),
                new EventResponse(3, "센서-C3", "진동 이상 감지", LocalDateTime.now().minusDays(1)),
                new EventResponse(1, "센서-D4", "전력 급증", LocalDateTime.now().minusMinutes(30)),
                new EventResponse(2, "센서-E5", "통신 오류 발생", LocalDateTime.now().minusMinutes(10))
        );

        model.addAttribute("events", events);
        return "pages/pages-event";
    }
}
