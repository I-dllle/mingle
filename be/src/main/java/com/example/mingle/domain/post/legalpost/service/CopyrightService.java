package com.example.mingle.domain.post.legalpost.service;

import com.example.mingle.domain.post.legalpost.dto.copyright.CopyrightContractDto;
import com.example.mingle.domain.post.legalpost.dto.copyright.CreateCopyrightContractRequest;
import com.example.mingle.domain.post.legalpost.entity.CopyrightContract;
import com.example.mingle.domain.post.legalpost.entity.SettlementRatio;
import com.example.mingle.domain.post.legalpost.enums.ContractStatus;
import com.example.mingle.domain.post.legalpost.enums.ContractType;
import com.example.mingle.domain.post.legalpost.enums.RatioType;
import com.example.mingle.domain.post.legalpost.repository.CopyrightRepository;
import com.example.mingle.domain.post.legalpost.repository.SettlementRatioRepository;
import com.example.mingle.domain.user.team.entity.ArtistTeam;
import com.example.mingle.domain.user.team.repository.ArtistTeamRepository;
import com.example.mingle.domain.user.user.entity.User;
import com.example.mingle.domain.user.user.repository.UserRepository;
import com.example.mingle.global.aws.AwsS3Uploader;
import com.example.mingle.global.security.auth.SecurityUser;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CopyrightService {

    private final CopyrightRepository repository;
    private final UserRepository userRepository;
    private final ArtistTeamRepository teamRepository;
    private final CopyrightRepository contractRepository;
    private final SettlementRatioRepository ratioRepository;
    private final AwsS3Uploader s3Uploader;

    public Long createContract(CreateCopyrightContractRequest req, MultipartFile file) throws IOException {
        User user = userRepository.findById(req.getUserId()).orElseThrow();
        ArtistTeam team = teamRepository.findById(req.getTeamId()).orElse(null);

        String fileUrl = s3Uploader.upload(file, "contracts");

        CopyrightContract contract = new CopyrightContract();
        contract.setUser(user);
        contract.setTeam(team);
        contract.setTitle(req.getTitle());
        contract.setCompanyName("Mingle");
        contract.setContentTitle(req.getContentTitle());
        contract.setFileUrl(fileUrl); // 실제 S3 업로드된 경로
        contract.setSummary(req.getSummary());
        contract.setSharePercentage(req.getSharePercentage());
        contract.setStartDate(req.getStartDate());
        contract.setEndDate(req.getEndDate());
        contract.setStatus(ContractStatus.DRAFT);
        contract.setContractType(req.getContractType());


        contractRepository.save(contract);

        SettlementRatio ratio = new SettlementRatio();
        ratio.setRatioType(RatioType.ARTIST);
        ratio.setPercentage(req.getSettlementRatio());
        ratioRepository.save(ratio);

        return contract.getCopyrightContractId();
    }

    public void changeStatus(Long id, ContractStatus next) {
        CopyrightContract contract = contractRepository.findById(id).orElseThrow();

        if (!canTransition(contract.getStatus(), next)) {
            throw new IllegalStateException("잘못된 상태 변경");
        }

        contract.setStatus(next);
        contractRepository.save(contract);
    }

    public void signContract(Long id, SecurityUser user) {
        CopyrightContract contract = contractRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("계약 없음"));

        if (contract.getContractType() != ContractType.ELECTRONIC) {
            throw new IllegalStateException("전자 서명 계약이 아닙니다.");
        }

        if (contract.getStatus() != ContractStatus.REVIEW) {
            throw new IllegalStateException("검토 상태만 서명할 수 있습니다.");
        }

        // 서명자는 본인만 가능
        if (!contract.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("본인의 계약만 서명할 수 있습니다.");
        }

        contract.setSignerName(user.getNickname());
        contract.setSignerMemo("전자 서명 완료: " + LocalDateTime.now());
        contract.setStatus(ContractStatus.SIGNED);

        contractRepository.save(contract);
    }

    public void signOffline(Long id, SecurityUser user) {
        CopyrightContract contract = contractRepository.findById(id)
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

        contract.setSignerName(user.getNickname());
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



public List<CopyrightContractDto> getAll() {
        return repository.findAll().stream()
                .map(CopyrightContractDto::from)
                .toList();
    }

    public CopyrightContractDto getById(Long id) {
        return repository.findById(id)
                .map(CopyrightContractDto::from)
                .orElseThrow(() -> new EntityNotFoundException("저작권 계약 없음"));
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
