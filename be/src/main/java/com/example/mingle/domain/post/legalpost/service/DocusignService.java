package com.example.mingle.domain.post.legalpost.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.Base64;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DocusignService {

    private final WebClient.Builder webClientBuilder;
    private final DocusignAuthService docusignAuthService;

    @Value("${docusign.account-id}")
    private String accountId;

    @Value("${docusign.return-url}")
    private String returnUrl;

    private static final String BASE_URL = "https://demo.docusign.net/restapi/v2.1";

    public String sendEnvelope(File pdfFile, String userName, String userEmail) throws IOException {
        String accessToken = docusignAuthService.generateAccessToken(); // ⬅️ 토큰 동적 발급

        String base64Doc = Base64.getEncoder().encodeToString(Files.readAllBytes(pdfFile.toPath()));

        String subject = "계약서 서명을 요청드립니다.";
        String docName = "계약서";

        Map<String, Object> requestBody = Map.of(
                "emailSubject", subject,
                "documents", List.of(Map.of(
                        "documentBase64", base64Doc,
                        "name", docName,
                        "fileExtension", "pdf",
                        "documentId", "1"
                )),
                "recipients", Map.of(
                        "signers", List.of(Map.of(
                                "email", userEmail,
                                "name", userName,
                                "recipientId", "1",
                                "routingOrder", "1",
                                "tabs", Map.of(
                                        "signHereTabs", List.of(Map.of(
                                                "anchorString", "/sign/",
                                                "anchorUnits", "inches",
                                                "anchorXOffset", "0.5",
                                                "anchorYOffset", "-0.2"
                                        ))
                                )
                        ))
                ),
                "status", "sent"
        );

        // ✅ JSON 출력 로그 (디버깅용)
        ObjectMapper objectMapper = new ObjectMapper();
        String requestJson = objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(requestBody);
        System.out.println("▶ DocuSign Envelope Request JSON:\n" + requestJson);

        WebClient client = webClientBuilder
                .baseUrl(BASE_URL)
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                .build();

        // ✅ Envelope 생성
        Map<String, Object> envelopeResponse = client.post()
                .uri("/accounts/{accountId}/envelopes", accountId)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                .blockOptional()
                .orElseThrow(() -> new RuntimeException("DocuSign envelope creation failed"));

        String envelopeId = envelopeResponse.get("envelopeId").toString();

        // ✅ 서명 요청 뷰 생성
        Map<String, Object> recipientViewRequest = Map.of(
                "returnUrl", returnUrl,
                "authenticationMethod", "none",
                "email", userEmail,
                "userName", userName,
                "recipientId", "1"
        );

        System.out.println("length: " + userName.length()); // 정확한 길이 체크
        System.out.println("equals('kim test'): " + "kim test".equals(userName)); // 완전일치 여부


        Map<String, Object> viewUrl = client.post()
                .uri("/accounts/{accountId}/envelopes/{envelopeId}/views/recipient", accountId, envelopeId)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(recipientViewRequest)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                .blockOptional()
                .orElseThrow(() -> new RuntimeException("DocuSign view URL creation failed"));

        return viewUrl.get("url").toString();
    }

}
