package com.nhnacademy.lastfrontproject.util;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.nhnacademy.lastfrontproject.dto.user.UserResponse;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;

@Component
public class JwtUtil {

    private final RestTemplate restTemplate = new RestTemplate();

    // JWT에서 user_id 추출
    public String getUserIdFromJwt(String jwt) {
        DecodedJWT decodedJWT = JWT.decode(jwt);
        return decodedJWT.getClaim("user_id").asString();
    }

    // 유저 서버에 요청할 때 X-User-Id에 user_id를 넣음
    public UserResponse fetchUser(String accessToken) {
        String apiUrl = "http://localhost:10232/users/me";
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        String userId = getUserIdFromJwt(accessToken);
        headers.set("X-User-Id", userId);

        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<UserResponse> response =
                restTemplate.exchange(apiUrl, HttpMethod.GET, entity, UserResponse.class);

        return response.getBody();
    }
}
