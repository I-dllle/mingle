// src/constants/PostMenu.ts

export type MenuItem = {
  id: number;
  name: string;
  path: string;
  isActive: boolean;
};

export const departmentMenus: Record<string, MenuItem[]> = {
  "Creative Studio": [
    {
      id: 1,
      name: "음원, 영상",
      path: "/audio-video",
      isActive: true,
    },
    {
      id: 2,
      name: "보도자료",
      path: "/press-releases",
      isActive: true,
    },
    {
      id: 3,
      name: "콘텐츠분류, 앨범커버",
      path: "/contentclassification-albumcovers",
      isActive: true,
    },
  ],

  "Planning & A&R": [
    {
      id: 1,
      name: "팀/유닛 구성",
      path: "/team-composition",
      isActive: true,
    },
    { id: 2, name: "아티스트", path: "/artists", isActive: true },
    {
      id: 3,
      name: "활동기획",
      path: "/activity-planning",
      isActive: true,
    },
  ],

  "Marketing & PR": [
    {
      id: 1,
      name: "SNS컨텐츠",
      path: "/sns-content",
      isActive: true,
    },
    { id: 2, name: "이벤트", path: "/marketing/events", isActive: true },
  ],

  "Finance & Legal": [
    {
      id: 1,
      name: "수익 정산 내역",
      path: "/revenue-settlement",
      isActive: true,
    },
    {
      id: 2,
      name: "계약서관리",
      path: "/contract-management",
      isActive: true,
    },
    {
      id: 3,
      name: "내부 규정",
      path: "/internal-policy",
      isActive: true,
    },
    {
      id: 4,
      name: "법률 분쟁 내역",
      path: "/legal-disputes",
      isActive: true,
    },
  ],

  "System Operations": [
    { id: 1, name: "대시보드", path: "/ops/dashboard", isActive: true },
    {
      id: 2,
      name: "공지사항 관리",
      path: "/noticeboard-management",
      isActive: true,
    },
    {
      id: 3,
      name: "사용자 관리",
      path: "/user-management",
      isActive: true,
    },
    {
      id: 4,
      name: "근태관리",
      path: "/attendance-management",
      isActive: true,
    },
    { id: 5, name: "수익분석", path: "/ops/revenue-analysis", isActive: true },
    {
      id: 6,
      name: "정산관리",
      path: "/settlement-management",
      isActive: true,
    },
    {
      id: 7,
      name: "계약서관리",
      path: "/contract-management",
      isActive: true,
    },
  ],

  "Artist & Manager": [
    {
      id: 1,
      name: "활동보고서",
      path: "/artist-report",
      isActive: true,
    },
    {
      id: 2,
      name: "SNS컨텐츠",
      path: "/sns-content",
      isActive: true,
    },
    { id: 3, name: "이벤트", path: "/events", isActive: true },
    {
      id: 4,
      name: "연습실 예약",
      path: "/studio-reservation",
      isActive: true,
    },
  ],
};
