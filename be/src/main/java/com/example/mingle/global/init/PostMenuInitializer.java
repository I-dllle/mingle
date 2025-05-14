package com.example.mingle.global.init;

import com.example.mingle.domain.post.post.entity.Post;
import com.example.mingle.domain.post.post.entity.PostMenu;
import com.example.mingle.domain.post.post.repository.MenuRepository;
import com.example.mingle.domain.user.team.entity.Department;
import com.example.mingle.domain.user.team.repository.DepartmentRepository;
import com.example.mingle.global.exception.ApiException;
import com.example.mingle.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestMapping;

@Component
@RequiredArgsConstructor
public class PostMenuInitializer implements ApplicationRunner {
    private final MenuRepository menuRepository;
    private final DepartmentRepository departmentRepository;

    @Override
    public void run(ApplicationArguments args) {
        //공통
        initializeCommonMenu("BUSINESS_DOCUMENTS", "업무자료", "부서별 업무 자료 게시판");
        initializeCommonMenu("MEETINGROOM_RESERVATION", "회의실 예약", "회의실 예약 기능");
        initializeCommonMenu("NOTICE", "공지사항", "공지사항 게시판");
        initializeCommonMenu("AUDITION_ANNOUNCEMENT", "오디션 공고", "오디션 관련 공지 게시판");

        //콘텐츠팀
        initializeMenu("AUDIO_VIDEO", "음원, 영상", "콘텐츠팀 - 음원 및 영상 업로드용 게시판", "Creative Studio");
        initializeMenu("PRESS_RELEASES", "보도자료", "콘텐츠팀/마케팅 - 보도자료 관리 게시판", "Creative Studio");
        initializeMenu("CONTENTCLASSIFICATION_ALBUMCOVERS", "콘텐츠분류, 앨범커버", "콘텐츠 분류 및 앨범 커버 관련 게시판", "Creative Studio");

        //기획팀
        initializeMenu("TEAM_COMPOSITION", "팀/유닛 구성", "기획팀 - 유닛/팀 구성 관련 게시판","Planning & A&R");
        initializeMenu("ARTISTS", "아티스트", "기획팀 - 아티스트 정보 공유", "Planning & A&R");
        initializeMenu("ACTIVITY_PLANNING", "활동기획", "기획팀 - 활동 기획 관련 자료", "Planning & A&R");

        //마케팅/홍보팀
        initializeMenu("SNS_CONTENT", "SNS컨텐츠", "마케팅 - SNS 콘텐츠 게시판", "Marketing & PR");
        initializeMenu("EVENTS", "이벤트", "마케팅 - 이벤트 게시판", "Marketing & PR");

        //경영진/법무팀
        initializeMenu("NOTICEBOARD_MANAGEMENT", "공지사항 관리", "경영진 - 공지사항 관리", "Finance & Legal");
        initializeMenu("USER_MANAGEMENT", "사용자 관리", "경영진 - 사용자 계정 관리", "Finance & Legal");
        initializeMenu("ATTENDANCE_MANAGEMENT", "근태관리", "경영진 - 근태 관리", "Finance & Legal");
        initializeMenu("REVENUE_ANALYSIS", "수익분석", "경영진 - 수익분석 기능", "Finance & Legal");
        initializeMenu("SETTLEMENT_MANAGEMENT", "정산관리", "경영진 - 정산 내역 관리", "Finance & Legal");
        initializeMenu("CONTRACT_MANAGEMENT", "계약서관리", "경영진 - 계약 문서 관리", "Finance & Legal");

        //관리자
        initializeMenu("DASHBOARD", "대시보드", "대시보드 시각화 요약", "System Operations");

        //아티스트/매니터
        initializeMenu("SCHEDULE_MANAGEMENT", "스케줄관리", "매니저/아티스트 - 스케줄 공유 게시판", "Artist & Manager");
        initializeMenu("PRACTICEROOM_RESERVATION", "연습실예약", "매니저/아티스트 - 연습실 예약기능", "Artist & Manager");
        initializeMenu("SNS_CONTENT", "SNS컨텐츠", "마케팅 - SNS 콘텐츠 게시판", "Artist & Manager");
        initializeMenu("EVENTS", "이벤트", "마케팅 - 이벤트 게시판", "Artist & Manager");
        initializeMenu("STUDIO_RESERVATION", "연습실 예약", "연습실 예약 기능", "Artist & Manager");
    }

    //공통 메뉴
    private void initializeCommonMenu(String code, String name, String description) {
        if (menuRepository.findByCode(code).isEmpty()) {
            PostMenu menu = PostMenu.builder()
                    .code(code)
                    .name(name)
                    .description(description)
                    .department(null)
                    .build();
            menuRepository.save(menu);
        }
    }

    //부서별 메뉴
    private void initializeMenu(String code, String name, String description, String departmentName) {
        Department department = departmentRepository.findByDepartmentName(departmentName)
                .orElseThrow(() -> new ApiException(ErrorCode.ACCESS_DENIED));

        if (menuRepository.findByCode(code).isEmpty()) {
            PostMenu menu = PostMenu.builder()
                    .code(code)
                    .name(name)
                    .description(description)
                    .department(department)
                    .build();
            menuRepository.save(menu);
        }
    }
}
