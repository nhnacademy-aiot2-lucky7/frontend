package com.nhnacademy.lastfrontproject.controller;

import com.nhnacademy.lastfrontproject.service.MemberService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Controller
@RequestMapping("/pages")
public class MemberController {
    private final MemberService memberService;

    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }

    @GetMapping("/admin/member_management")
    public String memberManagement() {
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