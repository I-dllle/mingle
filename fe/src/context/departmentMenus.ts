export const departmentMenus: Record<
  string,
  {
    id: string;
    name: string;
    icon: string;
    path: string;
    isActive?: boolean;
  }[]
> = {
  "Creative Studio": [
    {
      id: "audio_video",
      name: "음원/영상",
      icon: "document",
      path: "/audio_video",
    },
    {
      id: "press_releases",
      name: "보도자료",
      icon: "text",
      path: "press_releases",
    },
    {
      id: "album_covers",
      name: "앨범커버",
      icon: "palette",
      path: "/contentclassification-albumcovers",
    },
  ],
  "Planning & A&R": [
    {
      id: "team_composition",
      name: "팀/유닛 구성",
      icon: "user",
      path: "/team-composition",
    },
    {
      id: "artists",
      name: "아티스트",
      icon: "document",
      path: "/artists",
    },
    {
      id: "activity_planning",
      name: "활동기획",
      icon: "calendar",
      path: "/activity-planning",
    },
  ],
  "Marketing & PR": [
    {
      id: "sns_content",
      name: "SNS컨텐츠",
      icon: "document",
      path: "/sns-content",
    },
    {
      id: "events",
      name: "이벤트",
      icon: "calendar",
      path: "/events",
    },
  ],
  "Finance & Legal": [
    {
      id: "contract_management",
      name: "계약서관리",
      icon: "document",
      path: "/contracts",
    },
    {
      id: "revenue_analysis",
      name: "수익분석",
      icon: "chart",
      path: "/revenue",
    },
    {
      id: "internal_policy",
      name: "내부 규정",
      icon: "book",
      path: "/policy",
    },
    {
      id: "legal_disputes",
      name: "법률 분쟁 내역",
      icon: "refresh",
      path: "/legal-disputes",
    },
  ],
  "System Operations": [
    {
      id: "dashboard",
      name: "대시보드",
      icon: "chart",
      path: "/dashboard",
      isActive: true,
    },
    {
      id: "user_management",
      name: "사용자 관리",
      icon: "user",
      path: "/panel/users",
    },
    {
      id: "attendance_management",
      name: "근태관리",
      icon: "clock",
      path: "/panel/attendance",
    },
    {
      id: "revenue_management",
      name: "수익/정산관리",
      icon: "money",
      path: "/panel/revenue",
    },
    {
      id: "contract_management",
      name: "계약서 관리",
      icon: "document",
      path: "/panel/contracts",
    },
  ],
  "Artist & Manager": [
    {
      id: "artist_report",
      name: "활동보고서",
      icon: "document",
      path: "/artist-report",
    },
    {
      id: "studio_reservation",
      name: "연습실 예약",
      icon: "calendar",
      path: "/studio-reservation",
    },
    {
      id: "sns_content",
      name: "SNS컨텐츠",
      icon: "text",
      path: "/sns-content", // marketing 부서와 동일
    },
    {
      id: "events",
      name: "이벤트",
      icon: "calendar",
      path: "/events", // marketing 부서와 동일
    },
  ],
  default: [
    { id: "dashboard", name: "대시보드", icon: "document", path: "/main" },
    { id: "profile", name: "프로필", icon: "user", path: "/main/user/profile" },
    {
      id: "setting",
      name: "설정",
      icon: "setting",
      path: "/main/user/setting",
    },
  ],
};
