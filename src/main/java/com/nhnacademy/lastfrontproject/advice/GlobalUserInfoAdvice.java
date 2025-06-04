package com.nhnacademy.lastfrontproject.advice;

import com.nhnacademy.lastfrontproject.adaptor.AuthAdaptor;
import com.nhnacademy.lastfrontproject.dto.ImageResponse;
import com.nhnacademy.lastfrontproject.dto.UserWithImageResponse;
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
    public UserWithImageResponse addUserToModel() {
        try {
            UserResponse userResponse = authAdaptor.getMyInfo().getBody();
            ImageResponse imageResponse;
            try {
                 imageResponse = authAdaptor.getImage(userResponse.getUserEmail()).getBody();
            } catch (Exception e) {
                imageResponse = null;
            }


            return new UserWithImageResponse(userResponse.getUserRole(),
                    userResponse.getUserNo(),
                    userResponse.getUserName(),
                    userResponse.getUserEmail(),
                    userResponse.getUserPhone(),
                    userResponse.getDepartment(),
                    userResponse.getEventLevelResponse()
                    , imageResponse);
        } catch (Exception e) {
            return null;
        }
    }

}