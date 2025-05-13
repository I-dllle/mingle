package com.example.mingle.domain.post.legalpost.service;

import com.docusign.esign.api.EnvelopesApi;
import com.docusign.esign.client.ApiClient;
import com.docusign.esign.client.ApiException;
import com.docusign.esign.model.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.Base64;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DocusignService {

    private final DocusignAuthProvider authProvider;

    @Value("${docusign.return-url}")
    private String returnUrl; // 서명 완료 후 리디렉션 URL

    public String sendEnvelope(File pdfFile, String userName, String userEmail) throws IOException, ApiException {
        // 1. 인증된 ApiClient 준비
        ApiClient apiClient = authProvider.getApiClient();

        // 2. 문서 파일 → Base64 인코딩
        String base64Doc = Base64.getEncoder().encodeToString(Files.readAllBytes(pdfFile.toPath()));

        // 3. Document 정의
        Document doc = new Document();
        doc.setDocumentBase64(base64Doc);
        doc.setName("계약서");
        doc.setFileExtension("pdf");
        doc.setDocumentId("1");

        // 4. 수신자 및 서명 탭 정의
        Signer signer = new Signer();
        signer.setEmail(userEmail);
        signer.setName(userName);
        signer.setRecipientId("1");
        signer.setRoutingOrder("1");

        // PDF 내 서명 위치는 /sign/ 같은 앵커 태그로 정의 (템플릿 기반이 아닌 경우엔 직접 위치 지정 필요)
        SignHere signHere = new SignHere();
        signHere.setAnchorString("/sign/");
        signHere.setAnchorUnits("pixels");
        signHere.setAnchorXOffset("0");
        signHere.setAnchorYOffset("0");

        Tabs tabs = new Tabs();
        tabs.setSignHereTabs(List.of(signHere));
        signer.setTabs(tabs);

        Recipients recipients = new Recipients();
        recipients.setSigners(List.of(signer));

        // 5. Envelope 정의
        EnvelopeDefinition envelope = new EnvelopeDefinition();
        envelope.setEmailSubject("계약서 서명을 요청드립니다.");
        envelope.setDocuments(List.of(doc));
        envelope.setRecipients(recipients);
        envelope.setStatus("sent");

        // 6. Envelope 생성
        EnvelopesApi envelopesApi = new EnvelopesApi(apiClient);
        EnvelopeSummary envelopeSummary = envelopesApi.createEnvelope(authProvider.getAccountId(), envelope);

        // 7. 서명 URL 생성
        RecipientViewRequest viewRequest = new RecipientViewRequest();
        viewRequest.setReturnUrl(returnUrl); // 서명 완료 후 이동할 URL
        viewRequest.setAuthenticationMethod("none");
        viewRequest.setEmail(userEmail);
        viewRequest.setUserName(userName);
        viewRequest.setRecipientId("1");

        ViewUrl viewUrl = envelopesApi.createRecipientView(
                authProvider.getAccountId(),
                envelopeSummary.getEnvelopeId(),
                viewRequest
        );

        return viewUrl.getUrl(); // 사용자가 서명하러 갈 수 있는 URL
    }
}
