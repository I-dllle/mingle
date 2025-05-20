package com.example.mingle.global.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    // 400 BAD_REQUEST
    BAD_REQUEST(HttpStatus.BAD_REQUEST, "잘못된 요청입니다."),
    CANNOT_CHANGE_ADMIN_STATUS(HttpStatus.BAD_REQUEST, "관리자 계정의 상태는 변경 불가능합니다."),
    CANNOT_ChANGE_ADMIN_ROLE(HttpStatus.BAD_REQUEST, "관리자 계정의 등급은 변경 불가능합니다."),
    CANNOT_REPORT_OWN_POST(HttpStatus.BAD_REQUEST, "본인의 게시글은 신고 불가능합니다."),
    INVALID_RESERVATION_DATE(HttpStatus.BAD_REQUEST, "지난 날짜에는 예약할 수 없습니다."),
    INVALID_RESERVATION_TIME(HttpStatus.BAD_REQUEST, "지난 시간에는 예약할 수 없습니다."),
    INVALID_TIME_RANGE(HttpStatus.BAD_REQUEST, "시작 시간은 종료 시간보다 이전이어야 합니다."),
    ONLY_ONE_DAY_HALF_DAY(HttpStatus.BAD_REQUEST, "반차는 하루만 신청 가능합니다."),
    EARLY_LEAVE_DATE_LIMIT(HttpStatus.BAD_REQUEST, "조퇴는 당일에만 신청 가능합니다"),
    ALREADY_PROCESSED_REQUEST(HttpStatus.BAD_REQUEST, "이미 처리된 요청입니다."),
    REJECT_REASON_REQUIRED(HttpStatus.BAD_REQUEST, "반려 사유를 입력해야 합니다."),
    REQUEST_NOT_FOUND(HttpStatus.NOT_FOUND, "신청을 찾을 수 없습니다."),
    ATTENDANCE_RECORD_EXISTS(HttpStatus.CONFLICT, "해당 날짜에 이미 출결 기록이 존재합니다."),
    LEAVE_NOTICE_REQUIRED(HttpStatus.BAD_REQUEST, "휴가는 최소 3영업일 전에 신청해야 합니다."),


    // 401 UNAUTHORIZED
    INVALID_TOKEN(HttpStatus.UNAUTHORIZED, "유효하지 않은 토큰입니다."),
    EXPIRED_TOKEN(HttpStatus.UNAUTHORIZED, "만료된 토큰입니다."),
    INVALID_REFRESH_TOKEN(HttpStatus.UNAUTHORIZED, "유효하지 않은 리프레시 토큰입니다."),
    INVALID_PASSWORD(HttpStatus.UNAUTHORIZED, "비밀번호가 일치하지 않습니다."),
    INVALID_ORDER_PRICE(HttpStatus.UNAUTHORIZED, "결제금액이 일치하지 않습니다."),

    // 403 FORBIDDEN
    ACCESS_DENIED(HttpStatus.FORBIDDEN, "접근 권한이 없습니다."),
    FORBIDDEN(HttpStatus.FORBIDDEN, "권한이 없습니다."),
    ACCOUNT_SUSPENDED(HttpStatus.FORBIDDEN, "정지된 계정입니다. 관리자에게 문의하세요."),
    DAILY_POST_LIMIT_EXCEEDED(HttpStatus.FORBIDDEN, "하루 게시글 작성 제한을 초과했습니다."),
    VERIFICATION_POST_ALREADY_SUBMITTED(HttpStatus.FORBIDDEN, "오늘은 이미 인증글을 작성했습니다."),
    ALREADY_DELETED_POST(HttpStatus.FORBIDDEN, "이미 삭제된 게시글입니다."),

    // 404 NOT_FOUND
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않는 사용자입니다."),
    USER_POSITION_NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않는 포지션입니다."),
    POST_NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않는 게시글입니다."),
    CATEGORY_NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않는 카테고리입니다."),
    RESOURCE_NOT_FOUND(HttpStatus.NOT_FOUND, "요청한 리소스가 존재하지 않습니다."),
    REPORT_NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않는 신고입니다."),
    ADMIN_NOT_FOUND(HttpStatus.NOT_FOUND, "게시판 생성자가 존재하지 않습니다."),
    DEPARTMENT_NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않는 부서입니다."),
    POST_MENU_NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않는 메뉴입니다."),
    GOODS_NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않는 상품입니다."),
    GOODS_ORDER_NOT_FOUND(HttpStatus.NOT_FOUND, "주문정보를 찾을 수 없습니다."),
    RESERVATION_NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않는 예약입니다."),
    ROOM_NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않는 방입니다."),
    SCHEDULE_NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않는 일정입니다."),

    // 409 CONFLICT
    EMAIL_ALREADY_EXISTS(HttpStatus.CONFLICT, "이미 등록된 이메일입니다."),
    NICKNAME_ALREADY_EXISTS(HttpStatus.CONFLICT, "이미 사용 중인 닉네임입니다."),
    RESERVATION_TIME_CONFLICT(HttpStatus.CONFLICT, "해당 시간에 이미 신청이 존재합니다."),
    CANCEL_ORDER_CONFLICT(HttpStatus.CONFLICT, "배송중이거나 이미 취소된 주문입니다."),

    // 500 INTERNAL_SERVER_ERROR
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "서버 오류가 발생했습니다."), INVALID_INPUT_VALUE(HttpStatus.BAD_REQUEST, "파일 형식이 올바르지 않습니다."),

    // 계약서 없을 때 에러 코드
    CONTRACT_NOT_FOUND(HttpStatus.NOT_FOUND,"계약서를 찾을 수 없습니다.");

    private final HttpStatus httpStatus;
    private final String message;
}