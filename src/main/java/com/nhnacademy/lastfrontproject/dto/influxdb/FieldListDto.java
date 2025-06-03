package com.nhnacademy.lastfrontproject.dto.influxdb;

import java.util.List;

public class FieldListDto {
    private final List<String> fields;

    public FieldListDto(List<String> fields) {
        this.fields = fields;
    }

    public List<String> getFields() {
        return fields;
    }
}
