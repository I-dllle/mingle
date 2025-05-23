package com.example.mingle.domain.user.presence.service;

import com.example.mingle.domain.user.user.entity.PresenceStatus;
import com.example.mingle.domain.user.user.entity.User;
import com.example.mingle.domain.user.user.repository.UserRepository;
import com.example.mingle.global.exception.ApiException;
import com.example.mingle.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ScheduledFuture;

import static com.example.mingle.global.constants.TimeConstants.AWAY_DELAY_SECONDS;


@Service
@RequiredArgsConstructor
@Slf4j
public class PresenceService {

    private final UserRepository userRepository;
    private final TaskScheduler taskScheduler;

    // 유저 상태 저장소
    private final Map<Long, PresenceStatus> presenceMap = new ConcurrentHashMap<>();
    // 유저별 자리비움 타이머 저장소
    private final Map<Long, ScheduledFuture<?>> awayTimers = new ConcurrentHashMap<>();
    // 수동으로 상태 변경한 유저 셋
    private final Set<Long> manualUsers = ConcurrentHashMap.newKeySet();

    // 유저의 현재 상태 조회
    public PresenceStatus getStatus(Long userId) {
        return presenceMap.getOrDefault(userId, PresenceStatus.OFFLINE);
    }

    public void startAwayTimer(Long userId) {
        cancelAwayTimer(userId);
        ScheduledFuture<?> task = taskScheduler.schedule(
                () -> {
                    log.info("⏰ 타이머 완료: userId={} → 상태를 AWAY로 변경", userId);
                    setStatus(userId, PresenceStatus.AWAY);
                },
                Instant.now().plus(AWAY_DELAY_SECONDS, ChronoUnit.SECONDS)
        );
        awayTimers.put(userId, task);
    }


    // 유저의 자리비움 타이머 취소
    public void cancelAwayTimer(Long userId) {
        ScheduledFuture<?> existing = awayTimers.remove(userId);
        if (existing != null) existing.cancel(true);
    }

    // 유저가 수동 상태 설정
    @Transactional
    public void setManualStatus(Long userId, PresenceStatus status) {
        presenceMap.put(userId, status);
        manualUsers.add(userId);
        cancelAwayTimer(userId);

        // DB에도 저장
        User user = userRepository.findById(userId).orElseThrow(() -> new ApiException(ErrorCode.USER_NOT_FOUND));
        user.setPresence(status);
    }

    // 유저가 수동 다시 온라인으로 상태 변화
    public void clearManualStatus(Long userId) {
        manualUsers.remove(userId);
        presenceMap.put(userId, PresenceStatus.ONLINE);
        startAwayTimer(userId);
    }

    // 자동 ping 처리 시 manual 유저는 무시
    public void handlePing(Long userId) {
        if (manualUsers.contains(userId)) {
            return;
        }
        presenceMap.put(userId, PresenceStatus.ONLINE);
        startAwayTimer(userId);
    }

    // 유저의 현재 상태를 변경 하는 메서드
    public void setStatus(Long userId, PresenceStatus status) {
        presenceMap.put(userId, status);
    }

}

