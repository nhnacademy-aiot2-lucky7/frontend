package com.nhnacademy.lastfrontproject.dto.auth;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
public class RegisterRequest {
    @JsonProperty("userName")
    private String userName;
    @JsonProperty("userEmail")
    private String userEmail;
    @JsonProperty("userPassword")
    private String userPassword;

    private RegisterRequest(String userEmail, String userName, String userPassword){};

    public static RegisterRequest ofNewRegisterRequest(String userEmail, String userName, String userPassword){
        return new RegisterRequest(userName, userEmail, userPassword);
    }
}
