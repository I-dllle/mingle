package com.example.mingle.domain.user.presence.controller;

import com.example.mingle.domain.user.presence.dto.PresenceStatusDto;
import com.example.mingle.domain.user.presence.service.PresenceService;
import com.example.mingle.domain.user.user.entity.PresenceStatus;
import com.example.mingle.domain.user.user.entity.User;
import com.example.mingle.domain.user.user.repository.UserRepository;
import com.example.mingle.global.exception.ApiException;
import com.example.mingle.global.exception.ErrorCode;
import com.example.mingle.global.security.auth.SecurityUser;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/presence")
public class PresenceController {

    private final PresenceService presenceService;
    private final UserRepository userRepository;

    // 단일 유저 상태 조회
    @GetMapping("/{userId}")
    public ResponseEntity<PresenceStatusDto> getStatus(@PathVariable Long userId) {
        PresenceStatus status = presenceService.getStatus(userId);
        return ResponseEntity.ok(toDto(userId, status));
    }

    // 여러 유저 상태 한 번에 조회 (채팅방 유저 목록용)
    @GetMapping("/batch")
    public ResponseEntity<List<PresenceStatusDto>> getStatuses(@RequestParam List<Long> userIds) {
        List<PresenceStatusDto> result = userIds.stream()
                .map(id -> toDto(id, presenceService.getStatus(id)))
                .toList();
        return ResponseEntity.ok(result);
    }

    // ✅ 수동 상태 설정 API
    @PostMapping("/manual-status")
    public ResponseEntity<Void> changeManualStatus(@RequestBody PresenceStatusDto request,
                                                   @AuthenticationPrincipal SecurityUser loginUser) {
        PresenceStatus status = PresenceStatus.valueOf(request.getStatus());
        Long userId = loginUser.getId();

        if (status == PresenceStatus.ONLINE) {
            // 수동 상태 해제 → 자동으로 복귀
            presenceService.clearManualStatus(userId);
        } else {
            // 수동 상태 설정
            presenceService.setManualStatus(userId, status);

            // DB에 저장
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ApiException(ErrorCode.USER_NOT_FOUND));
            user.setPresence(status);
        }
        return ResponseEntity.ok().build();
    }

    private PresenceStatusDto toDto(Long userId, PresenceStatus status) {
        return new PresenceStatusDto(
                userId,
                status.name(),          // "ONLINE"
                status.getDisplayName(),// "활동 중"
                status.getColor()       // "green"
        );
    }
}
