package com.example.mingle.domain.user.user.repository;

import com.example.mingle.domain.user.user.entity.PositionCode;
import com.example.mingle.domain.user.user.entity.User;
import com.example.mingle.domain.user.user.entity.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    //사용자를 이메일로 찾기
    // → UserService.login()에서 입력값에 @ 포함 시 이메일로 판단되어 사용됨
    Optional<User> findByEmail(String email);

    // 로그인 시 사용자가 입력한 loginId로 사용자 조회
    // → UserService.login()에서 입력값이 일반 ID일 때 사용됨
    Optional<User> findByLoginId(String loginId);

    // loginId 중복 여부 확인 (회원가입 또는 초기화 시 사용)
    boolean existsByLoginId(String loginId);

    //부서id로 사용자 목록 찾기
    List<User> findByDepartment_Id(Long departmentId);

    //부서명으로 사용자 목록 찾기
    List<User> findByDepartment_DepartmentName(String departmentName);

    List<User> findByNicknameContaining(String keyword);

    //사용자를 이름으로 찾기
    Optional<User> findByName(String name);

    //사용자를 닉네임으로 찾기
    Optional<User> findByNickname(String nickname);

    // refreshToken으로 사용자 조회
    Optional<User> findByRefreshToken(String refreshToken);

    //역할에 해당하는 사용자 목록 찾기
    List<User> findByRole(String role);

    @Query("""
    SELECT u FROM User u
    JOIN u.position p
    WHERE (:departmentId IS NULL OR u.department.id = :departmentId)
      AND (:positionCode IS NULL OR p.code = :positionCode)
""")
    Page<User> findByDepartmentAndPositionCode(@Param("departmentId") Long departmentId,
                                               @Param("positionCode") PositionCode positionCode,
                                               Pageable pageable);

    @Query("""
    SELECT u FROM User u
    LEFT JOIN FETCH u.department
    LEFT JOIN FETCH u.position
    WHERE u.id = :id
""")
    Optional<User> findByIdWithRelations(@Param("id") Long id);

    List<User> findByNameContainingIgnoreCase(String name);
}
