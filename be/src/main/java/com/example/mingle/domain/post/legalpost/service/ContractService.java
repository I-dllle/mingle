package com.example.mingle.domain.post.legalpost.service;

import com.example.mingle.domain.post.legalpost.dto.CreateContractRequest;
import com.example.mingle.domain.post.legalpost.dto.SignContractRequest;
import com.example.mingle.domain.post.legalpost.entity.Contract;
import com.example.mingle.domain.post.legalpost.entity.Settlement;
import com.example.mingle.domain.post.legalpost.entity.SettlementRatio;
import com.example.mingle.domain.post.legalpost.enums.ContractStatus;
import com.example.mingle.domain.post.legalpost.enums.ContractType;
import com.example.mingle.domain.post.legalpost.enums.RatioType;
import com.example.mingle.domain.post.legalpost.enums.SettlementCategory;
import com.example.mingle.domain.post.legalpost.repository.ContractRepository;
import com.example.mingle.domain.post.legalpost.repository.SettlementRatioRepository;
import com.example.mingle.domain.post.legalpost.repository.SettlementRepository;
import com.example.mingle.domain.user.artist.repository.ArtistRepository;
import com.example.mingle.domain.user.team.entity.ArtistTeam;
import com.example.mingle.domain.user.team.repository.ArtistTeamRepository;
import com.example.mingle.domain.user.user.entity.User;
import com.example.mingle.domain.user.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ContractService {
    private final ContractRepository contractRepository;
    private final SettlementRatioRepository ratioRepository;
    private final UserRepository userRepository;
    private final ArtistTeamRepository teamRepository;

    public Long createContract(CreateContractRequest req) {
        User user = userRepository.findById(req.getUserId()).orElseThrow();
        ArtistTeam team = teamRepository.findById(req.getTeamId()).orElse(null);

        Contract contract = new Contract();
        contract.setUser(user);
        contract.setTeam(team);
        contract.setFileUrl("https://example.com/files/contract1.pdf");
        contract.setSummary(req.getSummary());
        contract.setStartDate(req.getStartDate());
        contract.setEndDate(req.getEndDate());
        contract.setStatus(ContractStatus.DRAFT);
        contract.setContractType(ContractType.ELECTRONIC);
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

    public void signContract(Long id, SignContractRequest req) {
        Contract contract = contractRepository.findById(id).orElseThrow();

        if (contract.getStatus() != ContractStatus.REVIEW) {
            throw new IllegalStateException("검토 상태만 서명 가능");
        }

        contract.setSignerName(req.getSignerName());
        contract.setSignerMemo(req.getSignerMemo());
        contract.setStatus(ContractStatus.CONFIRMED);

        contractRepository.save(contract);
    }

    private boolean canTransition(ContractStatus current, ContractStatus next) {
        return switch (current) {
            case DRAFT -> next == ContractStatus.REVIEW;
            case REVIEW -> next == ContractStatus.CONFIRMED;
            default -> false;
        };
    }
}
