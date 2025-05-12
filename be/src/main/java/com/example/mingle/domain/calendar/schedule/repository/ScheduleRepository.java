package com.example.mingle.domain.calendar.schedule.repository;

import com.example.mingle.domain.calendar.schedule.entity.Schedule;
import com.example.mingle.domain.calendar.schedule.entity.ScheduleStatus;
import com.example.mingle.domain.calendar.schedule.entity.ScheduleType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    // 타입별 + 기간별 일정 조회
    List<Schedule> findByUserIdAndScheduleTypeAndStartTimeBetween(
            Long userId, ScheduleType scheduleType, LocalDateTime startTime, LocalDateTime endTime);
    List<Schedule> findByScheduleTypeAndStartTimeBetween(
            ScheduleType scheduleType, LocalDateTime startTime, LocalDateTime endTime);
    List<Schedule> findByUser_DepartmentIdAndScheduleTypeAndStartTimeBetween(
            Long departmentId, ScheduleType scheduleType, LocalDateTime start, LocalDateTime end
    );
    List<Schedule> findByUserIdAndScheduleStatus(Long userId, ScheduleStatus status);
    List<Schedule> findByUserIdAndStartTimeBetween(Long userId, LocalDateTime startTime, LocalDateTime endTime);

}
