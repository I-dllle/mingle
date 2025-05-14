package com.example.mingle.global.init;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Slf4j
@Profile({"dev", "prod"}) // 개발과 운영 환경 모두에서 실행되도록 허용
@Component
@RequiredArgsConstructor
public class SeederRunner implements CommandLineRunner {

    private final DepartmentInitializer departmentInitializer;
    private final UserPositionSeeder userPositionSeeder;
    private final AdminInitializer adminInitializer;
    private final StaffInitializer staffInitializer;

    @Override
    public void run(String... args) {
        log.info("[SeederRunner] 데이터 초기화를 시작합니다.");

        departmentInitializer.run(args);   // 가장 먼저! 부서 기본값 필요
        userPositionSeeder.seed();      // 포지션 생성
        adminInitializer.run(args);        // 기본 어드민 생성 (부서·포지션 필요)
        staffInitializer.run(args);        // 더미 스태프 생성 (부서·포지션 필요)

        log.info("[SeederRunner] 데이터 초기화가 완료되었습니다.");
    }
}
