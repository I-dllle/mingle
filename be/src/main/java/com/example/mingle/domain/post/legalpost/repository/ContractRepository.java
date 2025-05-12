package com.example.mingle.domain.post.legalpost.repository;

import com.example.mingle.domain.post.legalpost.entity.Contract;
import com.example.mingle.domain.post.legalpost.enums.ContractStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

@Repository
public interface ContractRepository extends JpaRepository<Contract, Long> {

    List<Contract> findByUserId(Long userId);

    List<Contract> findByStatus(ContractStatus status);

    @Query("SELECT c FROM Contract c JOIN FETCH c.user WHERE c.contractId = :id")
    Optional<Contract> findByIdWithUser(@Param("id") Long id);
}