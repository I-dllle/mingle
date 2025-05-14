package com.example.mingle.global.init;

import com.example.mingle.domain.user.team.entity.Department;
import com.example.mingle.domain.user.team.repository.DepartmentRepository;
import com.example.mingle.domain.user.user.entity.PositionCode;
import com.example.mingle.domain.user.user.entity.UserPosition;
import com.example.mingle.domain.user.user.repository.UserPositionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Profile({"dev", "prod"})
@Component
@RequiredArgsConstructor
public class UserPositionSeeder {

    private final DepartmentRepository departmentRepository;
    private final UserPositionRepository userPositionRepository;

    public void seed() {
        // 이미 데이터가 있다면 실행하지 않음
        if (userPositionRepository.count() > 0) return;

        // 부서명 → 직책 목록 매핑
        Map<String, List<UserPosition>> data = Map.of(
                // Planning & A&R 부서
                "Planning & A&R", List.of(
                        newPosition(PositionCode.CONTENTS_STRATEGIST, "Contents Strategist"),
                        newPosition(PositionCode.A_AND_R_PLANNER, "A&R Planner"),
                        newPosition(PositionCode.DEMO_CURATOR, "Demo Curator")
                ),

                // Creative Studio 부서
                "Creative Studio", List.of(
                        newPosition(PositionCode.VISUAL_DESIGNER, "Visual Designer"),
                        newPosition(PositionCode.MOTION_CREATOR, "Motion Creator"),
                        newPosition(PositionCode.CREATIVE_EDITOR, "Creative Editor")
                ),

                // Finance & Legal 부서
                "Finance & Legal", List.of(
                        newPosition(PositionCode.FINANCE_PARTNER, "Finance Partner"),
                        newPosition(PositionCode.LEGAL_ASSISTANT, "Legal Assistant"),
                        newPosition(PositionCode.CONTRACT_COORDINATOR, "Contract Coordinator")
                ),

                // Marketing & PR 부서
                "Marketing & PR", List.of(
                        newPosition(PositionCode.SOCIAL_MEDIA_MANAGER, "Social Media Manager"),
                        newPosition(PositionCode.BRAND_DESIGNER, "Brand Designer"),
                        newPosition(PositionCode.MEDIA_PLANNER, "Media Planner")
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
            });
        });
    }

    // 포지션 객체 생성
    private UserPosition newPosition(PositionCode code, String name) {
        return UserPosition.builder()
                .code(code)
                .name(name)
                .build();
    }
}
