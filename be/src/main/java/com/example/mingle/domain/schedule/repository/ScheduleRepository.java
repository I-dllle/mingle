package com.example.mingle.domain.schedule.repository;

import com.example.mingle.domain.schedule.entity.Schedule;
import com.example.mingle.domain.schedule.entity.ScheduleStatus;
import com.example.mingle.domain.schedule.entity.ScheduleType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    // 타입별 + 기간별 일정 조회
    @Query("SELECT s FROM Schedule s JOIN FETCH s.user WHERE s.user.id = :userId " +
            "AND s.scheduleType = :type AND s.startTime BETWEEN :start AND :end")
    List<Schedule> findByUserIdAndScheduleTypeBetweenWithUser(
            Long userId, ScheduleType scheduleType, LocalDateTime startTime, LocalDateTime endTime);

    // 유저, 스케쥴로 찾기
    Optional<Schedule> findByUser_IdAndId(Long userId, Long scheduleId);

    @Query("""
    select s
      from Schedule s
     where (
       (s.scheduleType = 'PERSONAL' and s.user.id = :userId)
       or (s.scheduleType = 'DEPARTMENT' and s.department.id = :departmentId)
       or s.scheduleType = 'COMPANY'
     )
       and lower(s.title) like lower(concat('%', :keyword, '%'))
    """)
    List<Schedule> searchTitleAllVisible(
            @Param("userId") Long userId,
            @Param("departmentId") Long departmentId,
            @Param("keyword") String keyword
    );

    /**
     * 위 범위에 메모 검색까지 합쳐서 OR 처리
     */
    @Query("""
    select s
      from Schedule s
     where (
       (s.scheduleType = 'PERSONAL' and s.user.id = :userId)
       or (s.scheduleType = 'DEPARTMENT' and s.department.id = :departmentId)
       or s.scheduleType = 'COMPANY'
     )
       and (
         lower(s.title) like lower(concat('%', :keyword, '%'))
         or (s.memo is not null and lower(s.memo) like lower(concat('%', :keyword, '%')))
       )
    """)
    List<Schedule> searchTitleOrMemoAllVisible(
            @Param("userId") Long userId,
            @Param("departmentId") Long departmentId,
            @Param("keyword") String keyword
    );

    // 타입별 일정 조회 ( 회사 전체 일정 조회 때 사용)
    List<Schedule> findByScheduleTypeAndStartTimeBetween(
            ScheduleType scheduleType, LocalDateTime startTime, LocalDateTime endTime);

    // 상태별 일정 조회
    List<Schedule> findByUserIdAndScheduleStatus(Long userId, ScheduleStatus status);

    // 부서별 일정 조회
    List<Schedule> findByDepartment_IdAndScheduleTypeAndStartTimeBetween(
            Long departmentId, ScheduleType type,
            LocalDateTime start, LocalDateTime end);

    // 사용자 일정 상태별
    Page<Schedule> findByUserIdAndScheduleStatus(Long userId, ScheduleStatus scheduleStatus, Pageable pageable);

    // 회사 일정 상태별
    Page<Schedule> findByScheduleTypeAndScheduleStatus(
            ScheduleType scheduleType,
            ScheduleStatus scheduleStatus,
            Pageable pageable
    );

    // 부서 일정 상태별
    Page<Schedule> findByDepartment_IdAndScheduleTypeAndScheduleStatus(
            Long departmentId,
            ScheduleType scheduleType,
            ScheduleStatus scheduleStatus,
            Pageable pageable
    );

    @Query("""
        select s
          from Schedule s
         where s.scheduleStatus = :status
           and (
               s.scheduleType = com.example.mingle.domain.schedule.entity.ScheduleType.COMPANY
             or ( s.scheduleType = com.example.mingle.domain.schedule.entity.ScheduleType.DEPARTMENT
                and s.department.id = :deptId )
             or ( s.scheduleType = com.example.mingle.domain.schedule.entity.ScheduleType.PERSONAL
                and s.user.id = :userId )
           )
        """)
    Page<Schedule> findAllVisibleSchedules(
            @Param("status")    ScheduleStatus status,
            @Param("userId")    Long userId,
            @Param("deptId")    Long departmentId,
            Pageable pageable
    );
}
