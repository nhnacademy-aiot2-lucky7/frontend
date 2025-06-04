package com.nhnacademy.lastfrontproject.dto;

import com.nhnacademy.lastfrontproject.dto.user.DepartmentResponse;
import com.nhnacademy.lastfrontproject.dto.user.EventLevelResponse;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class UserWithImageResponse {
    String userRole;

    Long userNo;

    String userName;

    String userEmail;

    String userPhone;

    DepartmentResponse department;

    EventLevelResponse eventLevelResponse;
    
    private ImageResponse image;
}
