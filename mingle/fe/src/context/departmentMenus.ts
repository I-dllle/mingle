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
  'Planning & A&R': [
    {
      id: 'team_composition',
      name: '팀/유닛 구성',
      icon: 'user',
      path: '/main/board/team',
    },
    {
      id: 'artists',
      name: '아티스트',
      icon: 'document',
      path: '/main/board/artists',
    },
    {
      id: 'activity_planning',
      name: '활동기획',
      icon: 'calendar',
      path: '/main/board/plan',
    },
  ],
  'Creative Studio': [
    {
      id: 'audio_video',
      name: '음원/영상',
      icon: 'document',
      path: '/main/board/media',
    },
    {
      id: 'press_releases',
      name: '보도자료',
      icon: 'text',
      path: '/main/board/press',
    },
    {
      id: 'album_covers',
      name: '앨범커버',
      icon: 'palette',
      path: '/main/board/cover',
    },
  ],
  'Marketing & PR': [
    {
      id: 'sns_content',
      name: 'SNS컨텐츠',
      icon: 'document',
      path: '/main/board/sns',
    },
    {
      id: 'events',
      name: '이벤트',
      icon: 'calendar',
      path: '/main/board/event',
    },
    {
      id: 'press_releases',
      name: '보도자료',
      icon: 'text',
      path: '/main/board/press',
    },
  ],
  'Finance & Legal': [
    {
      id: 'noticeboard_management',
      name: '공지사항',
      icon: 'document',
      path: '/main/board/notice',
    },
    {
      id: 'user_management',
      name: '사용자 관리',
      icon: 'user',
      path: '/main/user/manage',
    },
    {
      id: 'attendance_management',
      name: '근태관리',
      icon: 'clock',
      path: '/main/attendance',
    },
    {
      id: 'revenue_analysis',
      name: '수익분석',
      icon: 'chart',
      path: '/main/board/revenue',
    },
    {
      id: 'settlement_management',
      name: '정산관리',
      icon: 'book',
      path: '/main/board/settlement',
    },
    {
      id: 'contract_management',
      name: '계약서관리',
      icon: 'document',
      path: '/main/board/contract',
    },
    {
      id: 'renewals',
      name: '갱신 관리',
      icon: 'refresh',
      path: '/main/board/renewal',
    },
  ],
  'System Operations': [
    {
      id: 'dashboard',
      name: '대시보드',
      icon: 'chart',
      path: '/main/dashboard',
      isActive: true,
    },
  ],
  'Artist & Manager': [
    {
      id: 'artist_report',
      name: '활동보고서',
      icon: 'document',
      path: '/main/board/report',
    },
    {
      id: 'sns_content',
      name: 'SNS컨텐츠',
      icon: 'text',
      path: '/main/board/sns',
    },
    {
      id: 'events',
      name: '이벤트',
      icon: 'calendar',
      path: '/main/board/event',
    },
    {
      id: 'studio_reservation',
      name: '연습실 예약',
      icon: 'calendar',
      path: '/main/reservation/studio',
    },
  ],
  default: [
    { id: 'dashboard', name: '대시보드', icon: 'document', path: '/main' },
    { id: 'profile', name: '프로필', icon: 'user', path: '/main/user/profile' },
    {
      id: 'setting',
      name: '설정',
      icon: 'setting',
      path: '/main/user/setting',
    },
  ],
};
