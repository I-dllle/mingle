package com.example.mingle.domain.calendar.schedule.service;

import com.example.mingle.domain.calendar.schedule.dto.ScheduleRequest;
import com.example.mingle.domain.calendar.schedule.dto.ScheduleResponse;
import com.example.mingle.domain.calendar.schedule.entity.Schedule;
import com.example.mingle.domain.calendar.schedule.entity.ScheduleType;
import com.example.mingle.domain.calendar.schedule.repository.ScheduleRepository;
import com.example.mingle.domain.calendar.schedule.util.ScheduleMapper;
import com.example.mingle.domain.post.post.entity.Post;
import com.example.mingle.domain.user.user.entity.User;
import com.example.mingle.domain.user.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final ScheduleMapper scheduleMapper;

    // 일정 생성
    @Transactional
    public ScheduleResponse createSchedule(ScheduleRequest request, Long userId, Long postId) {
        User user = userRepository.findById(userId).orElseThrow(
                () -> new IllegalArgumentException("존재하지 않는 유저입니다.")
        );

        Post post = postRepository.findById(postId).orElse(null);
        );

        Schedule schedule = Schedule.builder()
                .user(user)
                .title(request.getTitle())
                .description(request.getDescription())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .scheduleType(request.getScheduleType())
                .scheduleStatus(request.getScheduleStatus())
                .memo(request.getMemo())
                .post(post)
                .build();


        Schedule saved = scheduleRepository.save(schedule);

        // post가 null인 경우를 고려한 응답 처리
        Long resolvedPostId = saved.getPost() != null ? saved.getPost().getId() : null;


        // 5) 응답 DTO로 변환 후 반환
        return ScheduleResponse.builder()
                .id(saved.getId())
                .userId(user.getId())
                .postId(resolvedPostId)
                .title(saved.getTitle())
                .description(saved.getDescription())
                .startTime(saved.getStartTime())
                .endTime(saved.getEndTime())
                .memo(saved.getMemo())
                .scheduleType(saved.getScheduleType())
                .scheduleStatus(saved.getScheduleStatus())
                .build();
    }


    //월별 타입에 따라 조회
    @Transactional(readOnly = true)
    public List<ScheduleResponse> getMonthlySchedules(
            Long userId,
            ScheduleType type,
            Integer year,
            Integer month
    ) {
        // 사용자 ID 유효성 검사
        if (userId == null) {
            throw new IllegalArgumentException("유저 ID는 필수입니다.");
        }

        // 타입 유효성 검사
        if (type == null) {
            throw new IllegalArgumentException("일정 타입은 필수입니다.");
        }

        // 조회할 YearMonth 결정 (넘어온 게 없으면 현재 달)
        YearMonth ym = (year != null && month != null)
                ? YearMonth.of(year, month)
                : YearMonth.now();

        // 해당 월의 시작·끝 시점 계산
        LocalDateTime start = ym.atDay(1).atStartOfDay();
        LocalDateTime end = ym.atEndOfMonth().atTime(23, 59, 59);

        // 타입별 조회 (COMPANY는 전체, PERSONAL/TEAM은 userId 기준)
        List<Schedule> raw;
        if (type == ScheduleType.COMPANY) {
            raw = scheduleRepository.findByScheduleTypeAndStartTimeBetween(
                    type, start, end);
        } else {
            // 사용자가 존재하는지 확인
            userRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 유저입니다."));

            raw = scheduleRepository.findByUserIdAndScheduleTypeAndStartTimeBetween(
                    userId, type, start, end);
        }

        // DTO 변환 - 매퍼 사용
        return scheduleMapper.toResponseList(raw);
    }

}

