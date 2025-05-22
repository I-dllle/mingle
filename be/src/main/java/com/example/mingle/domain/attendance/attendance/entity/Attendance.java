package com.example.mingle.domain.attendance.attendance.entity;

import com.example.mingle.domain.attendance.attendanceRequest.entity.AttendanceRequest;
import com.example.mingle.domain.attendance.enums.AttendanceStatus;
import com.example.mingle.domain.attendance.enums.LeaveType;
import com.example.mingle.domain.user.user.entity.User;
import com.example.mingle.global.jpa.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@ToString
@Table(
        name = "attendance",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_user_date",
                columnNames = {"user_id", "date"}
        )
)
public class Attendance extends BaseEntity {

    // 강사님의 추천으로 낙관적 락 추가
    @Version
    private Long version;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private LocalDate date;

    @Column(name = "check_in_time")
    private LocalDateTime checkInTime;

    @Column(name = "check_out_time")
    private LocalDateTime checkOutTime;

    @Column(name = "overtime_start")
    private LocalDateTime overtimeStart;

    @Column(name = "overtime_end")
    private LocalDateTime overtimeEnd;

    @Column(name = "working_hours")
    private Double workingHours;

    @Column(name = "overtime_hours")
    private Double overtimeHours;

    //야근 보고
    @Column(length = 500)
    private String reason;

    @Enumerated(EnumType.STRING)
    @Column(name = "attendance_status")
    private AttendanceStatus attendanceStatus;

    // AttendanceRequest 참조
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "attendance_request_id")
    private AttendanceRequest attendanceRequest;

    // 요청 시 특별 휴가 일때, 이유를 받기 위한 필드
    @Enumerated(EnumType.STRING)
    private LeaveType leaveType; // 결혼휴가, 병가 등
}


