package com.example.mingle.global.rsdata;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.Optional;

@Getter
@AllArgsConstructor(access = lombok.AccessLevel.PRIVATE)
public class ChatRsData<T> {
    private String resultCode;
    private String msg;
    private T data;

    public static <T> ChatRsData<T> of(String resultCode, String msg, T data) {
        return new ChatRsData<>(resultCode, msg, data);
    }

    public static <T> ChatRsData<T> of(String resultCode, String msg) {
        return of(resultCode, msg, null);
    }

    public boolean isSuccess() {
        return resultCode.startsWith("S-");
    }

    public boolean isFail() {
        return !isSuccess();
    }

    public Optional<ChatRsData<T>> optional() {
        return Optional.of(this);
    }

    public <T> ChatRsData<T> newDataOf(T data) {
        return new ChatRsData<T>(getResultCode(), getMsg(), data);
    }

    // 채팅 (WebSocket)
    // return RsData.of("S-200", "메시지 전송 성공", chatDto);

    // 결제 (SSE)
    // return RsData.of("S-200", "결제 알림 전송 성공", paymentDto);
}
