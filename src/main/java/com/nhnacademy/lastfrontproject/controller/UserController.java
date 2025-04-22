package com.nhnacademy.lastfrontproject.controller;

import com.nhnacademy.lastfrontproject.dto.user.UserResponse;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class UserController {
    // 공통 데이터를 생성하는 메서드
    private UserResponse getUserData() {
        return new UserResponse("테스트", "test@test.co.kr", "개발팀", "01012345678", "사원");
    }

    @GetMapping("/profile")
    public String profile(Model model){
        model.addAttribute("user", getUserData());
        return "pages/pages-profile";
    }

    @GetMapping("/edit-profile")
    public String editProfile(Model model) {
        model.addAttribute("user", getUserData());
        return "pages/pages-profile-edit";
    }
}
