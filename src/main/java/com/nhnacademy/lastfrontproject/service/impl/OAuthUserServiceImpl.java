package com.nhnacademy.lastfrontproject.service.impl;

import com.nhnacademy.lastfrontproject.adaptor.OAuthUserAdaptor;
import com.nhnacademy.lastfrontproject.dto.OAuthUserRequest;
import com.nhnacademy.lastfrontproject.exception.GatewayCommunicationException;
import com.nhnacademy.lastfrontproject.exception.GatewayUserForwardingException;
import com.nhnacademy.lastfrontproject.service.OAuthUserService;
import feign.FeignException;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class OAuthUserServiceImpl implements OAuthUserService {
    private final OAuthUserAdaptor oAuthUserAdaptor;

    public OAuthUserServiceImpl(OAuthUserAdaptor oAuthUserAdaptor) {
        this.oAuthUserAdaptor = oAuthUserAdaptor;
    }

    @Override
    public String sendOAuthUserInfo(OAuthUserRequest oAuthUserRequest) {
        try {
            ResponseEntity<String> response = oAuthUserAdaptor.sendOAuthUserInfo(oAuthUserRequest);
            if (!response.getStatusCode().is2xxSuccessful()) {
                throw new GatewayUserForwardingException(oAuthUserRequest.getOAuthUserName());
            }
            return response.getBody();
        } catch (FeignException e) {
            throw new GatewayCommunicationException(e);
        } // 게이트웨이 통신 실패 예외 처리
    }
}
