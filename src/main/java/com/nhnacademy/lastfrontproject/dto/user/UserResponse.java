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
    private Department department;
    private String userPhone;
    private String roleId;
    private String profileImageUrl;
    private String userRole;
    private Long userNo;
    private EventLevelResponse eventLevelResponse;
}
