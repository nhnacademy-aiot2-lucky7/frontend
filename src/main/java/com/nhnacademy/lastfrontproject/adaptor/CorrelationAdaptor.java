package com.nhnacademy.lastfrontproject.adaptor;

import com.nhnacademy.lastfrontproject.dto.analysis.AnalysisResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@RequiredArgsConstructor
@Component
public class CorrelationAdaptor {

    private final RestTemplate restTemplate;

    @Value("${feign.client.gateway-service.url}")
    private String gatewayUrl;

    private static final String CORRELATION_ANALYZE_PATH = "/api/correlation-analyze";

    public ResponseEntity<AnalysisResponse> analyzeCorrelation(Object requestBody, String encryptedEmail) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("X-User-Id", encryptedEmail);

        HttpEntity<Object> request = new HttpEntity<>(requestBody, headers);

        // gatewayUrl 끝에 '/'가 있든 없든 안전하게 경로 붙이기
        String url = gatewayUrl.endsWith("/")
                ? gatewayUrl.substring(0, gatewayUrl.length() - 1) + CORRELATION_ANALYZE_PATH
                : gatewayUrl + CORRELATION_ANALYZE_PATH;

        return restTemplate.postForEntity(url, request, AnalysisResponse.class);
    }
}