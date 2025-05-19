package com.example.mingle.domain.post.legalpost.repository;

import com.example.mingle.domain.post.legalpost.entity.Contract;
import com.example.mingle.domain.post.legalpost.entity.InternalContract;
import com.example.mingle.domain.post.legalpost.enums.ContractStatus;
import com.example.mingle.domain.user.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface InternalContractRepository extends JpaRepository<InternalContract, Long> {
    @Query("""
    SELECT ic FROM InternalContract ic
    WHERE ic.user = :user
      AND :now BETWEEN ic.startDate AND ic.endDate
""")
    Optional<InternalContract> findValidByUserAndDate(@Param("user") User user, @Param("now") LocalDate now);

    List<InternalContract> findByUserId(Long userId);

    @Query("""
    SELECT ic FROM InternalContract ic
    WHERE ic.endDate BETWEEN CURRENT_DATE AND :deadline
      AND ic.status != :terminated
""")
    List<InternalContract> findExpiringContracts(@Param("deadline") LocalDate deadline,
                                                 @Param("terminated") ContractStatus terminated);

}
