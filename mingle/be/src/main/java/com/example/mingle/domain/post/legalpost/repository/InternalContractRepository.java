package com.example.mingle.domain.post.legalpost.repository;

import com.example.mingle.domain.post.legalpost.entity.Contract;
import com.example.mingle.domain.post.legalpost.entity.InternalContract;
import com.example.mingle.domain.post.legalpost.enums.ContractStatus;
import com.example.mingle.domain.post.post.entity.Post;
import com.example.mingle.domain.user.user.entity.User;
import org.hibernate.Internal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface InternalContractRepository extends JpaRepository<InternalContract, Long> {
    @Query("""
    SELECT ic FROM InternalContract ic
    WHERE ic.user = :user
      AND :now BETWEEN ic.startDate AND ic.endDate
      AND ic.status != :terminatedStatus
""")
    Optional<InternalContract> findValidByUserAndDate(
            @Param("user") User user,
            @Param("now") LocalDate now,
            @Param("terminatedStatus") ContractStatus terminatedStatus
    );


    @Query("""
    SELECT i FROM InternalContract i
    WHERE i.user.id = :userId
      AND i.status != :excludedStatus
""")
    Page<InternalContract> findByUserIdAndStatusNot(
            @Param("userId") Long userId,
            @Param("excludedStatus") ContractStatus excludedStatus,
            Pageable pageable
    );


    @Query("""
    SELECT ic FROM InternalContract ic
    WHERE ic.endDate BETWEEN CURRENT_DATE AND :deadline
      AND ic.status != :terminated
""")
    List<InternalContract> findExpiringContracts(@Param("deadline") LocalDate deadline,
                                                 @Param("terminated") ContractStatus terminated);

    // 특정 시간이 지난 게시물을 가져오는 메서드
    List<InternalContract> findAllByStatusAndUpdatedAtBefore(ContractStatus status, LocalDateTime time);


    // 내부 계약서 페이징 + TERMINATED 제외
    @Query("""
    SELECT c FROM InternalContract c
    WHERE c.status NOT IN :excludedStatuses
""")
    Page<InternalContract> findAllByStatusNotIn(@Param("excludedStatuses") List<ContractStatus> excludedStatuses, Pageable pageable);

}
