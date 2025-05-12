package com.example.mingle.domain.user.user.repository;

import com.example.mingle.domain.user.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    //사용자를 이메일로 찾기
    Optional<User> findByEmail(String email);

    //부서id로 사용자 목록 찾기
    List<User> findByDeptId(Long departmentId);

    //부서명으로 사용자 목록 찾기
    List<User> findByDeptName(Long departmentName);

    //사용자를 이름으로 찾기
    Optional<User> findByName(String name);

    //사용자를 닉네임으로 찾기
    Optional<User> findByNickname(String nickname);

    //역할에 해당하는 사용자 목록 찾기
    List<User> findByRole(String role);
}
