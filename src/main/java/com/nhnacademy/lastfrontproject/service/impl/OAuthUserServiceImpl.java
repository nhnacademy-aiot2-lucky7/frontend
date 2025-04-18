package com.nhnacademy.lastfrontproject.service.impl;

import com.nhnacademy.lastfrontproject.adaptor.AuthAdaptor;
import com.nhnacademy.lastfrontproject.dto.auth.RegisterRequest;
import com.nhnacademy.lastfrontproject.exception.GatewayCommunicationException;
import com.nhnacademy.lastfrontproject.exception.GatewayUserForwardingException;
import com.nhnacademy.lastfrontproject.service.OAuthUserService;
import feign.FeignException;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class OAuthUserServiceImpl implements OAuthUserService {
    private final AuthAdaptor authAdaptor;

    public OAuthUserServiceImpl(AuthAdaptor authAdaptor) {
        this.authAdaptor = authAdaptor;
    }

    @Override
    public String sendOAuthUserInfo(RegisterRequest registerRequest) {
        try {
            ResponseEntity<String> response = authAdaptor.register(registerRequest);
            if (!response.getStatusCode().is2xxSuccessful()) {
                throw new GatewayUserForwardingException(registerRequest.getUserName());
            }

            return response.getBody();
        } catch (FeignException e) {
            throw new GatewayCommunicationException(e);
        } // 게이트웨이 통신 실패 예외 처리
    }
}
