package com.example.mingle.domain.post.legalpost.service;

import com.docusign.esign.client.ApiClient;
import com.docusign.esign.client.auth.OAuth;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Getter
public class DocusignAuthProvider {

    @Value("${docusign.integration-key}")
    private String integrationKey;

    @Value("${docusign.user-id}")
    private String userId;

    @Value("${docusign.account-id}")
    private String accountId;

    @Value("${docusign.base-path}")
    private String basePath; // ex: https://demo.docusign.net/restapi

    @Value("${docusign.private-key}")
    private String privateKey;

    public ApiClient getApiClient() {
        ApiClient apiClient = new ApiClient(basePath);
        apiClient.setOAuthBasePath("account-d.docusign.com");

        try {
            OAuth.OAuthToken token = apiClient.requestJWTUserToken(
                    integrationKey,
                    userId,
                    List.of("signature"),
                    privateKey.getBytes(),
                    3600
            );
            apiClient.setAccessToken(token.getAccessToken(), token.getExpiresIn());
            return apiClient;
        } catch (Exception e) {
            throw new RuntimeException("DocuSign 인증 실패", e);
        }
    }
}
