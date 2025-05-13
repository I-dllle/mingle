package com.example.mingle.domain.post.legalpost.controller;

import com.example.mingle.domain.post.legalpost.entity.Contract;
import com.example.mingle.domain.post.legalpost.enums.ContractStatus;
import com.example.mingle.domain.post.legalpost.repository.ContractRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.Optional;

// Webhook 콜백 처리용 예시 컨트롤러
@RestController
@RequestMapping("/api/v1/webhook/modusign")
@RequiredArgsConstructor
public class ApiV1ModuSignController {

    private final ContractRepository contractRepository;

    @PostMapping("/callback")
    public ResponseEntity<String> handleCallback(@RequestBody Map<String, Object> payload) {
        String event = (String) payload.get("event");
        String documentId = (String) payload.get("documentId");
        String signedUrl = (String) payload.get("signedUrl");

        if ("signature.completed".equals(event)) {
            // 1. 계약서 찾기
            Optional<Contract> optionalContract = contractRepository.findByModusignDocumentId(documentId);
            if (optionalContract.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("계약서 없음");
            }

            Contract contract = optionalContract.get();

            // 2. 계약서 상태 업데이트
            contract.setStatus(ContractStatus.SIGNED);
            contract.setModusignSignedUrl(signedUrl); // 서명 완료된 PDF 저장 가능
            contractRepository.save(contract);

            System.out.println("[MODUSIGN] 서명 완료 - documentId: " + documentId);
        }

        return ResponseEntity.ok("ok");
    }
}