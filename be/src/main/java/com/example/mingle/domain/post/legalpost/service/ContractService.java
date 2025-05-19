package com.example.mingle.domain.post.legalpost.service;

import com.example.mingle.domain.admin.panel.dto.ContractConditionResponse;
import com.example.mingle.domain.admin.panel.dto.ContractResponse;
import com.example.mingle.domain.admin.panel.dto.ContractSearchCondition;
import com.example.mingle.domain.admin.panel.service.ContractSpecification;
import com.example.mingle.domain.post.legalpost.dto.contract.CreateContractRequest;
import com.example.mingle.domain.post.legalpost.dto.contract.CreateInternalContractRequest;
import com.example.mingle.domain.post.legalpost.entity.Contract;
import com.example.mingle.domain.post.legalpost.entity.InternalContract;
import com.example.mingle.domain.post.legalpost.entity.SettlementRatio;
import com.example.mingle.domain.post.legalpost.enums.ContractCategory;
import com.example.mingle.domain.post.legalpost.enums.ContractStatus;
import com.example.mingle.domain.post.legalpost.enums.ContractType;
import com.example.mingle.domain.post.legalpost.enums.RatioType;
import com.example.mingle.domain.post.legalpost.repository.ContractRepository;
import com.example.mingle.domain.post.legalpost.repository.InternalContractRepository;
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
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDate;
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
    private final InternalContractRepository internalContractRepository;

    public Long createContract(CreateContractRequest req, MultipartFile file) throws IOException {
        User user1 = userRepository.findById(req.userId()).orElseThrow();
        ArtistTeam team = teamRepository.findById(req.teamId()).orElse(null);
        String fileUrl = s3Uploader.upload(file, "contracts");

        Contract contract = new Contract();
        contract.setUser(user1);
        contract.setTeam(team);
        contract.setFileUrl(fileUrl);
        contract.setSummary(req.summary());
        contract.setTitle(req.title());
        contract.setCompanyName("Mingle");
        contract.setContractCategory(req.contractCategory());
        contract.setStartDate(req.startDate());
        contract.setEndDate(req.endDate());
        contract.setStatus(ContractStatus.DRAFT);
        contract.setContractType(req.contractType());
        contract.setContractAmount(req.contractAmount());

        contractRepository.save(contract);

        if (req.useManualRatios()) {
            // 👇 수동 입력 방식
            for (CreateContractRequest.SettlementRatioDto dto : req.ratios()) {
                SettlementRatio ratio = new SettlementRatio();

                if (dto.userId() != null) {
                    User user = userRepository.findById(dto.userId()).orElseThrow();
                    ratio.setUser(user);
                    contract.getParticipants().add(user);
                } else {
                    ratio.setUser(null); // 회사 몫
                }
                ratio.setContract(contract);
                ratio.setRatioType(dto.ratioType());
                ratio.setPercentage(dto.percentage());
                ratioRepository.save(ratio);
            }
            contractRepository.save(contract);

        } else {
            // 👇 내부계약 기반 자동 방식
            BigDecimal sum = BigDecimal.ZERO;

// 1. 유저 기반 비율 저장 (아티스트/프로듀서)
            for (Long userId : req.targetUserIds()) {
                User user = userRepository.findById(userId).orElseThrow();
                contract.getParticipants().add(user);

                InternalContract internal = internalContractRepository
                        .findValidByUserAndDate(user, LocalDate.now())
                        .orElseThrow(() -> new IllegalStateException("내부 계약 없음"));

                BigDecimal userRatio = internal.getDefaultRatio();
                sum = sum.add(userRatio);

                SettlementRatio ratio = new SettlementRatio();
                ratio.setContract(contract);
                ratio.setRatioType(internal.getRatioType()); // ARTIST, PRODUCER 등
                ratio.setUser(user);
                ratio.setPercentage(userRatio);
                ratioRepository.save(ratio);
            }

// 2. 회사 몫 자동 계산 (100 - 참여자 비율 합계)
            BigDecimal companyRatio = BigDecimal.valueOf(100).subtract(sum);
            if (companyRatio.compareTo(BigDecimal.ZERO) > 0) {
                SettlementRatio agencyRatio = new SettlementRatio();
                agencyRatio.setContract(contract);
                agencyRatio.setRatioType(RatioType.AGENCY); // 회사 몫
                agencyRatio.setUser(null); // 유저 없음
                agencyRatio.setPercentage(companyRatio);
                ratioRepository.save(agencyRatio);
            }
            contractRepository.save(contract);
        }

        return contract.getId();
    }

    // 내부 계약 생성
    @Transactional
    public Long create(CreateInternalContractRequest req, MultipartFile file) throws IOException {
        User user = userRepository.findById(req.userId())
                .orElseThrow(() -> new EntityNotFoundException("사용자 없음"));

        String fileUrl = s3Uploader.upload(file, "internal-contracts"); // S3 경로 등

        InternalContract contract = new InternalContract();
        contract.setUser(user);
        contract.setRatioType(req.ratioType());
        contract.setDefaultRatio(req.defaultRatio());
        contract.setStartDate(req.startDate());
        contract.setEndDate(req.endDate());
        contract.setStatus(ContractStatus.DRAFT);
        contract.setFileUrl(fileUrl);

        internalContractRepository.save(contract);
        return contract.getId();
    }

    public void changeStatus(Long id, ContractStatus next, ContractCategory category) {
        if (category == ContractCategory.INTERNAL) {
            InternalContract internal = internalContractRepository.findById(id)
                    .orElseThrow(() -> new EntityNotFoundException("내부 계약 없음"));

            if (!canTransition(internal.getStatus(), next)) {
                throw new IllegalStateException("잘못된 상태 변경");
            }

            internal.setStatus(next);
            internalContractRepository.save(internal);

        } else {
            Contract contract = contractRepository.findById(id)
                    .orElseThrow(() -> new EntityNotFoundException("외부 계약 없음"));

            if (!canTransition(contract.getStatus(), next)) {
                throw new IllegalStateException("잘못된 상태 변경");
            }

            contract.setStatus(next);
            contractRepository.save(contract);
        }
    }

//    public String signContract(Long contractId, SecurityUser user) throws IOException {
//        Contract contract = contractRepository.findById(contractId)
//                .orElseThrow(() -> new IllegalArgumentException("계약 없음"));
//        System.out.println("✔ 계약 조회 완료: " + contract.getTitle());
//
//        byte[] fileBytes = downloadFileFromUrl(contract.getFileUrl());
//        System.out.println("✔ 파일 다운로드 완료");
//
//        String fileName = extractFileNameFromUrl(contract.getFileUrl());
//        File tempFile = new File(System.getProperty("java.io.tmpdir"), fileName);
//        try (FileOutputStream fos = new FileOutputStream(tempFile)) {
//            fos.write(fileBytes);
//        }
//        System.out.println("✔ 임시 파일 생성 완료: " + tempFile.getAbsolutePath());
//
//        String signatureUrl = docusignService.sendEnvelope(tempFile, user.getNickname(), user.getEmail());
//        System.out.println("✔ DocuSign 서명 URL 발급 완료");
//
//        contract.setDocusignUrl(signatureUrl);
//        contract.setSignerName(user.getNickname());
//        contract.setStatus(ContractStatus.SIGNED);
//        contractRepository.save(contract);
//
//        return signatureUrl;
//    }

    public String signContract(Long contractId, SecurityUser user) throws IOException {
        InternalContract contract = internalContractRepository.findById(contractId)
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
        internalContractRepository.save(contract);

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

    public String getContractFileUrl(Long id, ContractCategory category) {
        switch (category) {
            case EXTERNAL -> {
                Contract contract = contractRepository.findById(id)
                        .orElseThrow(() -> new ApiException(ErrorCode.CONTRACT_NOT_FOUND));
                return contract.getFileUrl();
            }
            case INTERNAL -> {
                InternalContract internal = internalContractRepository.findById(id)
                        .orElseThrow(() -> new ApiException(ErrorCode.CONTRACT_NOT_FOUND));
                return internal.getFileUrl();
            }
            default -> throw new IllegalArgumentException("지원하지 않는 계약 카테고리입니다.");
        }
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

    public List<ContractResponse> getExpiringContracts(ContractCategory category) {
        LocalDate deadline = LocalDate.now().plusDays(30);

        return switch (category) {
            case EXTERNAL -> {
                List<Contract> contracts = contractRepository.findExpiringContracts(deadline, ContractStatus.TERMINATED);
                yield contracts.stream()
                        .map(ContractResponse::from)
                        .toList();
            }
            case INTERNAL -> {
                List<InternalContract> internals = internalContractRepository.findExpiringContracts(deadline, ContractStatus.TERMINATED);
                yield internals.stream()
                        .map(ContractResponse::fromInternal)
                        .toList();
            }
            default -> throw new IllegalArgumentException("지원하지 않는 계약 카테고리입니다.");
        };
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
