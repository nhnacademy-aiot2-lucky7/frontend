package com.nhnacademy.lastfrontproject.dto.user;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Getter
public class DepartmentResponse {
    private String departmentId;

    private String departmentName;
}
