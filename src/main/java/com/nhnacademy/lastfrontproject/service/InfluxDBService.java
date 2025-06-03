package com.nhnacademy.lastfrontproject.service;

import com.influxdb.client.InfluxDBClient;
import com.influxdb.client.InfluxDBClientFactory;
import com.influxdb.client.QueryApi;
import com.influxdb.query.FluxRecord;
import com.influxdb.query.FluxTable;
import com.nhnacademy.lastfrontproject.dto.influxdb.ChartPointDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class InfluxDBService {
    private final InfluxDBClient influxDBClient;
    private final String bucket;
    private final String org;

    public InfluxDBService(
            @Value("${influxdb.url}") String url,
            @Value("${influxdb.token}") String token,
            @Value("${influxdb.org}") String org,
            @Value("${influxdb.bucket}") String bucket
    ) {
        this.influxDBClient = InfluxDBClientFactory.create(url, token.toCharArray(), org, bucket);
        this.bucket = bucket;
        this.org = org;
    }

    public List<ChartPointDto> getChartData(String measurement, String field, String timeRange) {
        String flux = String.format(
                "from(bucket: \"%s\") |> range(start: -%s) |> filter(fn: (r) => r._measurement == \"%s\" and r._field == \"%s\") |> sort(columns: [\"_time\"])",
                bucket, timeRange, measurement, field
        );
        List<ChartPointDto> points = new ArrayList<>();
        QueryApi queryApi = influxDBClient.getQueryApi();
        List<FluxTable> tables = queryApi.query(flux, org);
        for (FluxTable table : tables) {
            for (FluxRecord record : table.getRecords()) {
                points.add(new ChartPointDto(
                        record.getTime().toString(),
                        record.getValue() != null ? Double.parseDouble(record.getValue().toString()) : null
                ));
            }
        }
        return points;
    }
}
