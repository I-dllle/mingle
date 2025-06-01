export const departmentMenus: Record<
  string,
  {
    id: number;
    name: string;
    icon: string;
    path: string;
    isActive?: boolean;
  }[]
> = {
  "Creative Studio": [
    {
      id: 4, // 백엔드 PostType 테이블의 실제 ID 사용 (menu_id=12, department_id=1)
      name: "공지사항",
      icon: "document",
      path: "/creative-notices",
    },
    {
      id: 8,
      name: "음원/영상",
      icon: "document",
      path: "/audio-video",
    },
    {
      id: 9,
      name: "보도자료",
      icon: "text",
      path: "/press-releases",
    },
    {
      id: 10,
      name: "앨범커버",
      icon: "palette",
      path: "/contentclassification-albumcovers",
    },
  ],
  "Planning & A&R": [
    {
      id: 4, // 백엔드 PostType 테이블의 실제 ID 사용 (menu_id=12, department_id=1)
      name: "공지사항",
      icon: "document",
      path: "/planning-notices",
    },
    {
      id: 11,
      name: "팀/유닛 구성",
      icon: "user",
      path: "/team-composition",
    },
    {
      id: 12,
      name: "아티스트",
      icon: "document",
      path: "/artists",
    },
    {
      id: 13,
      name: "활동기획",
      icon: "calendar",
      path: "/activity-planning",
    },
  ],
  "Marketing & PR": [
    {
      id: 4, // 백엔드 PostType 테이블의 실제 ID 사용 (menu_id=12, department_id=1)
      name: "공지사항",
      icon: "document",
      path: "/marketing-notices",
    },
    {
      id: 14,
      name: "SNS컨텐츠",
      icon: "document",
      path: "/sns-content",
    },
    {
      id: 15,
      name: "이벤트",
      icon: "calendar",
      path: "/events",
    },
  ],
  "Finance & Legal": [
    {
      id: 4, // 백엔드 PostType 테이블의 실제 ID 사용 (menu_id=12, department_id=1)
      name: "공지사항",
      icon: "document",
      path: "/finance-notices",
    },
    {
      id: 17,
      name: "계약서관리",
      icon: "document",
      path: "/contracts",
    },
    {
      id: 16,
      name: "수익분석",
      icon: "chart",
      path: "/revenue",
    },
    {
      id: 18,
      name: "내부 규정",
      icon: "book",
      path: "/policy",
    },
    {
      id: 19,
      name: "법률 분쟁 내역",
      icon: "refresh",
      path: "/legal-disputes",
    },
  ],
  "System Operations": [
    {
      id: 20,
      name: "대시보드",
      icon: "chart",
      path: "/dashboard",
      isActive: true,
    },
    {
      id: 22,
      name: "사용자 관리",
      icon: "user",
      path: "/panel/users",
    },
    {
      id: 23,
      name: "근태관리",
      icon: "clock",
      path: "/panel/attendance",
    },
    {
      id: 24,
      name: "수익/정산관리",
      icon: "money",
      path: "/panel/revenue",
    },
    {
      id: 26,
      name: "계약서 관리",
      icon: "document",
      path: "/panel/contracts",
    },
    {
      id: 4,
      name: "공지사항 관리",
      icon: "document",
      path: "/panel/posts",
    },
  ],
  "Artist & Manager": [
    {
      id: 4, // 백엔드 PostType 테이블의 실제 ID 사용 (menu_id=12, department_id=1)
      name: "공지사항",
      icon: "document",
      path: "/artist-notices",
    },
    {
      id: 27, // 백엔드 PostType 테이블의 실제 ID 사용 (menu_id=12, department_id=1)
      name: "활동보고서",
      icon: "document",
      path: "/artist-report",
    },
    {
      id: 28, // 적절한 PostType ID로 변경 필요
      name: "SNS컨텐츠",
      icon: "text",
      path: "/sns-contents",
    },
    {
      id: 29, // 적절한 PostType ID로 변경 필요
      name: "이벤트",
      icon: "calendar",
      path: "/artist-event",
    },
  ],
  default: [
    { id: 0, name: "대시보드", icon: "document", path: "/main" },
    { id: 0, name: "프로필", icon: "user", path: "/main/user/profile" },
    {
      id: 0,
      name: "설정",
      icon: "setting",
      path: "/main/user/setting",
    },
  ],
};
