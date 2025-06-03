package com.nhnacademy.lastfrontproject.advice;

import com.nhnacademy.lastfrontproject.dto.user.UserResponse;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;
import jakarta.servlet.http.HttpServletRequest;

@ControllerAdvice
public class GlobalUserInfoAdvice {

    @ModelAttribute("user")
    public UserResponse addUserToModel(HttpServletRequest request) {

        return null;
    }
}