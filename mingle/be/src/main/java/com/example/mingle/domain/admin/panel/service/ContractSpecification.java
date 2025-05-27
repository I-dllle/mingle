package com.example.mingle.domain.admin.panel.service;

import com.example.mingle.domain.admin.panel.dto.ContractSearchCondition;
import com.example.mingle.domain.post.legalpost.entity.Contract;
import com.example.mingle.domain.post.legalpost.enums.ContractStatus;
import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;

import java.util.ArrayList;
import java.util.List;

public class ContractSpecification {

    public static Specification<Contract> build(ContractSearchCondition condition) {
        return (Root<Contract> root, CriteriaQuery<?> query, CriteriaBuilder cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (condition.getTeamId() != null) {
                predicates.add(cb.equal(root.get("team").get("id"), condition.getTeamId()));
            }

            // status 필터 적용
            if (condition.getStatus() != null) {
                // 사용자가 명시적으로 상태를 선택했을 경우
                predicates.add(cb.equal(root.get("status"), condition.getStatus()));
            } else {
                // 선택하지 않은 경우에는 TERMINATED 제외
                predicates.add(cb.notEqual(root.get("status"), ContractStatus.TERMINATED));
            }

            if (condition.getContractType() != null) {
                predicates.add(cb.equal(root.get("contractType"), condition.getContractType()));
            }

            if (condition.getContractCategory() != null) {
                predicates.add(cb.equal(root.get("contractCategory"), condition.getContractCategory()));
            }

            if (condition.getStartDateFrom() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("startDate"), condition.getStartDateFrom()));
            }

            if (condition.getStartDateTo() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("startDate"), condition.getStartDateTo()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
