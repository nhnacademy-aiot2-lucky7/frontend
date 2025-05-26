package com.nhnacademy.lastfrontproject.dto.member;

import com.nhnacademy.lastfrontproject.entity.Member;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MemberDto {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String departmentId;
    private String departmentName;
    private String createdAt;

    public static MemberDto fromEntity(Member member) {
        return MemberDto.builder()
                .id(member.getId())
                .name(member.getName())
                .email(member.getEmail())
                .phone(member.getPhone())
                .departmentId(member.getDepartmentId())
                // departmentName이 null이면 ""로 내려줌
                .departmentName(
                        member.getDepartment() != null && member.getDepartment().getDepartmentName() != null
                                ? member.getDepartment().getDepartmentName()
                                : ""
                )
                .createdAt(member.getCreatedAt() != null ? member.getCreatedAt().toString() : null)
                .build();
    }
}
