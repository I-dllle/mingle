package com.example.mingle.global.scheduler;

import com.example.mingle.domain.post.legalpost.entity.Contract;
import com.example.mingle.domain.post.legalpost.entity.InternalContract;
import com.example.mingle.domain.post.legalpost.enums.ContractStatus;
import com.example.mingle.domain.post.legalpost.repository.ContractRepository;
import com.example.mingle.domain.post.legalpost.repository.InternalContractRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class CleanupScheduler {

    private final ContractRepository contractRepository;
    private final InternalContractRepository internalContractRepository;
    // 매일 새벽 3시에 실행 (cron: 초 분 시 일 월 요일)
    @Scheduled(cron = "0 0 3 * * *")
    public void deleteOldSoftDeletedPosts() {
        LocalDateTime threshold = LocalDateTime.now().minusDays(15);
        List<Contract> oldDeletedContract = contractRepository.findAllByStatusAndUpdatedAtBefore(ContractStatus.TERMINATED, threshold);
        List<InternalContract> oldDeletedInternalContract = internalContractRepository.findAllByStatusAndUpdatedAtBefore(ContractStatus.TERMINATED, threshold);

        contractRepository.deleteAll(oldDeletedContract);
        internalContractRepository.deleteAll(oldDeletedInternalContract);
        System.out.println("[Scheduler] 하드 삭제된 외부 계약수: " + oldDeletedContract.size());
        System.out.println("[Scheduler] 하드 삭제된 내부 계약수: " + oldDeletedInternalContract.size());
    }
}
