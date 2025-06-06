package com.nhnacademy.lastfrontproject.config;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class FeignLoggingInterceptor implements RequestInterceptor {

    private static final Logger log = LoggerFactory.getLogger(FeignLoggingInterceptor.class);

    @Override
    public void apply(RequestTemplate template) {
        log.info("Feign Request: {} {}", template.method(), template.url());
        log.debug("Headers: {}", template.headers());
        log.debug("Body: {}", template.requestBody().asString());
    }
}

