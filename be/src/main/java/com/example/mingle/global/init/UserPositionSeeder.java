package com.example.mingle.global.init;

import com.example.mingle.domain.user.team.entity.Department;
import com.example.mingle.domain.user.team.repository.DepartmentRepository;
import com.example.mingle.domain.user.user.entity.PositionCode;
import com.example.mingle.domain.user.user.entity.UserPosition;
import com.example.mingle.domain.user.user.repository.UserPositionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Slf4j
@Order(2)
@Profile({"dev", "prod"})
@Component
@RequiredArgsConstructor
@Transactional
public class UserPositionSeeder implements CommandLineRunner {

    private final DepartmentRepository departmentRepository;
    private final UserPositionRepository userPositionRepository;

    @Override
    public void run(String... args) {
        try {
            // 포지션이 이미 존재하면 실행하지 않음
            if (userPositionRepository.count() > 0) {
                log.info("[UserPositionSeeder] 포지션이 이미 존재하여 초기화를 건너뜁니다.");
                return;
            }

            log.info("[UserPositionSeeder] 포지션 생성을 시작합니다.");

            Map<String, List<UserPosition>> data = Map.of(
                    // Planning & A&R 부서
                    "Planning & A&R", List.of(
                            newPosition(PositionCode.A_AND_R_PLANNER, "A&R Planner"),
                            newPosition(PositionCode.A_AND_R_COORDINATOR, "A&R Coordinator"),
                            newPosition(PositionCode.CONTENT_PLANNER, "Content Planner")
                    ),

                    // Creative Studio 부서
                    "Creative Studio", List.of(
                            newPosition(PositionCode.CREATIVE_DIRECTOR, "Creative Director"),
                            newPosition(PositionCode.CONTENT_PRODUCER, "Content Producer"),
                            newPosition(PositionCode.DESIGN_LEAD, "Design Lead")
                    ),

                    // Finance & Legal 부서
                    "Finance & Legal", List.of(
                            newPosition(PositionCode.FINANCE_MANAGER, "Finance Manager"),
                            newPosition(PositionCode.LEGAL_COUNSEL, "Legal Counsel"),
                            newPosition(PositionCode.ACCOUNTING_LEAD, "Accounting Lead")
                    ),

                    // Marketing & PR 부서
                    "Marketing & PR", List.of(
                            newPosition(PositionCode.MARKETING_MANAGER, "Marketing Manager"),
                            newPosition(PositionCode.PR_LEAD, "PR Lead"),
                            newPosition(PositionCode.SOCIAL_MEDIA_COORDINATOR, "Social Media Coordinator")
                    ),

                    // Artist & Manager 부서
                    "Artist & Manager", List.of(
                            newPosition(PositionCode.ARTIST_COORDINATOR, "Artist Coordinator"),
                            newPosition(PositionCode.FAN_COMMUNICATION_LEAD, "Fan Communication Lead"),
                            newPosition(PositionCode.SCHEDULE_MANAGER, "Schedule Manager")
                    ),

                    // System Operations 부서
                    "System Operations", List.of(
                            newPosition(PositionCode.WEBOPS_MANAGER, "WebOps Manager"),
                            newPosition(PositionCode.INFRA_COORDINATOR, "Infra Coordinator"),
                            newPosition(PositionCode.TECHOPS_PARTNER, "TechOps Partner")
                    ),

                    // Executive 부서
                    "Executive", List.of(
                            newPosition(PositionCode.STRATEGY_LEAD, "Strategy Lead"),
                            newPosition(PositionCode.EXECUTIVE_ASSISTANT, "Executive Assistant"),
                            newPosition(PositionCode.CHIEF_CULTURE_OFFICER, "Chief Culture Officer")
                    )
            );

            // 각 부서에 매핑된 포지션 저장
            data.forEach((deptName, positions) -> {
                Department dept = departmentRepository.findByDepartmentName(deptName)
                        .orElseThrow(() -> new IllegalStateException(deptName + " 부서를 찾을 수 없습니다."));
                
                positions.forEach(pos -> {
                    pos.setDepartment(dept);
                    userPositionRepository.save(pos);
                    log.info("[UserPositionSeeder] 포지션 생성 완료: {} - {}", deptName, pos.getName());
                });
            });

            log.info("[UserPositionSeeder] 모든 포지션 생성이 완료되었습니다.");
        } catch (Exception e) {
            log.error("[UserPositionSeeder] 포지션 초기화 중 오류가 발생했습니다.", e);
            throw e;
        }
    }

    // 포지션 객체 생성
    private UserPosition newPosition(PositionCode code, String name) {
        return UserPosition.builder()
                .code(code)
                .name(name)
                .build();
    }
}
