package com.nhnacademy.lastfrontproject.controller;

import com.nhnacademy.lastfrontproject.adaptor.AuthAdaptor;
import com.nhnacademy.lastfrontproject.dto.auth.LoginRequest;
import com.nhnacademy.lastfrontproject.dto.auth.RegisterRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.Map;

@RestController
public class AuthController {
    private final AuthAdaptor authAdaptor;
    private final OAuth2AuthorizedClientService authorizedClientService;

    public AuthController(AuthAdaptor authAdaptor, OAuth2AuthorizedClientService authorizedClientService) {
        this.authAdaptor = authAdaptor;
        this.authorizedClientService = authorizedClientService;
    }

    @GetMapping("/sign-in")
    public String signInPage() {
        return "pages/member/pages-sign-in";
    }

    @GetMapping("/sign-up")
    public String signUnPage() {
        return "pages/member/pages-sign-up";
    }

//    @PostMapping("/sign-in")
//    public String signIn(@ModelAttribute LoginRequest loginRequest) {
//        try {
//            authAdaptor.login(loginRequest);
//            return "redirect:/dashboard";
//        } catch (Exception e) {
//            return "pages-sign-in";
//        }
//    }

    @PostMapping("/sign-up")
    public String signUp(@ModelAttribute RegisterRequest registerRequest) {
        try {
            authAdaptor.register(registerRequest);
            return "redirect:/sign-in";
        } catch (Exception e) {
            return "pages-sign-up";
        }
    }

    @GetMapping("/login-success")
    public String getLoginInfo(@AuthenticationPrincipal OAuth2User oauth2User,
                               Authentication authentication, Model model, HttpSession httpSession) {

        // Authentication 객체를 OAuth2AuthenticationToken으로 캐스팅
        OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;

        // 클라이언트 등록 ID 추출 (예: "google", "github")
        String clientRegistrationId = oauthToken.getAuthorizedClientRegistrationId();

        // 인증된 클라이언트 정보 조회
        OAuth2AuthorizedClient client = authorizedClientService.loadAuthorizedClient(
                clientRegistrationId,
                oauthToken.getName()
        );

        // 액세스 토큰 추출
        String accessToken = "Bearer " + client.getAccessToken().getTokenValue();

        String email = oauth2User.getAttribute("email");

        Boolean existsByEmail = authAdaptor.existsByEmail(email);

        model.addAttribute("login", existsByEmail);
        model.addAttribute("userEmail", email);
        model.addAttribute("accessToken", accessToken);

        return "pages/member/pages-additional-info";
    }

    @PostMapping("/set-token-cookie")
    public ResponseEntity<Void> setTokenCookie(@RequestBody Map<String, String> body) {
        String token = body.get("token");

        ResponseCookie cookie = ResponseCookie.from("accessToken", token)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(Duration.ofHours(1))
                .sameSite("None")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .build();
    }
}
