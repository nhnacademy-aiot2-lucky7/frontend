package com.nhnacademy.lastfrontproject.dto.influxdb;

public class ChartPointDto {
    private final String time;
    private final Double value;

    public ChartPointDto(String time, Double value) {
        this.time = time;
        this.value = value;
    }

    public String getTime() {
        return time;
    }

    public Double getValue() {
        return value;
    }
}
