package com.example.mingle.domain.user.team.repository;

import com.example.mingle.domain.user.team.entity.Department;
import com.example.mingle.domain.user.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DepartmentRepository extends JpaRepository<Department, Long> {
    //부서를 부서명으로 찾기
    Optional<Department> findByDepartmentName(String name);
}
