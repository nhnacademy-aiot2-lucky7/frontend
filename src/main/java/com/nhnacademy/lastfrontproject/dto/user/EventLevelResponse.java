package com.nhnacademy.lastfrontproject.dto.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class EventLevelResponse {
    private String eventLevelName;
    private String eventLevelDetails;
    private int priority;
}
