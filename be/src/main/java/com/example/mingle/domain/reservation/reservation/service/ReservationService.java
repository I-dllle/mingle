package com.example.mingle.domain.reservation.reservation.service;

import com.example.mingle.domain.reservation.reservation.dto.ReservationRequestDto;
import com.example.mingle.domain.reservation.reservation.dto.ReservationResponseDto;
import com.example.mingle.domain.reservation.reservation.dto.RoomWithReservationsDto;
import com.example.mingle.domain.reservation.reservation.entity.Reservation;
import com.example.mingle.domain.reservation.reservation.entity.ReservationStatus;
import com.example.mingle.domain.reservation.reservation.repository.ReservationRepository;
import com.example.mingle.domain.reservation.room.dto.RoomDto;
import com.example.mingle.domain.reservation.room.entity.Room;
import com.example.mingle.domain.reservation.room.entity.RoomType;
import com.example.mingle.domain.reservation.room.repository.RoomRepository;
import com.example.mingle.domain.user.user.entity.User;
import com.example.mingle.domain.user.user.repository.UserRepository;
import com.example.mingle.global.exception.ApiException;
import com.example.mingle.global.exception.ErrorCode;
import com.example.mingle.global.rq.Rq;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

    // 예약 생성
    @Transactional
    public ReservationResponseDto createReservation(ReservationRequestDto dto, Long userId) {

        User user = userRepository.findById(userId).orElseThrow(
                () -> new ApiException(ErrorCode.USER_NOT_FOUND)
        );

        Room room = roomRepository.findById(dto.getRoomId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 방입니다."));

        LocalDate date = dto.getDate();
        LocalTime start = dto.getStartTime();
        LocalTime end = dto.getEndTime();

        // 과거 날짜 체크
        LocalDate today = LocalDate.now();
        if (date.isBefore(today)) {
            throw new ApiException(ErrorCode.INVALID_RESERVATION_DATE);
        }

        // 오늘이면서 과거 시간 체크
        if (date.isEqual(today) && start.isBefore(LocalTime.now())) {
            throw new ApiException(ErrorCode.INVALID_RESERVATION_TIME);
        }

        // 시작 시간이 종료 시간보다 이후인지 체크
        if (start.isAfter(end) || start.equals(end)) {
            throw new ApiException(ErrorCode.INVALID_TIME_RANGE);
        }

        // 예약 시간이 겹치는지 검사
        boolean overlap = reservationRepository.existsByRoomIdAndDateAndStartTimeLessThanAndEndTimeGreaterThan(
                room.getId(), date, end, start);
        if (overlap) {
            throw new ApiException(ErrorCode.RESERVATION_TIME_CONFLICT);
        }

        // 엔티티 생성 및 저장
        Reservation reservation = Reservation.builder()
                .user(user)
                .room(room)
                .date(date)
                .startTime(start)
                .endTime(end)
                .reservationStatus(ReservationStatus.CONFIRMED)
                .title(dto.getTitle())
                .build();
        Reservation saved = reservationRepository.save(reservation);

        // DTO 변환 후 반환
        return toResponseDto(saved);
    }

    // 특정 날짜와 룸 타입에 따른 모든 방 예약 리스트 조회
    @Transactional(readOnly = true)
    public List<RoomWithReservationsDto> getRoomsWithReservations(
            RoomType roomType,
            LocalDate date
    ) {
        // 해당 타입의 방 전부 가져오기
        List<Room> rooms = roomRepository.findAllByType(roomType);

        // 결과 리스트
        List<RoomWithReservationsDto> result = new ArrayList<>();

        // 방 별로 예약 조회 및 dto 변환
        for (Room room : rooms) {
            List<Reservation> reservations = reservationRepository
                    .findAllByRoomIdAndDateOrderByStartTime(room.getId(), date);

            List<ReservationResponseDto> reservationResponseDtos = new ArrayList<>();
            for (Reservation reservation : reservations) {
                reservationResponseDtos.add(toResponseDto(reservation));
            }
            RoomWithReservationsDto roomDto = RoomWithReservationsDto.builder()
                    .roomId(room.getId())
                    .roomName(room.getName())
                    .roomType(room.getType())
                    .reservations(reservationResponseDtos)
                    .build();

            result.add(roomDto);
        }

        return result;
    }

    //예약 수정
    @Transactional
    public ReservationResponseDto updateReservation(
            Long reservationId,
            ReservationRequestDto dto,
            Long userId
    ) {
        // 기존 예약, 유저 조회
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ApiException(ErrorCode.RESERVATION_NOT_FOUND));
        if (!reservation.getUser().getId().equals(userId)) {
            throw new ApiException(ErrorCode.ACCESS_DENIED);
        }

        // 새 예약 정보 가져오기
        LocalDate newDate = dto.getDate();
        LocalTime newStart = dto.getStartTime();
        LocalTime newEnd = dto.getEndTime();

        // 시간 범위 검증
        if (newStart.isAfter(newEnd) || newStart.equals(newEnd)) {
            throw new ApiException(ErrorCode.INVALID_TIME_RANGE);
        }

        // 시간이나 날짜가 변경되었는지 확인
        boolean timeChanged = !newDate.equals(reservation.getDate()) ||
                !newStart.equals(reservation.getStartTime()) ||
                !newEnd.equals(reservation.getEndTime());

        // 변경된 경우에만 충돌 검사
        if (timeChanged) {
            // 자기 자신을 제외한 중복 예약 검사
            boolean overlap = reservationRepository
                    .existsOverlappingReservationExceptThis(
                            reservation.getRoom().getId(),
                            newDate,
                            newStart,
                            newEnd,
                            reservationId
                    );
            if (overlap) {
                throw new ApiException(ErrorCode.RESERVATION_TIME_CONFLICT);
            }
        }
        // DB 저장
        reservation.setDate(newDate);
        reservation.setStartTime(newStart);
        reservation.setEndTime(newEnd);
        reservation.setTitle(dto.getTitle());

        // DTO 반환
        Reservation updated = reservationRepository.save(reservation);
        return toResponseDto(updated);
    }

    // 예약 삭제
    @Transactional
    public void deleteReservation(Long reservationId, Long userId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ApiException(ErrorCode.RESERVATION_NOT_FOUND));
        if (!reservation.getUser().getId().equals(userId)) {
            throw new ApiException(ErrorCode.ACCESS_DENIED);
        }

         //취소로 상태 변경
         reservation.setReservationStatus(ReservationStatus.CANCELED);
         reservationRepository.save(reservation);
    }


    // 엔티티를 responseDto로 변환 메서드
    private ReservationResponseDto toResponseDto(Reservation reservation) {
        return ReservationResponseDto.builder()
                .id(reservation.getId())
                .roomId(reservation.getRoom().getId())
                .roomName(reservation.getRoom().getName())
                .roomType(reservation.getRoom().getType())
                .date(reservation.getDate())
                .startTime(reservation.getStartTime())
                .endTime(reservation.getEndTime())
                .reservationStatus(reservation.getReservationStatus())
                .userId(reservation.getUser().getId())
                .userName(reservation.getUser().getName())
                .build();
    }
}

