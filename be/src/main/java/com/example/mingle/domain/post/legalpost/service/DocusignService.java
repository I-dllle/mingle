package com.example.mingle.domain.post.legalpost.service;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.core.ParameterizedTypeReference;

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

    @Value("${external.docusign.account-id}")
    private String accountId;

    @Value("${external.docusign.return-url}")
    private String returnUrl;

    private static final String BASE_URL = "https://demo.docusign.net/restapi/v2.1";

    public String sendEnvelope(File pdfFile, String userName, String userEmail) throws IOException {
        String accessToken = docusignAuthService.generateAccessToken();

        String base64Doc = Base64.getEncoder().encodeToString(Files.readAllBytes(pdfFile.toPath()));

        String subject = "계약서 서명을 요청드립니다.";
        String docName = "전속계약서.pdf";

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
                                "name", userName != null ? userName : "서명자",
                                "recipientId", "1",
                                "routingOrder", "1",
                                "clientUserId", "1234",
                                "tabs", Map.of(
                                        "signHereTabs", List.of(Map.of(
                                                "documentId", "1",
                                                "pageNumber", "1",
                                                "xPosition", "100",
                                                "yPosition", "400"
                                        ))
                                )
                        ))
                ),
                "status", "sent"
        );

        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.configure(JsonGenerator.Feature.ESCAPE_NON_ASCII, false);
        String requestJson = objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(requestBody);
        System.out.println("▶ DocuSign Envelope Request JSON:\n" + requestJson);

        WebClient client = webClientBuilder
                .baseUrl(BASE_URL)
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();

        Map<String, Object> envelopeResponse = client.post()
                .uri("/accounts/{accountId}/envelopes", accountId)
                .bodyValue(requestJson)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                .blockOptional()
                .orElseThrow(() -> new RuntimeException("DocuSign envelope creation failed"));

        String envelopeId = envelopeResponse.get("envelopeId").toString();

        Map<String, Object> recipientViewRequest = Map.of(
                "returnUrl", returnUrl,
                "authenticationMethod", "none",
                "email", userEmail,
                "userName", userName != null ? userName : "서명자",
                "recipientId", "1",
                "clientUserId", "1234"
        );

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
