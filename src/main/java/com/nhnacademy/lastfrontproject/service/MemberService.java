package com.nhnacademy.lastfrontproject.service;

import com.nhnacademy.lastfrontproject.adaptor.AuthAdaptor;
import com.nhnacademy.lastfrontproject.dto.user.UserResponse;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class MemberService {
    private final AuthAdaptor authAdaptor;

    public MemberService(AuthAdaptor authAdaptor) {
        this.authAdaptor = authAdaptor;
    }

    public List<UserResponse> getAllMembers() {
        return authAdaptor.getAllMembers();
    }

    public void updateMemberRole(String userId, String roleId) {
        Map<String, String> request = new HashMap<>();
        request.put("userId", userId);
        request.put("roleId", roleId);
        authAdaptor.updateMemberRole(request);
    }

    public void deleteMember(String userEmail) {
        authAdaptor.deleteMember(userEmail);
    }
}
