package com.example.mingle.domain.attendance.attendanceRequest.entity;

import com.example.mingle.domain.attendance.enums.ApprovalStatus;
import com.example.mingle.domain.attendance.attendance.entity.Attendance;
import com.example.mingle.domain.attendance.enums.LeaveType;
import com.example.mingle.domain.user.user.entity.User;
import com.example.mingle.global.jpa.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Table(name = "attendance_request")
public class AttendanceRequest extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "leave_type", nullable = false)
    private LeaveType leaveType;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;
    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "start_time")
    private LocalTime startTime;

    @Column(name = "end_time")
    private LocalTime endTime;

    // 사유
    @Column(nullable = false, length = 500)
    private String reason;

    // 승인 관련 필드
    @Enumerated(EnumType.STRING)
    @Column(name = "approval_status", nullable = false)
    private ApprovalStatus approvalStatus = ApprovalStatus.PENDING;

    // 반려 사유 또는 승인 시 추가 코멘트
    @Column(length = 500, name = "approval_comment")
    private String approvalComment;

    // 승인자
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approver_id")
    private User approver;


    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    // 관련 Attendance 목록 (양방향 매핑)
    @Builder.Default
    @OneToMany(mappedBy = "attendanceRequest", cascade = CascadeType.ALL)
    private List<Attendance> attendances = new ArrayList<>();

    // 양방향 관련 동시 설정을 위한 편의 메서드
    public void addAttendance(Attendance attendance) {
        this.attendances.add(attendance);
        attendance.setAttendanceRequest(this);
    }
}


