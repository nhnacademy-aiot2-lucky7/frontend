package com.nhnacademy.lastfrontproject.controller;

import com.nhnacademy.lastfrontproject.dto.influxdb.ChartPointDto;
import com.nhnacademy.lastfrontproject.dto.influxdb.FieldListDto;
import com.nhnacademy.lastfrontproject.service.InfluxDBMetaService;
import com.nhnacademy.lastfrontproject.service.InfluxDBService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/chart")
public class ChartDataController {
    private final InfluxDBService influxDBService;
    private final InfluxDBMetaService influxDBMetaService;

    public ChartDataController(InfluxDBService influxDBService, InfluxDBMetaService influxDBMetaService) {
        this.influxDBService = influxDBService;
        this.influxDBMetaService = influxDBMetaService;
    }

    // 차트 데이터 조회
    @GetMapping("/data")
    public List<ChartPointDto> getChartData(
            @RequestParam String measurement,
            @RequestParam String field,
            @RequestParam(defaultValue = "24h") String timeRange
    ) {
        return influxDBService.getChartData(measurement, field, timeRange);
    }

    // 필드 목록 조회
    @GetMapping("/fields")
    public FieldListDto getFieldList(@RequestParam String measurement) {
        return influxDBMetaService.getFieldList(measurement);
    }
}
