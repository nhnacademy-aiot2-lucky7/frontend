package com.nhnacademy.lastfrontproject.dto.sensor;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ThresholdBoundResponse {

    private String typeEnName;
    private Double minRangeMin;
    private Double minRangeMax;
    private Double maxRangeMin;
    private Double maxRangeMax;
}