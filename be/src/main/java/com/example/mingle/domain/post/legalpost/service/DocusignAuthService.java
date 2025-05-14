package com.example.mingle.domain.post.legalpost.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
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

    @Value("${docusign.client-id}")
    private String clientId;

    @Value("${docusign.user-id}")
    private String userId;

    @Value("${docusign.private-key-path}")
    private String privateKeyPath;

    @Value("${docusign.auth-url}")
    private String authUrl;

    private final WebClient.Builder webClientBuilder;

    public String generateAccessToken() {
        try {
            PrivateKey privateKey = loadPrivateKeyFromPem();

            String jwt = Jwts.builder()
                    .setIssuer(clientId)
                    .setSubject(userId)
                    .setAudience("account-d.docusign.com")
                    .setExpiration(Date.from(Instant.now().plusSeconds(3600)))
                    .setIssuedAt(new Date())
                    .claim("scope", "signature")
                    .signWith(privateKey, SignatureAlgorithm.RS256)
                    .compact();

            MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
            formData.add("grant_type", "urn:ietf:params:oauth:grant-type:jwt-bearer");
            formData.add("assertion", jwt);

            WebClient client = webClientBuilder.build();

            Map<String, Object> response = client.post()
                    .uri(authUrl)
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .bodyValue(formData)
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                    .block();

            return response.get("access_token").toString();
        } catch (Exception e) {
            throw new RuntimeException("DocuSign access token 발급 실패", e);
        }
    }

    private PrivateKey loadPrivateKeyFromPem() throws Exception {
        InputStream is = new ClassPathResource(privateKeyPath.replace("classpath:", "")).getInputStream();
        String pem = new String(is.readAllBytes(), StandardCharsets.UTF_8);
        String privateKeyContent = pem
                .replace("-----BEGIN PRIVATE KEY-----", "")
                .replace("-----END PRIVATE KEY-----", "")
                .replaceAll("\\s+", "");
        byte[] keyBytes = Base64.getDecoder().decode(privateKeyContent);
        return KeyFactory.getInstance("RSA").generatePrivate(new PKCS8EncodedKeySpec(keyBytes));
    }
}
