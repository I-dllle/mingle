package com.example.mingle.domain.attendance.attendanceRequest.repository;

import com.example.mingle.domain.attendance.enums.ApprovalStatus;
import com.example.mingle.domain.attendance.attendanceRequest.entity.AttendanceRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface AttendanceRequestRepository extends JpaRepository<AttendanceRequest, Long> {
    @Query("SELECT r FROM AttendanceRequest r WHERE r.user.id = :userId " +
            "AND ((r.startDate BETWEEN :startDate AND :endDate) OR " +
            "(r.endDate BETWEEN :startDate AND :endDate) OR " +
            "(:startDate BETWEEN r.startDate AND r.endDate)) " +
            "AND r.approvalStatus IN :statuses")
    List<AttendanceRequest> findOverlappingRequests(
            @Param("userId") Long userId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("statuses") List<ApprovalStatus> statuses
    );

    Page<AttendanceRequest> findByUser_IdAndApprovalStatusAndStartDateBetween(
            Long userId, ApprovalStatus status, LocalDate start, LocalDate end, Pageable pageable
    );

    Page<AttendanceRequest> findByApprovalStatusAndStartDateBetween(
            ApprovalStatus status, LocalDate start, LocalDate end, Pageable pageable
    );
}
