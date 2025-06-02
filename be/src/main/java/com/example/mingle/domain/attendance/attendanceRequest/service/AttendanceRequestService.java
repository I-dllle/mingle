package com.example.mingle.domain.attendance.attendanceRequest.service;

import com.example.mingle.domain.attendance.enums.ApprovalStatus;
import com.example.mingle.domain.attendance.attendance.entity.Attendance;
import com.example.mingle.domain.attendance.attendance.repository.AttendanceRepository;
import com.example.mingle.domain.attendance.attendanceRequest.dto.AttendanceRequestDetailDto;
import com.example.mingle.domain.attendance.attendanceRequest.dto.AttendanceRequestDto;
import com.example.mingle.domain.attendance.attendanceRequest.entity.AttendanceRequest;
import com.example.mingle.domain.attendance.attendanceRequest.repository.AttendanceRequestRepository;
import com.example.mingle.domain.attendance.enums.AttendanceStatus;
import com.example.mingle.domain.attendance.enums.LeaveType;
import com.example.mingle.domain.attendance.util.AttendanceMapper;
import com.example.mingle.domain.user.user.entity.User;
import com.example.mingle.domain.user.user.repository.UserRepository;
import com.example.mingle.global.exception.ApiException;
import com.example.mingle.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AttendanceRequestService {

    private final UserRepository userRepository;
    private final AttendanceRepository attendanceRepository;
    private final AttendanceRequestRepository requestRepository;
    private final AttendanceMapper attendanceMapper;

    // 휴가/반차/출장 요청을 생성
    @Transactional
    public AttendanceRequestDetailDto submitRequest(AttendanceRequestDto dto, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(ErrorCode.USER_NOT_FOUND));

        // 기본적으로 endDate가 지정되지 않은 경우 startDate와 동일하게 설정
        LocalDate endDate = dto.getEndDate() != null ? dto.getEndDate() : dto.getStartDate();

        // 날짜 범위 확인
        if (endDate.isBefore(dto.getStartDate())) {
            throw new ApiException(ErrorCode.INVALID_TIME_RANGE);
        }

        // 휴가 유형별 추가 검증
        validateLeaveTypeRequirements(dto);

        // 이미 해당 기간에 대한 요청이 있는지 확인
        List<AttendanceRequest> overlappingRequests = requestRepository.findOverlappingRequests(
                userId, dto.getStartDate(), endDate, List.of(ApprovalStatus.PENDING, ApprovalStatus.APPROVED));

        if (!overlappingRequests.isEmpty()) {
            // 반차의 경우 같은 날에 AM/PM이 다른 경우는 허용
            if (dto.getType() == LeaveType.HALF_DAY_AM || dto.getType() == LeaveType.HALF_DAY_PM) {
                for (AttendanceRequest existingRequest : overlappingRequests) {
                    // 같은 날짜에 같은 유형의 반차가 이미 있으면 중복
                    if (existingRequest.getLeaveType() == dto.getType() &&
                            existingRequest.getStartDate().equals(dto.getStartDate())) {
                        throw new ApiException(ErrorCode.RESERVATION_TIME_CONFLICT);
                    }
                    
                    // 같은 날짜에 연차가 이미 있으면 중복
                    if (existingRequest.getLeaveType() == LeaveType.ANNUAL &&
                            existingRequest.getStartDate().equals(dto.getStartDate())) {
                        throw new ApiException(ErrorCode.RESERVATION_TIME_CONFLICT);
                    }
                }
            } else {
                throw new ApiException(ErrorCode.RESERVATION_TIME_CONFLICT);
            }
        }

        // 요청 객체 생성
        AttendanceRequest request = AttendanceRequest.builder()
                .user(user)
                .leaveType(dto.getType())
                .startDate(dto.getStartDate())
                .endDate(endDate)
                .startTime(dto.getStartTime())
                .endTime(dto.getEndTime())
                .reason(dto.getReason())
                .approvalStatus(ApprovalStatus.PENDING)
                .build();

        AttendanceRequest created = requestRepository.save(request);

        return attendanceMapper.toDetailDto(created);
    }

    // 일반 사용자 요청 1개 상세 조회
    @Transactional(readOnly = true)
    public AttendanceRequestDetailDto getRequestById(Long requestId, Long userId) {
        AttendanceRequest attendanceRequest = requestRepository.findById(requestId)
                .orElseThrow(() -> new ApiException(ErrorCode.REQUEST_NOT_FOUND));

        if (!attendanceRequest.getUser().getId().equals(userId)) {
             throw new ApiException(ErrorCode.FORBIDDEN);
         }

        return attendanceMapper.toDetailDto(attendanceRequest);
    }

    // 일반 사용자 요청을 상태별·기간별·페이징 조회
    @Transactional(readOnly = true)
    public Page<AttendanceRequestDetailDto> getUserRequestsByStatus(
            Long userId,
            ApprovalStatus status,
            YearMonth ym,
            int page,
            int size
    ) {
        if (!userRepository.existsById(userId)) {
            throw new ApiException(ErrorCode.USER_NOT_FOUND);
        }
        LocalDate start = ym.atDay(1);
        LocalDate end   = ym.atEndOfMonth();
        Pageable pageable = PageRequest.of(page, size, Sort.by("startDate").descending());

        Page<AttendanceRequest> entities = requestRepository
                .findByUser_IdAndApprovalStatusAndStartDateBetween(
                        userId, status, start, end, pageable);

        return entities.map(attendanceMapper::toDetailDto);
    }

    // 일반 사용자가 자신의 요청 수정
    @Transactional
    public AttendanceRequestDetailDto updateRequest(Long requestId, AttendanceRequestDto dto, Long userId) {
        AttendanceRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ApiException(ErrorCode.REQUEST_NOT_FOUND));

        request.getAttendances().size();

        if (!request.getUser().getId().equals(userId)) {
            throw new ApiException(ErrorCode.FORBIDDEN);
        }
        if (request.getApprovalStatus() != ApprovalStatus.PENDING) {
            throw new ApiException(ErrorCode.ALREADY_PROCESSED_REQUEST);
        }
        // dto 검증(@Valid) 이후, 필요한 필드만 덮어쓰기
        request.setStartDate(dto.getStartDate());
        request.setEndDate(dto.getEndDate() != null ? dto.getEndDate() : dto.getStartDate());
        request.setReason(dto.getReason());
        validateLeaveTypeRequirements(dto);

        AttendanceRequest updated = requestRepository.save(request);

        return attendanceMapper.toDetailDto(updated);
    }

    // 일반 사용자가 자신의 요청 취소(완전 삭제)
    @Transactional
    public void deleteRequest(Long requestId, Long userId) {
        AttendanceRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ApiException(ErrorCode.REQUEST_NOT_FOUND));
        if (!request.getUser().getId().equals(userId)) {
            throw new ApiException(ErrorCode.FORBIDDEN);
        }
        if (request.getApprovalStatus() != ApprovalStatus.PENDING) {
            throw new ApiException(ErrorCode.ALREADY_PROCESSED_REQUEST);
        }
        requestRepository.delete(request);
    }


    // ================================ 관리자 용 메서드 ===========================

    // 관리자용 요청 1개 상세 조회
    @Transactional(readOnly = true)
    public AttendanceRequestDetailDto getRequestByIdForAdmin(Long requestId) {
        AttendanceRequest attendanceRequest = requestRepository.findById(requestId)
                .orElseThrow(() -> new ApiException(ErrorCode.REQUEST_NOT_FOUND));

        return attendanceMapper.toDetailDto(attendanceRequest);
    }

    // 관리자: 요청 승인시 해당 기간의 Attendance 엔티티에 반영
    @Transactional
    public AttendanceRequestDetailDto approveRequest(Long requestId, String comment, Long approverId) {
        // 요청 조회
        AttendanceRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ApiException(ErrorCode.REQUEST_NOT_FOUND));

        // 승인자 조회
        User approver = userRepository.findById(approverId)
                .orElseThrow(() -> new ApiException(ErrorCode.USER_NOT_FOUND));

        // 요청 상태 확인
        if (request.getApprovalStatus() != ApprovalStatus.PENDING) {
            throw new ApiException(ErrorCode.ALREADY_PROCESSED_REQUEST);
        }

        // 승인 처리
        request.setApprovalStatus(ApprovalStatus.APPROVED);
        request.setApprover(approver);
        request.setApprovedAt(LocalDateTime.now());
            request.setApprovalComment(comment);


        // 요청 기간 동안 Attendance 생성/업데이트
        List<Attendance> attendances = new ArrayList<>();
        LeaveType leaveType = request.getLeaveType();
        LocalDate startDate = request.getStartDate();
        LocalDate endDate = request.getEndDate();
        Long userId = request.getUser().getId();

        // 기간 내 일자별 처리
        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            // 주말 건너뛰기
            if (date.getDayOfWeek() == DayOfWeek.SATURDAY || date.getDayOfWeek() == DayOfWeek.SUNDAY) {
                continue;
            }

            // 해당 날짜에 이미 출결 기록이 있는지 확인
            LocalDate finalDate = date;
            Attendance attendance = attendanceRepository
                    .findByUser_IdAndDate(userId, date)
                    .orElseGet(() -> Attendance.builder()
                            .user(request.getUser())
                            .date(finalDate)
                            .build());

            // 휴가 관련 상태인지 확인 및 중복 검사
            AttendanceStatus currentStatus = attendance.getAttendanceStatus();
            if (attendance.getCheckInTime() != null && currentStatus.isLeave()) {
                log.warn("이미 처리된 출결 기록이 있어 제외합니다: 날짜={}, 상태={}",
                        date, currentStatus);
                continue;
            }

            // 상태 설정
            AttendanceStatus status = leaveType.toAttendanceStatus();
            attendance.setAttendanceStatus(status);
            attendance.setReason(request.getReason());
            attendance.setLeaveType(leaveType);

            // 양방향 연결 설정 - 기존 연결 제거 후 새로 설정
            if (attendance.getAttendanceRequest() != null) {
                attendance.getAttendanceRequest().getAttendances().remove(attendance);
            }

            // 특별휴가일 경우 사유 자동 설정
            if (status == AttendanceStatus.ON_SPECIAL_LEAVE) {
                attendance.setReason(leaveType.getDisplayName());
            } else {
                attendance.setReason(request.getReason());
            }

            // AttendanceRequest의 편의 메서드 사용하여 양방향 설정
            request.addAttendance(attendance);

            // 저장할 리스트에 추가
            attendances.add(attendance);
        }

        // 일괄 저장
        if (!attendances.isEmpty()) {
            attendanceRepository.saveAll(attendances);
        }

        AttendanceRequest saved = requestRepository.save(request);

        return attendanceMapper.toDetailDto(saved);
    }

    // 관리자 요청 거절
    @Transactional
    public AttendanceRequestDetailDto rejectRequest(Long requestId, String comment, Long approverId) {
        // 요청 조회
        AttendanceRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ApiException(ErrorCode.REQUEST_NOT_FOUND));

        // 승인자 조회
        User approver = userRepository.findById(approverId)
                .orElseThrow(() -> new ApiException(ErrorCode.USER_NOT_FOUND));

        // 요청 상태 확인
        if (request.getApprovalStatus() != ApprovalStatus.PENDING) {
            throw new ApiException(ErrorCode.ALREADY_PROCESSED_REQUEST);
        }

        // 반려 사유 검증
        if (comment == null || comment.trim().isEmpty()) {
            throw new ApiException(ErrorCode.REJECT_REASON_REQUIRED);
        }

        // 반려 처리
        request.setApprovalStatus(ApprovalStatus.REJECTED);
        request.setApprover(approver);
        request.setApprovedAt(LocalDateTime.now());
        request.setApprovalComment(comment);

        AttendanceRequest saved = requestRepository.save(request);
        return attendanceMapper.toDetailDto(saved);
    }


    // 관지자용 전체 사용자 요청을 상태별·기간별·페이징 조회
    @Transactional(readOnly = true)
    public Page<AttendanceRequestDetailDto> getAllRequestsByStatus(
            ApprovalStatus status,
            YearMonth ym,
            int page,
            int size
    ) {
        LocalDate from = ym.atDay(1);
        LocalDate to   = ym.atEndOfMonth();
        Pageable pageable = PageRequest.of(page, size, Sort.by("startDate").descending());
        Page<AttendanceRequest> requests = requestRepository
                .findByApprovalStatusAndStartDateBetween(
                        status, from, to, pageable
                );
        return requests.map(attendanceMapper::toDetailDto);
    }

    // 관리자용 요청 상태 변경
    @Transactional
    public AttendanceRequestDetailDto changeRequestStatus(Long requestId,
                                                 ApprovalStatus newStatus,
                                                 String comment,
                                                 Long adminId) {
        AttendanceRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ApiException(ErrorCode.REQUEST_NOT_FOUND));
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new ApiException(ErrorCode.USER_NOT_FOUND));

        ApprovalStatus currentStatus = request.getApprovalStatus();
        // 기존 상태가 APPROVED였고, 새 상태가 APPROVED가 아닌 경우 → 생성된 근태 삭제
        if (currentStatus == ApprovalStatus.APPROVED && newStatus != ApprovalStatus.APPROVED) {
            List<Attendance> attendances = request.getAttendances();

            // 양방향 매핑 끊기
            for (Attendance attendance : attendances) {
                attendance.setAttendanceRequest(null);
            }

            attendanceRepository.deleteAll(attendances);
            request.getAttendances().clear();
        }
        // 기존 승인 로직과 달리, 어떤 상태에서든 변경 가능
        request.setApprovalStatus(newStatus);
        request.setApprover(admin);
        request.setApprovedAt(LocalDateTime.now());
        request.setApprovalComment(comment);
        AttendanceRequest updated = requestRepository.save(request);
        return attendanceMapper.toDetailDto(updated);
    }




    // ==================== 헬퍼 메서드 ====================
    // 휴가 유형별 유효성을 검증하는 헬퍼 메서드
    private void validateLeaveTypeRequirements(AttendanceRequestDto dto) {
        LocalDate now = LocalDate.now();

        // 종료일이 null인 경우 시작일로 설정
        LocalDate endDate = dto.getEndDate() != null ? dto.getEndDate() : dto.getStartDate();

        switch (dto.getType()) {
            case HALF_DAY_AM, HALF_DAY_PM -> {
                // 반차는 하루만 신청 가능
                if (!endDate.isEqual(dto.getStartDate())) {
                    throw new ApiException(ErrorCode.ONLY_ONE_DAY_HALF_DAY);
                }
            }
            case EARLY_LEAVE -> {
                // 조퇴는 당일만 신청 가능
                if (!dto.getStartDate().isEqual(now)) {
                    throw new ApiException(ErrorCode.EARLY_LEAVE_DATE_LIMIT);
                }
            }
            case MARRIAGE, PARENTAL, BEREAVEMENT, ANNUAL, SICK -> {
                // 휴가 유형들은 3영업일 전에 신청해야 함
                if (!isAtLeastThreeBusinessDaysAhead(dto.getStartDate())) {
                    throw new ApiException(ErrorCode.LEAVE_NOTICE_REQUIRED);
                }
            }
        }
    }

    // 주어진 날짜가 오늘로부터 최소 3영업일 이후인지 확인
    private boolean isAtLeastThreeBusinessDaysAhead(LocalDate targetDate) {
        LocalDate current = LocalDate.now();
        int businessDays = 0;

        while (businessDays < 3) {
            current = current.plusDays(1); // 다음 날로 이동

            // 주말(토,일)이 아닌 경우에만 영업일 카운트 증가
            if (current.getDayOfWeek() != DayOfWeek.SATURDAY &&
                    current.getDayOfWeek() != DayOfWeek.SUNDAY) {
                businessDays++;
            }
        }
        // 타겟 날짜가 3영업일 이후인지 확인
        return !targetDate.isBefore(current);
    }
}