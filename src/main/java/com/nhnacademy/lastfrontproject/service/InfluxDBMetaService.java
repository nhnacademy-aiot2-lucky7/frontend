package com.nhnacademy.lastfrontproject.service;

import com.influxdb.client.InfluxDBClient;
import com.influxdb.client.InfluxDBClientFactory;
import com.influxdb.client.QueryApi;
import com.influxdb.query.FluxRecord;
import com.influxdb.query.FluxTable;
import com.nhnacademy.lastfrontproject.dto.influxdb.FieldListDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class InfluxDBMetaService {
    private final InfluxDBClient influxDBClient;
    private final String bucket;
    private final String org;

    public InfluxDBMetaService(
            @Value("${influxdb.url}") String url,
            @Value("${influxdb.token}") String token,
            @Value("${influxdb.org}") String org,
            @Value("${influxdb.bucket}") String bucket
    ) {
        this.influxDBClient = InfluxDBClientFactory.create(url, token.toCharArray(), org, bucket);
        this.bucket = bucket;
        this.org = org;
    }

    public FieldListDto getFieldList (String measurement) {
        String flux = String.format(
                "import \"influxdata/influxdb/schema\"\n" +
                        "schema.measurementFieldKeys(bucket: \"%s\", measurement: \"%s\", start: -90d)",
                bucket, measurement
        );
        QueryApi queryApi = influxDBClient.getQueryApi();
        List<FluxTable> tables = queryApi.query(flux, org);
        List<String> fields = new ArrayList<>();
        for (FluxTable table : tables) {
            for (FluxRecord record : table.getRecords()) {
                fields.add(record.getValueByKey("_value").toString());
            }
        }
        return new FieldListDto(fields);
    }
}
