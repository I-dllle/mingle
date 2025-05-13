package com.example.mingle.domain.post.legalpost.service;

import com.example.mingle.domain.post.legalpost.dto.contract.CreateContractRequest;
import com.example.mingle.domain.post.legalpost.entity.Contract;
import com.example.mingle.domain.post.legalpost.entity.CopyrightContract;
import com.example.mingle.domain.post.legalpost.entity.SettlementRatio;
import com.example.mingle.domain.post.legalpost.enums.ContractStatus;
import com.example.mingle.domain.post.legalpost.enums.ContractType;
import com.example.mingle.domain.post.legalpost.enums.RatioType;
import com.example.mingle.domain.post.legalpost.repository.ContractRepository;
import com.example.mingle.domain.post.legalpost.repository.SettlementRatioRepository;
import com.example.mingle.domain.user.team.entity.ArtistTeam;
import com.example.mingle.domain.user.team.repository.ArtistTeamRepository;
import com.example.mingle.domain.user.user.entity.User;
import com.example.mingle.domain.user.user.repository.UserRepository;
import com.example.mingle.global.aws.AwsS3Uploader;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.URL;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ContractService {

    private final ContractRepository contractRepository;
    private final SettlementRatioRepository ratioRepository;
    private final UserRepository userRepository;
    private final ArtistTeamRepository teamRepository;
    private final AwsS3Uploader s3Uploader;
    private final ModusignService modusignService;

    public Long createContract(CreateContractRequest req, MultipartFile file) throws IOException {
        User user = userRepository.findById(req.getUserId()).orElseThrow();
        ArtistTeam team = teamRepository.findById(req.getTeamId()).orElse(null);

        String fileUrl = s3Uploader.upload(file, "contracts");
        
        Contract contract = new Contract();
        contract.setUser(user);
        contract.setTeam(team);
        contract.setFileUrl(fileUrl); // 실제 S3 업로드된 경로
        contract.setSummary(req.getSummary());
        contract.setTitle(req.getTitle());
        contract.setCompanyName("Mingle");
        contract.setContractCategory(req.getContractCategory());
        contract.setStartDate(req.getStartDate());
        contract.setEndDate(req.getEndDate());
        contract.setStatus(ContractStatus.DRAFT);
        contract.setContractType(req.getContractType());
        contract.setIsSettlementCreated(false);

        contractRepository.save(contract);

        SettlementRatio ratio = new SettlementRatio();
        ratio.setContract(contract);
        ratio.setRatioType(RatioType.ARTIST);
        ratio.setPercentage(req.getSettlementRatio());
        ratioRepository.save(ratio);

        return contract.getContractId();
    }

    public void changeStatus(Long id, ContractStatus next) {
        Contract contract = contractRepository.findById(id).orElseThrow();

        if (!canTransition(contract.getStatus(), next)) {
            throw new IllegalStateException("잘못된 상태 변경");
        }

        contract.setStatus(next);
        contractRepository.save(contract);
    }

    public String signContract(Long contractId, CustomUser user) throws IOException{
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new IllegalArgumentException("계약 없음"));

        if (contract.getModusignDocumentId() != null) {
            throw new IllegalStateException("이미 서명 요청된 계약입니다.");
        }
        if (!contract.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("본인의 계약만 서명할 수 있습니다.");
        }


        // 1. S3에서 다운로드
        byte[] fileBytes = downloadFileFromUrl(contract.getFileUrl());
        String fileName = extractFileNameFromUrl(contract.getFileUrl());

        // 2. 바이트 배열을 임시 File로 저장
        File tempFile = new File(System.getProperty("java.io.tmpdir"), fileName);
        try (FileOutputStream fos = new FileOutputStream(tempFile)) {
            fos.write(fileBytes);
        } catch (IOException e) {
            throw new RuntimeException("임시 파일 생성 실패", e);
        }

        // 3. 모두사인 업로드 및 서명 요청
        String documentId = modusignService.uploadDocumentAsFile(tempFile);
        String signatureUrl = modusignService.createSignatureRequest(documentId, user.getName(), user.getEmail());

        // 4. 계약 업데이트
        contract.setModusignDocumentId(documentId);
        contract.setModusignSignatureUrl(signatureUrl);
        contract.setStatus(ContractStatus.SIGNED);
        contractRepository.save(contract);

        return signatureUrl;
    }

    private byte[] downloadFileFromUrl(String fileUrl) {
        try {
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(fileUrl))
                    .GET()
                    .build();

            HttpResponse<byte[]> response = client.send(request, HttpResponse.BodyHandlers.ofByteArray());

            if (response.statusCode() != 200) {
                throw new RuntimeException("파일 다운로드 실패. 상태 코드: " + response.statusCode());
            }

            return response.body();
        } catch (Exception e) {
            throw new RuntimeException("파일 다운로드 중 오류 발생", e);
        }
    }

    private String extractFileNameFromUrl(String url) {
        return url.substring(url.lastIndexOf("/") + 1);
    }

    public void signOffline(Long id, CustomUser user) {
        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("계약 없음"));

        if (contract.getContractType() != ContractType.PAPER) {
            throw new IllegalStateException("종이 계약이 아닙니다.");
        }

        if (contract.getStatus() != ContractStatus.REVIEW) {
            throw new IllegalStateException("검토 상태만 서명할 수 있습니다.");
        }

        if (!contract.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("본인의 계약만 서명할 수 있습니다.");
        }

        contract.setSignerName(user.getName());
        contract.setSignerMemo("오프라인 서명 완료: " + LocalDateTime.now());
        contract.setStatus(ContractStatus.SIGNED_OFFLINE);

        contractRepository.save(contract);
    }


    private boolean canTransition(ContractStatus current, ContractStatus next) {
        return switch (current) {
            case DRAFT -> next == ContractStatus.REVIEW;
            case REVIEW -> next == ContractStatus.CONFIRMED || next == ContractStatus.SIGNED_OFFLINE;
            case SIGNED_OFFLINE -> next == ContractStatus.CONFIRMED;
            default -> false;
        };
    }
}
