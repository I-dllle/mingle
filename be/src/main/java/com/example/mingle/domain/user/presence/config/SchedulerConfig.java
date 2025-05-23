package com.example.mingle.domain.user.presence.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;

@Configuration
public class SchedulerConfig {
    @Bean
    public TaskScheduler taskScheduler() {
        ThreadPoolTaskScheduler scheduler = new ThreadPoolTaskScheduler();
        scheduler.setPoolSize(4); // 스레드 2개까지 동시에 타이머 실행 가능
        scheduler.setThreadNamePrefix("presence-scheduler-"); // 로그 등에서 이름 식별
        scheduler.initialize(); // 초기화
        return scheduler;
    }
}
