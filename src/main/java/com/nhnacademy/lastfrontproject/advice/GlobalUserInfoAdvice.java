package com.nhnacademy.lastfrontproject.advice;

import com.nhnacademy.lastfrontproject.dto.user.UserResponse;
import com.nhnacademy.lastfrontproject.util.JwtUtil;
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
        System.out.println("Advice: accessToken = " + accessToken);
        if (accessToken != null) {
            try {
                UserResponse user = jwtUtil.fetchUser(accessToken);
                System.out.println("Advice: user = " + user);
                return jwtUtil.fetchUser(accessToken); // 유저 서버에서 정보 조회
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        System.out.println("Advice: user is null");
        return null;
    }
}