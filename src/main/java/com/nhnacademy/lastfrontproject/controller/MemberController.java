package com.nhnacademy.lastfrontproject.controller;

import com.nhnacademy.lastfrontproject.dto.member.MemberDto;
import com.nhnacademy.lastfrontproject.service.MemberService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class MemberController {
    private final MemberService memberService;

    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }

    @GetMapping("/admin/member_management")
    public String memberManagement(Model model) {
        List<MemberDto> members = memberService.getAllMembers();
        model.addAttribute("members", members);
        return "pages/admin/pages-member-management";
    }

    @PutMapping("/admin/member/edit/{id}")
    @ResponseBody
    public ResponseEntity<Void> updateMember(@PathVariable Long id, @RequestBody MemberDto dto) {
        memberService.updateMember(id, dto);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/admin/member/{id}")
    @ResponseBody
    public ResponseEntity<Void> deleteMember(@PathVariable Long id) {
        memberService.deleteMember(id);
        return ResponseEntity.ok().build();
    }
}
