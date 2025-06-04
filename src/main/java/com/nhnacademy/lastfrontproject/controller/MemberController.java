package com.nhnacademy.lastfrontproject.controller;

import com.nhnacademy.lastfrontproject.dto.member.MemberDto;
import com.nhnacademy.lastfrontproject.dto.user.UserResponse;
import com.nhnacademy.lastfrontproject.service.MemberService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Controller
public class MemberController {
    private final MemberService memberService;

    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }

    @GetMapping("/admin/member_management")
    public String memberManagement(Model model) {
        List<UserResponse> members = memberService.getAllMembers();
        model.addAttribute("members", members);
        return "pages/admin/pages-member-management";
    }

    @PutMapping("/admin/users/roles")
    @ResponseBody
    public ResponseEntity<Void> updateMemberRole(@RequestBody Map<String, String> request) {
        memberService.updateMemberRole(request.get("userId"), request.get("roleId"));
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/admin/users/{userEmail}")
    @ResponseBody
    public ResponseEntity<Void> deleteMember(@PathVariable String userEmail) {
        memberService.deleteMember(userEmail);
        return ResponseEntity.ok().build();
    }
}