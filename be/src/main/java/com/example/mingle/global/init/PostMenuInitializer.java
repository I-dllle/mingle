package com.example.mingle.global.init;

import com.example.mingle.domain.post.post.entity.PostMenu;
import com.example.mingle.domain.post.post.entity.PostType;
import com.example.mingle.domain.post.post.repository.MenuRepository;
import com.example.mingle.domain.post.post.repository.PostTypeRepository;
import com.example.mingle.domain.user.team.entity.Department;
import com.example.mingle.domain.user.team.repository.DepartmentRepository;
import com.example.mingle.domain.user.user.entity.User;
import com.example.mingle.domain.user.user.repository.UserRepository;
import com.example.mingle.global.exception.ApiException;
import com.example.mingle.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Order(3)
@Component
@RequiredArgsConstructor
@Transactional
public class PostMenuInitializer implements ApplicationRunner {
    private final MenuRepository menuRepository;
    private final DepartmentRepository departmentRepository;
    private final PostTypeRepository postTypeRepository;
    private final UserRepository userRepository;

    // 게시판 생성자 계정 (디폴트는 관리자, 추후 생성자 추가는 아래 메뉴 필드에 직접 이메일 string으로 추가)
    private static final String DEFAULT_CREATOR_EMAIL = "admin@admin.com";

    // null값일 땐 기본 생성자 사용 (LAZY초기화)
    private User defaultCreator() {
        return userRepository.findByEmail(DEFAULT_CREATOR_EMAIL)
                .orElseThrow(() -> new ApiException(ErrorCode.ADMIN_NOT_FOUND));
    }

    //공통 메뉴
    private void initializeCommonMenu(String code, String name, String description) {
        try {
            if (menuRepository.findByCode(code).isEmpty()) {
                PostMenu menu = PostMenu.builder()
                        .code(code)
                        .name(name)
                        .description(description)
                        .department(null)
                        .build();
                if (!postTypeRepository.existsByMenuAndDepartment(menu, null)) {
                    postTypeRepository.save(PostType.builder()
                            .menu(menu)
                            .department(null)
                            .creator(defaultCreator())
                            .build());
                }
                log.info("[PostMenuInitializer] 공통 메뉴 생성 완료: {}", name);
            }
        } catch (Exception e) {
            log.error("[PostMenuInitializer] 공통 메뉴 생성 실패: {}", name, e);
            throw e;
        }
    }

    private void initializeMenu(String code, String name, String description, String departmentName, User creator) {
        try {
            Department department = departmentRepository.findByDepartmentName(departmentName)
                    .orElseThrow(() -> {
                        log.error("[PostMenuInitializer] 부서를 찾을 수 없습니다: {}", departmentName);
                        return new ApiException(ErrorCode.DEPARTMENT_NOT_FOUND);
                    });

            PostMenu menu = menuRepository.findByCode(code).orElseGet(() -> {
                PostMenu newMenu = PostMenu.builder()
                        .code(code)
                        .name(name)
                        .description(description)
                        .department(department)
                        .build();
                return menuRepository.save(newMenu);
            });

            if (!postTypeRepository.existsByMenuAndDepartment(menu, department)) {
                postTypeRepository.save(PostType.builder()
                        .menu(menu)
                        .department(department)
                        .creator(creator != null ? creator : defaultCreator())
                        .build());
            }
            log.info("[PostMenuInitializer] 메뉴 생성 완료: {} - {}", departmentName, name);
        } catch (Exception e) {
            log.error("[PostMenuInitializer] 메뉴 생성 실패: {} - {}", departmentName, name, e);
            throw e;
        }
    }

    @Override
    public void run(ApplicationArguments args) {
        try {
            log.info("[PostMenuInitializer] 게시판 초기화를 시작합니다.");

            User creator = defaultCreator();

            //공통
            initializeCommonMenu("BUSINESS_DOCUMENTS", "업무자료", "부서별 업무 자료 게시판");
            initializeCommonMenu("MEETINGROOM_RESERVATION", "회의실 예약", "회의실 예약 기능");
            initializeCommonMenu("NOTICE", "공지사항", "공지사항 게시판");
            initializeCommonMenu("AUDITION_ANNOUNCEMENT", "오디션 공고", "오디션 관련 공지 게시판");

            //콘텐츠팀
            initializeMenu("AUDIO_VIDEO", "음원, 영상", "콘텐츠팀 - 음원 및 영상 업로드용 게시판", "Creative Studio", creator);
            initializeMenu("PRESS_RELEASES", "보도자료", "콘텐츠팀/마케팅 - 보도자료 관리 게시판", "Creative Studio", creator);
            initializeMenu("CONTENTCLASSIFICATION_ALBUMCOVERS", "콘텐츠분류, 앨범커버", "콘텐츠 분류 및 앨범 커버 관련 게시판", "Creative Studio", creator);

            //기획팀
            initializeMenu("TEAM_COMPOSITION", "팀/유닛 구성", "기획팀 - 유닛/팀 구성 관련 게시판","Planning & A&R", creator);
            initializeMenu("ARTISTS", "아티스트", "기획팀 - 아티스트 정보 공유", "Planning & A&R", creator);
            initializeMenu("ACTIVITY_PLANNING", "활동기획", "기획팀 - 활동 기획 관련 자료", "Planning & A&R", creator);

            //마케팅/홍보팀
            initializeMenu("SNS_CONTENT", "SNS컨텐츠", "마케팅 - SNS 콘텐츠 게시판", "Marketing & PR", creator);
            initializeMenu("EVENTS", "이벤트", "마케팅 - 이벤트 게시판", "Marketing & PR", creator);

            //경영진/법무팀
            initializeMenu("NOTICEBOARD_MANAGEMENT", "공지사항 관리", "경영진 - 공지사항 관리", "Finance & Legal", creator);
            initializeMenu("USER_MANAGEMENT", "사용자 관리", "경영진 - 사용자 계정 관리", "Finance & Legal", creator);
            initializeMenu("ATTENDANCE_MANAGEMENT", "근태관리", "경영진 - 근태 관리", "Finance & Legal", creator);
            initializeMenu("REVENUE_ANALYSIS", "수익분석", "경영진 - 수익분석 기능", "Finance & Legal", creator);
            initializeMenu("SETTLEMENT_MANAGEMENT", "정산관리", "경영진 - 정산 내역 관리", "Finance & Legal", creator);
            initializeMenu("CONTRACT_MANAGEMENT", "계약서관리", "경영진 - 계약 문서 관리", "Finance & Legal", creator);

            //관리자
            initializeMenu("DASHBOARD", "대시보드", "대시보드 시각화 요약", "System Operations", creator);

            //아티스트/매니터
            initializeMenu("SCHEDULE_MANAGEMENT", "스케줄관리", "매니저/아티스트 - 스케줄 공유 게시판", "Artist & Manager", creator);
            initializeMenu("PRACTICEROOM_RESERVATION", "회의실예약", "매니저/아티스트 - 회의실 예약기능", "Artist & Manager", creator);
            initializeMenu("ARTIST_REPORT", "활동보고서", "매니저/아티스트 - 활동보고서 게시판", "Artist & Manager", creator);
            initializeMenu("SNS_CONTENT", "SNS컨텐츠", "마케팅 - SNS 콘텐츠 게시판", "Artist & Manager", creator);
            initializeMenu("EVENTS", "이벤트", "마케팅 - 이벤트 게시판", "Artist & Manager", creator);
            initializeMenu("STUDIO_RESERVATION", "연습실 예약", "연습실 예약 기능", "Artist & Manager", creator);

            log.info("[PostMenuInitializer] 게시판 초기화가 완료되었습니다.");
        } catch (Exception e) {
            log.error("[PostMenuInitializer] 게시판 초기화 중 오류가 발생했습니다.", e);
            throw e;
        }
    }
}
