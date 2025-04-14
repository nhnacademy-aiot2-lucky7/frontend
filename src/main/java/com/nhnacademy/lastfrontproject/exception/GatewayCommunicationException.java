package com.nhnacademy.lastfrontproject.exception;

import feign.FeignException;

public class GatewayCommunicationException extends RuntimeException {
    public GatewayCommunicationException(FeignException e) {
        super("게이트웨이와의 통신에 실패했습니다.", e);
    }
}
