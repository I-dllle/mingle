package com.example.mingle.domain.post.legalpost.service;


import com.example.mingle.domain.admin.panel.dto.ContractConditionResponse;
import com.example.mingle.domain.admin.panel.dto.ContractResponse;
import com.example.mingle.domain.admin.panel.dto.ContractSearchCondition;
import com.example.mingle.domain.admin.panel.service.ContractSpecification;
import com.example.mingle.domain.post.legalpost.dto.contract.CreateContractRequest;
import com.example.mingle.domain.post.legalpost.entity.Contract;
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

import com.example.mingle.global.exception.ApiException;
import com.example.mingle.global.exception.ErrorCode;
import com.example.mingle.global.security.SecurityUser;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.AccessDeniedException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ContractService {

    private final ContractRepository contractRepository;
    private final SettlementRatioRepository ratioRepository;
    private final UserRepository userRepository;
    private final ArtistTeamRepository teamRepository;
    private final AwsS3Uploader s3Uploader;
    private final DocusignService docusignService;

    public Long createContract(CreateContractRequest req, MultipartFile file) throws IOException {
        User user = userRepository.findById(req.getUserId()).orElseThrow();
        ArtistTeam team = teamRepository.findById(req.getTeamId()).orElse(null);

        String fileUrl = s3Uploader.upload(file, "contracts");

        Contract contract = new Contract();
        contract.setUser(user);
        contract.setTeam(team);
        contract.setFileUrl(fileUrl);
        contract.setSummary(req.getSummary());
        contract.setTitle(req.getTitle());
        contract.setCompanyName("Mingle");
        contract.setContractCategory(req.getContractCategory());
        contract.setStartDate(req.getStartDate());
        contract.setEndDate(req.getEndDate());
        contract.setStatus(ContractStatus.DRAFT);
        contract.setContractType(req.getContractType());
        contract.setContractAmount(req.getContractAmount());

        contractRepository.save(contract);


        SettlementRatio ratio = new SettlementRatio();
        ratio.setContract(contract);
        ratio.setRatioType(req.getRatioType());
        ratio.setUser(user);
        ratio.setPercentage(req.getSettlementRatio());
        ratioRepository.save(ratio);

        return contract.getId();
    }

    public void changeStatus(Long id, ContractStatus next) {
        Contract contract = contractRepository.findById(id).orElseThrow();

        if (!canTransition(contract.getStatus(), next)) {
            throw new IllegalStateException("잘못된 상태 변경");
        }

        contract.setStatus(next);
        contractRepository.save(contract);
    }

    public String signContract(Long contractId, SecurityUser user) throws IOException {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new IllegalArgumentException("계약 없음"));
        System.out.println("✔ 계약 조회 완료: " + contract.getTitle());

        byte[] fileBytes = downloadFileFromUrl(contract.getFileUrl());
        System.out.println("✔ 파일 다운로드 완료");

        String fileName = extractFileNameFromUrl(contract.getFileUrl());
        File tempFile = new File(System.getProperty("java.io.tmpdir"), fileName);
        try (FileOutputStream fos = new FileOutputStream(tempFile)) {
            fos.write(fileBytes);
        }
        System.out.println("✔ 임시 파일 생성 완료: " + tempFile.getAbsolutePath());

        String signatureUrl = docusignService.sendEnvelope(tempFile, user.getNickname(), user.getEmail());
        System.out.println("✔ DocuSign 서명 URL 발급 완료");

        contract.setDocusignUrl(signatureUrl);
        contract.setSignerName(user.getNickname());
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

    public void signOfflineAsAdmin(Long id, String signerName, String memo) {
        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("계약 없음"));

        if (contract.getContractType() != ContractType.PAPER) {
            throw new IllegalStateException("종이 계약이 아닙니다.");
        }

        if (contract.getStatus() != ContractStatus.REVIEW) {
            throw new IllegalStateException("검토 상태만 서명할 수 있습니다.");
        }

        contract.setSignerName(signerName);
        contract.setSignerMemo("오프라인 서명 메모: " + memo);
        contract.setStatus(ContractStatus.SIGNED_OFFLINE);

        contractRepository.save(contract);
    }


    private boolean canTransition(ContractStatus current, ContractStatus next) {
        return switch (current) {
            case DRAFT -> next == ContractStatus.REVIEW;
            case REVIEW -> next == ContractStatus.CONFIRMED || next == ContractStatus.SIGNED_OFFLINE;
            case SIGNED_OFFLINE, SIGNED -> next == ContractStatus.CONFIRMED;
            default -> false;
        };
    }

    public String getContractFileUrl(Long id) {
        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new ApiException(ErrorCode.CONTRACT_NOT_FOUND));

        return contract.getFileUrl();
    }

    public Page<ContractResponse> getContractsByFilter(ContractSearchCondition condition, Pageable pageable) {
        return contractRepository.findAll(
                ContractSpecification.build(condition), pageable
        ).map(ContractResponse::from);
    }

    public ContractConditionResponse getContractConditions(Long id) {
        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new ApiException(ErrorCode.CONTRACT_NOT_FOUND));
        return ContractConditionResponse.from(contract);
    }

    public List<ContractResponse> getExpiringContracts() {
        LocalDate deadline = LocalDate.now().plusDays(30);
        List<Contract> contracts = contractRepository.findExpiringContracts(deadline, ContractStatus.TERMINATED);
        return contracts.stream()
                .map(ContractResponse::from)
                .toList();
    }

    public Long getMonthlyContractCount() {
        LocalDate now = LocalDate.now();
        LocalDate startOfMonth = now.withDayOfMonth(1);
        LocalDate endOfMonth = now.withDayOfMonth(now.lengthOfMonth());

        return contractRepository.countByCreatedAtBetween(startOfMonth.atStartOfDay(), endOfMonth.atTime(LocalTime.MAX));
    }

    public Map<ContractStatus, Long> getContractStatusSummary() {
        List<Object[]> result = contractRepository.countContractsByStatus();
        return result.stream()
                .collect(Collectors.toMap(
                        row -> (ContractStatus) row[0],
                        row -> (Long) row[1]
                ));
    }

}
