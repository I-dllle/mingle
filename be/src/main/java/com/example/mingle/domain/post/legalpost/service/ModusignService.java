package com.example.mingle.domain.post.legalpost.service;

import com.example.mingle.domain.post.legalpost.enums.ContractStatus;
import com.example.mingle.domain.post.legalpost.repository.ContractRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ModusignService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private String accessToken = "YOUR_ACCESS_TOKEN"; // 실제 발급받은 토큰으로 대체

    public String uploadDocument(MultipartFile multipartFile) throws IOException {
        File convFile = new File(System.getProperty("java.io.tmpdir") + "/" + multipartFile.getOriginalFilename());
        FileOutputStream fos = new FileOutputStream(convFile);
        fos.write(multipartFile.getBytes());
        fos.close();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        headers.setBearerAuth(accessToken);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", new FileSystemResource(convFile));
        body.add("title", "아티스트 계약서");

        HttpEntity<MultiValueMap<String, Object>> request = new HttpEntity<>(body, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(
                "https://api.modusign.co.kr/api/v1/documents",
                request,
                String.class
        );

        JsonNode jsonNode = objectMapper.readTree(response.getBody());
        return jsonNode.get("documentId").asText();
    }

    public String createSignatureRequest(String documentId, String name, String email) throws IOException {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(accessToken);

        String json = """
            {
              "documentId": "%s",
              "title": "아티스트 계약서 서명 요청",
              "message": "계약 내용을 확인 후 서명해 주세요.",
              "recipients": [
                {
                  "name": "%s",
                  "email": "%s",
                  "type": "SIGNER"
                }
              ],
              "useSms": false,
              "useKakao": true
            }
        """.formatted(documentId, name, email);

        HttpEntity<String> request = new HttpEntity<>(json, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(
                "https://api.modusign.co.kr/api/v1/signature-requests",
                request,
                String.class
        );

        JsonNode jsonNode = objectMapper.readTree(response.getBody());
        return jsonNode.get("url").asText(); // 서명 URL 반환
    }

    public String checkSignatureStatus(String signatureRequestId) throws IOException {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<String> response = restTemplate.exchange(
                "https://api.modusign.co.kr/api/v1/signature-requests/" + signatureRequestId,
                HttpMethod.GET,
                entity,
                String.class
        );

        JsonNode jsonNode = objectMapper.readTree(response.getBody());
        return jsonNode.get("status").asText();
    }

    public ResponseEntity<byte[]> downloadSignedPdf(String documentId) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<byte[]> response = restTemplate.exchange(
                "https://api.modusign.co.kr/api/v1/documents/" + documentId + "/download",
                HttpMethod.GET,
                entity,
                byte[].class
        );

        return response;
    }


    public String uploadDocumentAsFile(File file) throws IOException {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        headers.setBearerAuth(accessToken);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", new FileSystemResource(file));
        body.add("title", "아티스트 계약서");

        HttpEntity<MultiValueMap<String, Object>> request = new HttpEntity<>(body, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(
                "https://api.modusign.co.kr/api/v1/documents",
                request,
                String.class
        );

        JsonNode jsonNode = objectMapper.readTree(response.getBody());
        return jsonNode.get("documentId").asText();
    }

}
