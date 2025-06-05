package com.nhnacademy.lastfrontproject.dto.sensor;

import com.fasterxml.jackson.annotation.JsonProperty;

public class DataTypeInfoResponse {

    @JsonProperty("type_en_name")
    private String dataTypeEnName;

    @JsonProperty("type_kr_name")
    private String dataTypeKrName;
}
