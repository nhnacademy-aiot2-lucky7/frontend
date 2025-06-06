package com.nhnacademy.lastfrontproject.adaptor;

import com.nhnacademy.lastfrontproject.dto.analysis.AnalysisRequest;
import com.nhnacademy.lastfrontproject.dto.analysis.AnalysisResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "correlation-analysis-service", url = "${feign.client.gateway-service.url}")
public interface CorrelationAdaptor {

    @PostMapping("/api/correlation-analyze")
    ResponseEntity<AnalysisResponse> analyzeCorrelation(
            @RequestBody AnalysisRequest request,
            @RequestHeader("X-User-Id") String encryptedEmail
    );
}