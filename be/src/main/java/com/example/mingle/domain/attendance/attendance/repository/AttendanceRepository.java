package com.example.mingle.domain.attendance.attendance.repository;

import com.example.mingle.domain.attendance.attendance.entity.Attendance;
import com.example.mingle.domain.attendance.enums.AttendanceStatus;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    //특정 날짜 근태 기록 조회
    Optional<Attendance> findByUser_IdAndDate(Long userId, LocalDate date);

    // 기간별 근태 기록 조회
    List<Attendance> findByUser_IdAndDateBetweenOrderByDateAsc(Long userId, LocalDate startDate, LocalDate endDate);

    // 페이징 처리된 특정 사용자의 근태 기록 조회
    Page<Attendance> findByUser_IdOrderByDateDesc(Long userId, Pageable pageable);

    // 특정 사용자의 특정 월 근태 상태별 카운트 조회
    @Query("""
      SELECT a.attendanceStatus, COUNT(a)
      FROM Attendance a
      WHERE a.user.id = :userId
      AND a.date BETWEEN :start AND :end
      AND a.attendanceStatus IS NOT NULL
      GROUP BY a.attendanceStatus
    """)
    List<Object[]> countStatusByUserAndDateBetween(
            @Param("userId") Long userId,
            @Param("start")  LocalDate start,
            @Param("end")    LocalDate end
    );

    // 관리자 용 조회
    @Query("""
    SELECT a FROM Attendance a
    WHERE a.date BETWEEN :start AND :end
      AND (:departmentId IS NULL OR a.user.department.id = :departmentId)
      AND (:userId IS NULL OR a.user.id = :userId)
      AND (:status IS NULL OR a.attendanceStatus = :status)
      AND (:keyword IS NULL OR (
            LOWER(a.user.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
            LOWER(a.user.loginId) LIKE LOWER(CONCAT('%', :keyword, '%'))
      ))
""")
    Page<Attendance> findWithFilters(
            @Param("start") LocalDate start,
            @Param("end") LocalDate end,
            @Param("departmentId") Long departmentId,
            @Param("userId") Long userId,
            @Param("keyword") String keyword,
            @Param("status") AttendanceStatus status,
            Pageable pageable
    );
}
