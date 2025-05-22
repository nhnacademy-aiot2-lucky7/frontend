package com.nhnacademy.lastfrontproject.advice;

import com.nhnacademy.lastfrontproject.dto.user.UserResponse;
import com.nhnacademy.lastfrontproject.jwt.JwtUtil;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;

@ControllerAdvice
public class GlobalUserInfoAdvice {

    @Autowired
    private JwtUtil jwtUtil; // JWT에서 유저 정보 추출하는 유틸

    @ModelAttribute("user")
    public UserResponse addUserToModel(HttpServletRequest request) {
        // accessToken 추출
        String accessToken = null;
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("accessToken".equals(cookie.getName())) {
                    accessToken = cookie.getValue();
                    break;
                }
            }
        }
        if (accessToken != null) {
            try {
                return jwtUtil.fetchUser(accessToken); // 유저 서버에서 정보 조회
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return null;
    }
}