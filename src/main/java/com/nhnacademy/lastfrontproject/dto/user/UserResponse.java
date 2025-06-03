package com.nhnacademy.lastfrontproject.dto.user;

import lombok.*;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@ToString
public class UserResponse {

    String userRole;

    Long userNo;

    String userName;

    String userEmail;

    String userPhone;

    DepartmentResponse department;

    EventLevelResponse eventLevelResponse;
}
