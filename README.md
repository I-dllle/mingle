 <a href="https://www.mingleservice.site/" target="_blank">
 <img src="https://github.com/user-attachments/assets/1c9a4ac0-28af-4f03-9dbe-ace797c34fef" alt="배너" width="100%"/>
 </a>

 <br/>
 <br/>

# 0. Getting Started (시작하기)
 ```bash
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/

 :: Spring Boot ::                (v3.4.4)

 ```
🖱️ [서비스 링크](https://www.mingleservice.site)

 <br/>
 <br/>

# 1. Project Overview (프로젝트 개요)
###  프로젝트 이름: Mingle
### 프로젝트 설명:

**Mingle**은 엔터테인먼트 기업 내  
**다양한 부서, 아티스트, 내부 구성원**들이 유기적으로 협업할 수 있도록 설계된  **올인원 그룹웨어 플랫폼**입니다.

---

Mingle은 다음과 같은 기능들을 하나로 통합하여  
**기획 → 실행 → 관리 → 공유**까지  
모든 업무를 효율적으로 처리할 수 있는 환경을 제공합니다.

- 🗨️ 실시간 채팅  
- 🎬 콘텐츠 관리  
- 💰 정산 시스템  
- 📅 일정 및 근태 관리  
- 🏢 회의실 / 연습실 예약  
- 🛍️ 굿즈샵 (직원 전용 판매)

---

> 이 플랫폼은 엔터 산업 내 협업과 커뮤니케이션을 극대화하며,  
> 구성원 모두가 하나의 시스템 안에서 업무를 처리할 수 있도록 지원합니다.




 <br/>
 <br/>

# 2. Team Members (팀원 및 팀 소개)
| 이은서 | 이서영 | 전병우 | 김현우 |
 |:------:|:------:|:------:|:------:|
| <img src="https://github.com/user-attachments/assets/5bd4b56f-3b71-45e9-8b85-be926de56cdc" alt="이은서" width="150"> | <img src="https://github.com/user-attachments/assets/eb93e3ee-4b64-41e4-9672-745062936efd" alt="이서영" width="150"> | <img src="https://github.com/user-attachments/assets/5b05c683-ae90-44cb-b5de-ba26086e0994" alt="전병우" width="150"> | <img src="" alt="김현우" width="150"> |
| BE | BE | BE | BE |
| [GitHub](https://github.com/monimoni12) | [GitHub](https://github.com/Si159521) | [GitHub]() | [GitHub]() |

 <br/>
 <br/>

# 3. Key Features (주요 기능)
- **공통**
    - **일반로그인(JWT)**

    - **좌측 사이드바**
        - **공지사항**
        - **업무자료 게시판**
        - **부서별 게시판**
        - **캘린더 일정관리 CRUD**
            - 스케줄 열람/등록/수정/삭제
            - 회사전체 일정, 부서별 일정, 개인 일정
            - 메모
        - **근태 및 출퇴근 관리**
        - **모집공고**
        - **굿즈샵(직원할인가 판매 페이지)**
        - **회의실 예약**
        - **연습실 예약**

    - **우측 사이드바**
        - 실시간 채팅 서비스
           - 그룹 채팅
              - 부서 채팅
                 - 일반 채팅
                 - 자료방
              - 프로젝트 채팅
                 - 일반 채팅
                 - 자료방
           - DM
              - 1:1 채팅       

- **스태프(기획/제작/정산/홍보)**
    - **게시글 CRUD**
        - **기획팀**
            - A&R 아티스트 등록
            - 팀/유닛 구성
            - 활동 기획 입력
        - **콘텐츠팀**
            - 음원, 영상, 보도자료, 앨범 커버 등 자료 업로드
        - **정산/법무팀**
            - 수익 정산 내역 등록
            - 계약서 업로드
            - 갱신 관리
        - **마케팅/홍보팀**
            - SNS 콘텐츠 계획
            - 팬이벤트 기획/이력 관리
        - **아티스트/매니저**
            - 콘텐츠 확인 활동 관련 콘텐츠 열람 (보도자료 등 포함)
            - 현장 보고 활동 종료 후 메모, 사진, 간단 보고서 업로드
        - **경영진 / 관리자**
            - 전체 통계 대시보드
            - 모든 콘텐츠/정산 열람 가능

 <br/>
 <br/>

# 4. Tasks & Responsibilities (작업 및 역할 분담)
|  |  |  |
 |-----------------|-----------------|-----------------|
| 이은서   |  <img src="https://github.com/user-attachments/assets/5bd4b56f-3b71-45e9-8b85-be926de56cdc" width="100"> | <ul><li>(1) 채팅기능</li><li>(2) 프론트구조 빌드</li><li>(3) Jwt 로그인기능</li><li>(4) mingle 플젝 전반적 디자인/ 팀 git, 이슈, discussion 등 전반적 컨벤션</li></ul>     |
| 이서영   |  <img src="https://github.com/user-attachments/assets/eb93e3ee-4b64-41e4-9672-745062936efd" width = "100">| <ul><li>(1) 게시판기능 </li><li>(2) 상점 및 결제기능 </li><li>(3) 배포</li></ul> |
| 전병우   |  <img src="https://github.com/user-attachments/assets/5b05c683-ae90-44cb-b5de-ba26086e0994" width="100">    |<ul><li>(1) 캘린더 및 일정관리 기능</li><li>(2) 회의실/연습실 예약기능 </li><li>(3) 근태기능</li></ul>  |
| 김현우    |  <img src="" width="100">    | <ul><li>(1) 정산 및 계약기능</li><li>(2) 관리자기능</li></ul>    |

 <br/>
 <br/>

# 5. Technology Stack (기술 스택)

## 5.1 Language
[![Java](https://img.shields.io/badge/Java-007396?style=flat&logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
<br/>

## 5.2 Frontend
[![Next.js](https://img.shields.io/badge/NextJs-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Electron](https://img.shields.io/badge/Electron-47848F?style=flat&logo=Electron&logoColor=white)](https://www.electronjs.org/)

 <br/>

## 5.3 Backend
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=flat&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Spring Security](https://img.shields.io/badge/Spring_Security-6DB33F?style=flat&logo=spring-security&logoColor=white)](https://spring.io/projects/spring-security)
[![Spring Data JPA](https://img.shields.io/badge/Spring_Data_JPA-6DB33F?style=flat&logo=spring&logoColor=white)](https://spring.io/projects/spring-data-jpa)
[![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=flat&logo=swagger&logoColor=black)](https://swagger.io/tools/swagger-ui/)
[![Lombok](https://img.shields.io/badge/Lombok-ED1C24?style=flat&logo=java&logoColor=white)](https://projectlombok.org/)
<br/>

## 5.4 Infra
[![Amazon EC2](https://img.shields.io/badge/Amazon_EC2-FF9900?style=flat&logo=amazon-ec2&logoColor=white)](https://aws.amazon.com/ec2/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)](https://www.docker.com/)
[![Nginx](https://img.shields.io/badge/Nginx-009639?style=flat&logo=nginx&logoColor=white)](https://www.nginx.com/)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat&logo=Redis&logoColor=white)](https://redis.io/)
[![Amazon S3](https://img.shields.io/badge/Amazon_S3-569A31?style=flat&logo=amazon-s3&logoColor=white)](https://aws.amazon.com/s3/)
<br/>

## 5.5 Cooperation
[![Git](https://img.shields.io/badge/Git-F05032?style=flat&logo=git&logoColor=white)](https://git-scm.com/)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white)](https://github.com/)
[![Notion](https://img.shields.io/badge/Notion-000000?style=flat&logo=notion&logoColor=white)](https://www.notion.so/)
<br/>

# 6. Project Structure (프로젝트 구조)

## 6.1 Backend
 ```plaintext
be/(Backend - Java)
└── src/                                  # 백엔드 루트 디렉토리 (Java 기반)
    ├── main/                              
    │   ├── java/                         # 로직 소스 폴더
    │   └── resources/                    # yml파일 및 템플릿 폴더
    │   
    ├── (java)/                             # 공통 레이아웃 적용되는 일반 업무 페이지
    │   ├── mingle/                          # 게시판 도메인
    │   │   ├── domain/             # 서비스 구성에 필요한 domain 정의. (각각의 최하위 폴더 하에는 entity, dto, repository, service, controller가 존재)
    │   |       ├── admin/          # 관리자
    │   |           ├── dashboard/          
    │   |           └── panel/      
    │   |       ├── attendance/     # 근태관리(휴가, 출장, 반차) 
    │   |           ├── attendance/         
    │   |           └── attendanceRequest/         
    │   |       ├── chat/           # 실시간 채팅
    │   |           ├── archive/      
    │   |           ├── common/      
    │   |           ├── dm/      
    │   |           └── group/      
    │   |       ├── goods/          # 굿즈상점 및 결제시스템
    │   |       ├── post/           # 게시판
    │   |           ├── legatpost/  # 계약, 정산, 법무관련 민감자료들을 다루는 게시판
    │   |           └── post/       # 일반 부서별 게시판
    │   |       ├── projectleaderauthority/    # 회사에서 진행하는 프로젝트 관련 
    │   |       ├── reservation/    # 회의실, 연습실 예약
    │   |           ├── reservation/      
    │   |           └── room/      
    │   |       ├── schedule/       # 일정관리(캘린더)
    │   |       └── user/           # 사용자 관련(로그인, 인증/인가, 출결(출근, 지각, 결근, 야근))
    │   |           ├── artist/
    │   |           ├── team/           
    │   |           ├── auth/      
    │   |           ├── presence/      
    │   |           └── user/      
    |   |
    │   │   ├── global/             # 프로그램 공통에 적용되는 설정과 구조 빌드
    │   |       ├── aws/
    │   |       ├── config/
    │   |       ├── constants/
    │   |       ├── exception/
    │   |       ├── init/
    │   |       ├── jpa/
    │   |       ├── rq/
    │   |       ├── rsdata/
    │   |       ├── scheduler/
    │   |       ├── jpa/
    │   |       ├── security/
    │   |       └── websocket/
    │   |   └── MingleApplication.java     # main실행
    │   |
    ├── (resources)/                          
    │   ├── application.yml                   # yml 설정파일
    │   ├── application-secret.yml            # 민감정보 yml
    │   ├── application-dev.yml               # 개발용 yml
    │   ├── application-prod.yml              # 배포용 yml
    │   ├── static                  # 토스페이먼츠 결제시스템 css파일
    │   └── templates/              # 토스페이먼트 결제시스템 html 페이지
    │   
    ├── Dockerfile                 # 도커 실행 설정파일                                       
    └── infra/                     # 백엔드 무중단 배포 설정파일
 ```
 <br/>

## 6.2 Frontend
```plaintext
fe/(Frontend - Next.js / TypeScript)
└── src/                                  # 프론트엔드 루트 디렉토리 (Next.js 기반)
    ├── app/                              # Next.js App Router 기반 라우팅 디렉토리
    │   ├── layout.tsx                    # 루트 전역 레이아웃 (폰트, 테마, 인증만 적용 — 사이드바 X)
    │   ├── globals.css                   # 전역 CSS 파일 (폰트, reset 등)
    │   └── page.tsx                      # 기본 랜딩 페이지 (예: 일정 캘린더)
    │   
    ├── (main)/                             # 공통 레이아웃 적용되는 일반 업무 페이지
    │   ├── layout.tsx                      # 공통 레이아웃: 좌측 사이드바 + 우측 메신저 포함
    │   │
    │   ├── board/                          # 게시판 도메인
    │   │   ├── common/page.tsx             # 공지사항, 업무자료 등 공통 게시판
    │   │   └── department/[menu]/page.tsx  # 부서별 게시판
    │   │
    │   ├── (common)/  #공통게시판
    |   |                  ,,, 
    │   │
    │   ├── (department)/  #부서별게시판
    |   |                      ,,,
    │   |
    ├── (auth)/                          # 인증 전용 페이지 (공통 레이아웃 미적용)
    │   ├── login/                       # 로그인 페이지
    │   ├── signup/                      # 회원가입 페이지
    │   └── logout/                      # 로그아웃 처리
    │   
    ├── (chat-detail)/                   # 채팅방기능 
    |   ├── layout.tsx                   # 채팅 전용 전체 레이아웃
    │   ├── dm/                          # DM
    │   └── group/                       # 그룹채팅
    │       ├── create/                  # 그룹 채팅방 생성 페이지
    │       ├── project/                 #  
    │       │   ├── layout.tsx           # 
    │       │   ├── [roomId]/            #  
    │       │   │   ├── archive/         # 자료방
    │       │   │   └── normal/          # 일반채팅 
    │       │   └── list/                #  
    │       └── team/                    # 팀채팅
    │           ├── layout.tsx           # 
    │           └── [roomId]/            #  
    │               ├── archive/         # 자료방
    │               └── normal/          # 일반채팅                                            
    │   
    ├── (admin)/                         # 관리자 페이지
    |                                        ,,,
    │
    |
    ├── features/                        # [도메인 기반 로직 집합] - 상태/서비스/UI 통합
    |                                                         ,,,,
    │   
    ├── components                            # 전역 컴포넌트 (재사용 목적)
    | 
    ├── constants/                        # Enum 및 상수 값
    |                                            ,,,
    ├── context/                                                
    │                                       
    ├── hooks/                            # 전역 커스텀 훅
    │  
    ├── lib/                              # 공통 유틸리티, axios 등
    |                                             ,,,
    └── middleware.ts                     # 인증 상태에 따라 페이지 접근 제어 (리디렉션 처리용 미들웨어)

```
 <br/>

# 7. Development Workflow (개발 워크플로우)
## 브랜치 전략 (Branch Strategy)
우리의 브랜치 전략은 Git Flow를 기반으로 하며, 다음과 같은 브랜치를 사용합니다.

- **🌿main**
    - 배포 가능한 상태의 코드를 유지합니다.
    - 모든 배포는 이 브랜치에서 이루어집니다.

- **🌿dev**
    - 개발 환경을 유지합니다.

- **🌿feature/{be/fe}/{number}**
    - feature 개발 브랜치입니다.
    - 모든 기능 개발은 이 브랜치에서 이루어집니다.
    - be와 fe를 구분합니다.

- **🌿refactor/{be/fe}/{number}**
    - 리팩토링 브랜치입니다.
    - 구조 및 기타 개선사항 반영은 이 브랜치에서 이루어집니다.
    - be와 fe를 구분합니다.

- **🌿fix/{be/fe}/{number}**
    - 버그 수정 브랜치입니다.
    - bugfix는 이 브랜치에서 이루어집니다.
    - be와 fe를 구분합니다.
      <br/>
      <br/>

# 8. Coding Convention
## 명명 규칙
### 💻 Java 쪽 컨벤션
| 항목 | 표기법 | 예시 | 설명 |
| :----------: | :----------: | :----------: | :----------: |
| 클래스명    | PascalCase         | `PostCategory`, `UserController` | 파일 이름 = 클래스 이름 |
| 변수명/필드명 | camelCase          | `createdAt`, `userId`            | 첫 글자 소문자 |
| 메서드명    | camelCase          | `getUserName()`, `createPost()`  | 동사 중심 |
| 패키지명    | lowercase + 점(.)   | `com.example.post.entity`        | 전부 소문자 |
| 제네릭 타입  | PascalCase         | `List<Post>`                     | 클래스명 기준 |
| enum 상수 | UPPER\_SNAKE\_CASE | `PENDING`, `APPROVED_REJECTED`   | 고정된 상수 이름 |


### 🗄️ DB (JPA 매핑 관련) 컨벤션
| 항목 | 표기법 | 예시 | 설명 |
| :-----------: | :----------: | :----------: | :----------: |
| 테이블명 | snake\_case | `"post_category"`           | DB 테이블명에 맞춰 작성     |
| 컬럼명 | snake\_case | `"created_at"`, `"user_id"` | DB 컬럼명에 맞춰 작성      |
| 시퀀스명/제약조건명 | snake\_case | `post_id_seq`, `fk_user_id` | 대부분 snake\_case 사용 |
| 기본키 | snake\_case | `post_id`, `user_id`        | 보통 테이블명 + `_id`    |




 <br/>


## 이슈 네이밍
| 태그 | 의미 |
| :-----------: | :-----------: |
| `{BE/FE}/FEAT` | 새로운 기능 추가 |
| `{BE/FE}/FIX` | 버그 수정 |
| `{BE/FE}/REFACTOR` | 리팩토링 (기능 변경 없이 코드 개선) |
| `DOCS` | 문서 수정 |
| `STYLE` | 코드 포맷팅, 세미콜론 누락 등 의미 없는 변경 |
| `TEST` | 테스트 코드 관련 |
| `CHORE` | 빌드 설정, 패키지 설치 등 잡일성 작업 |
| `CI / BUILD` | CI/CD 관련 설정 작업 |


 <br/>

# 9. 커밋 컨벤션
## 기본 구조
 ```
 [{BE/FE}/type] 수정대상 - 수정내용

 ```

 <br/>

## type 종류
 ```
 feat : 새로운 기능 추가
 fix : 버그 수정
 refactor : 코드 리펙토링

 ```

 <br/> 
 <br/>
 
