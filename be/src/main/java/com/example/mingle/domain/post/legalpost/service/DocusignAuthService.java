package com.example.mingle.domain.post.legalpost.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import com.fasterxml.jackson.core.type.TypeReference;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.time.Instant;
import java.util.Base64;
import java.util.Date;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DocusignAuthService {

    @Value("${external.docusign.client-id}")
    private String clientId;

    @Value("${external.docusign.user-id}")
    private String userId;

    @Value("${external.docusign.private-key-path}")
    private String privateKeyPath;

    @Value("${external.docusign.auth-url}")
    private String authUrl;

    private final WebClient.Builder webClientBuilder;

    public String generateAccessToken() {
        try {
            System.out.println("▶ DocuSign accessToken 발급 시작");

            PrivateKey privateKey = loadPrivateKeyFromPem();

            String jwt = Jwts.builder()
                    .setIssuer(clientId)
                    .setSubject(userId)
                    .setAudience("account-d.docusign.com")
                    .setExpiration(Date.from(Instant.now().plusSeconds(3600)))
                    .setIssuedAt(new Date())
                    .claim("scope", "signature impersonation") // impersonation 스코프 추가 필요할 수 있음
                    .signWith(privateKey, SignatureAlgorithm.RS256)
                    .compact();

            MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
            formData.add("grant_type", "urn:ietf:params:oauth:grant-type:jwt-bearer");
            formData.add("assertion", jwt);

            WebClient client = webClientBuilder.build();

            // 한 번만 요청하고 raw JSON 받아서 파싱
            String responseBody = client.post()
                    .uri(authUrl)
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .bodyValue(formData)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            System.out.println("DocuSign Token Response: " + responseBody);

            Map<String, Object> response = new ObjectMapper()
                    .readValue(responseBody, new TypeReference<>() {});

            return response.get("access_token").toString();

        } catch (Exception e) {
            e.printStackTrace(); // 로그 꼭 찍자
            throw new RuntimeException("DocuSign access token 발급 실패", e);
        }
    }


    private PrivateKey loadPrivateKeyFromPem() throws Exception {
        InputStream is = new ClassPathResource(privateKeyPath.replace("classpath:", "")).getInputStream();
        String pem = new String(is.readAllBytes(), StandardCharsets.UTF_8);

        String privateKeyContent = pem
                .replace("-----BEGIN PRIVATE KEY-----", "")
                .replace("-----END PRIVATE KEY-----", "")
                .replaceAll("\\s+", ""); // 🔥 줄바꿈, 공백 전부 제거

        byte[] keyBytes = Base64.getDecoder().decode(privateKeyContent);
        PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(keyBytes);
        return KeyFactory.getInstance("RSA").generatePrivate(keySpec);
    }
}
