package com.example.mingle.domain.admin.panel.service;

import com.example.mingle.domain.admin.panel.dto.ContractSearchCondition;
import com.example.mingle.domain.admin.panel.dto.InternalSearchCondition;
import com.example.mingle.domain.post.legalpost.entity.InternalContract;
import com.example.mingle.domain.post.legalpost.enums.ContractStatus;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class InternalContractSpecification {

    public static Specification<InternalContract> build(InternalSearchCondition condition) {
        return (Root<InternalContract> root, CriteriaQuery<?> query, CriteriaBuilder cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (condition.getTeamId() != null) {
                predicates.add(cb.equal(root.get("team").get("id"), condition.getTeamId()));
            }

            // 상태 필터
            if (condition.getStatus() != null) {
                predicates.add(cb.equal(root.get("status"), condition.getStatus()));
            } else {
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

            if (condition.getUserId() != null) {
                predicates.add(cb.equal(root.get("user").get("id"), condition.getUserId()));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
