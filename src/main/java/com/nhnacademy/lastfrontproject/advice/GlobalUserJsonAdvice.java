package com.nhnacademy.lastfrontproject.advice;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nhnacademy.lastfrontproject.dto.user.UserResponse;
import com.nhnacademy.lastfrontproject.util.CookieUtil;
import com.nhnacademy.lastfrontproject.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;

@ControllerAdvice
public class GlobalUserJsonAdvice {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private ObjectMapper objectMapper;

    @ModelAttribute("userJson")
    public String addUserJsonToModel(HttpServletRequest request) {
        try {
            String accessToken = CookieUtil.getAccessToken(request);
            UserResponse user = null;
            if (accessToken != null) {
                user = jwtUtil.fetchUser(accessToken);
            }
            return user != null ? objectMapper.writeValueAsString(user) : null;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
