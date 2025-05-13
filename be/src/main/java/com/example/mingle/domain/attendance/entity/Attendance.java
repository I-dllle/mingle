package com.example.mingle.domain.attendance.entity;

import com.example.mingle.domain.attendance.enums.AttendanceStatus;
import com.example.mingle.domain.attendance.enums.HalfDayType;
import com.example.mingle.domain.attendance.enums.VacationType;
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
@Builder
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

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private LocalDate date;

    @Column(name = "check_in_time", nullable = false)
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

    private String reason;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, name = "attendance_status")
    private AttendanceStatus attendanceStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "vacation_type")
    private VacationType vacationType;

    @Enumerated(EnumType.STRING)
    @Column(name = "half_day_type")
    private HalfDayType halfDayType;

}

