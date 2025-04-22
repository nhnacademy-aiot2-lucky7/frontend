package com.nhnacademy.lastfrontproject.dto.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private String userName;
    private String userEmail;
    private String userDepartment;
    private String userPhone;
    private String userRole;
}
