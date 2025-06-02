package com.nhnacademy.lastfrontproject.advice;

import com.nhnacademy.lastfrontproject.adaptor.AuthAdaptor;
import com.nhnacademy.lastfrontproject.dto.user.UserResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;

@Slf4j
@ControllerAdvice
public class GlobalUserInfoAdvice {
    private final AuthAdaptor authAdaptor;

    public GlobalUserInfoAdvice(AuthAdaptor authAdaptor) {
        this.authAdaptor = authAdaptor;
    }

    @ModelAttribute("user")
    public UserResponse addUserToModel() {
        try {
            UserResponse userResponse =authAdaptor.getMyInfo().getBody();
            log.info("user response: {}", userResponse);
            return userResponse;
        } catch (Exception e) {
            return null;
        }
    }
}