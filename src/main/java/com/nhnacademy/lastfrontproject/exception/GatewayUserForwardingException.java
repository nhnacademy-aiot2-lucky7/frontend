package com.nhnacademy.lastfrontproject.exception;

public class GatewayUserForwardingException extends RuntimeException {
    public GatewayUserForwardingException(String oAuthUserName) {
        super("User Name : %s 에 해당하는 사용자 정보 전달에 실패함".formatted(oAuthUserName));
    }
}
