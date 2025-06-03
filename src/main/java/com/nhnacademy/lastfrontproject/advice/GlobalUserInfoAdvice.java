package com.nhnacademy.lastfrontproject.advice;

import com.nhnacademy.lastfrontproject.adaptor.AuthAdaptor;
import com.nhnacademy.lastfrontproject.dto.user.UserResponse;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;

@ControllerAdvice
public class GlobalUserInfoAdvice {
    private final AuthAdaptor authAdaptor;

    public GlobalUserInfoAdvice(AuthAdaptor authAdaptor) {
        this.authAdaptor = authAdaptor;
    }

    @ModelAttribute("user")
    public UserResponse addUserToModel() {
        try {
            return authAdaptor.getMyInfo().getBody();
        } catch (Exception e) {
            return null;
        }
    }
}