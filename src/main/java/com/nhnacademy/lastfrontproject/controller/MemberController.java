package com.nhnacademy.lastfrontproject.controller;

import com.nhnacademy.lastfrontproject.dto.member.MemberDto;
import com.nhnacademy.lastfrontproject.service.MemberService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
public class MemberController {
    private final MemberService memberService;

    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }

    @GetMapping("/member_management")
    public String memberManagement(Model model) {
        List<MemberDto> members = memberService.getAllMembers();
        model.addAttribute("members", members);
        return "pages/admin/pages-member-management";
    }
}