package com.example.mingle.domain.calendar.shcedule.entity;

import com.example.mingle.domain.user.user.entity.UserRole;
import com.example.mingle.global.jpa.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.collection.spi.BagSemantics;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@ToString
@Table(name = "schedule")
public class Schedule extends BaseEntity {
    @JoinColumn(name = "user_id")
    private Long userId;

    @JoinColumn(name = "post_id")
    private Long postId;

    @Column(name = "title")
    private String title;

    @Column(name = "description")
    private String description;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    @Column(name = "memo")
    private String memo;

    @Enumerated(EnumType.STRING)
    @Column(name = "schedule_status")
    private ScheduleStatus scheduleStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "schedule_type")
    private ScheduleType scheduleType;
}
