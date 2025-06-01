"use client";

import React from "react";
import NoticeList from "@/features/board/components/notices/NoticeList";
import CompanyNews from "@/features/board/components/notices/CompanyNews";
import DepartmentNoticeList from "@/features/board/components/notices/DepartmentNoticeList";
import { useRouter } from "next/navigation";

// 중요 공지사항 더미 데이터
const importantNotices = [
  {
    id: 1,
    title: "2025년 상반기 마케팅 전략 회의 안내",
    content:
      "5월 15일(목) 오전 10시, 대회의실에서 상반기 마케팅 전략 회의가 진행됩니다. 각 팀장님들은 부서별 보고서를 준비해 주시기 바랍니다.",
    date: "2025-05-08",
    author: "김민지",
    position: "대표",
    isPinned: true,
  },
  {
    id: 2,
    title: "신규 클라이언트 온보딩 프로세스 변경 안내",
    content: "마케팅 부서 대상",
    date: "2025-05-12",
    author: "박서연",
    position: "팀장",
    isPinned: false,
  },
  {
    id: 3,
    title: "5월 사내 워크숍 참가 신청 안내",
    content: "이벤트 안내",
    date: "2025-05-08",
    author: "이지현",
    position: "매니저",
    isPinned: false,
  },
  {
    id: 4,
    title: "신규 소셜미디어 가이드라인 배포",
    content: "전부서 공통",
    date: "2025-05-07",
    author: "정현우",
    position: "팀장",
    isPinned: false,
  },
];

// 회사 소식 목업 데이터
const companyNews = [
  {
    id: 1,
    title: "2025 디지털 마케팅 트렌드 세미나 성황리 개최",
    summary:
      "지난 주 진행된 디지털 마케팅 트렌드 세미나에는 100여 명의 업계 관계자가 참석하였습니다.",
    image:
      "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80",
    date: "2025-05-05",
    department: "마케팅팀",
  },
  {
    id: 2,
    title: "글로벌 확장형 브랜드 '유미나' 신규 계약 체결",
    summary:
      "글로벌 확장형 브랜드 '유미나'와 2년 계약을 체결하여 아시아 지역 PR 및 마케팅을 맡게 되었습니다.",
    image:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80",
    date: "2025-05-02",
    department: "비즈니스개발팀",
  },
];

// 부서별 공지사항 목업 데이터
const departmentTabs = ["마케팅팀", "PR팀", "디자인팀", "경영지원팀"] as const;
type DepartmentTab = (typeof departmentTabs)[number];
const departmentNotices: Record<
  DepartmentTab,
  { id: number; title: string; date: string }[]
> = {
  마케팅팀: [
    {
      id: 1,
      title: "소셜미디어 콘텐츠 제작 가이드라인 업데이트",
      date: "2025-05-11",
    },
    { id: 2, title: "5월 마케팅 캠페인 일정 공유", date: "2025-05-09" },
  ],
  PR팀: [{ id: 1, title: "언론 보도자료 배포 일정 안내", date: "2025-05-10" }],
  디자인팀: [
    { id: 1, title: "신규 브랜드 디자인 시안 공유", date: "2025-05-08" },
  ],
  경영지원팀: [{ id: 1, title: "복리후생 제도 변경 안내", date: "2025-05-07" }],
};

export default function CommonBoardPage() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] =
    React.useState<DepartmentTab>("마케팅팀");

  return (
    <div className="flex flex-col gap-8 px-8 py-6 w-full max-w-6xl mx-auto">
      {/* 중요 공지사항 */}
      <section>
        <h2 className="text-lg font-bold mb-4">중요 공지사항</h2>
        <NoticeList notices={importantNotices} />
      </section>

      {/* 회사 소식 */}
      <section>
        <h2 className="text-lg font-bold mb-4">회사 소식</h2>
        <CompanyNews newsList={companyNews} />
      </section>

      {/* 부서별 공지사항 */}
      <section>
        <h2 className="text-lg font-bold mb-4">부서별 공지</h2>
        <DepartmentNoticeList
          tabs={departmentTabs as unknown as string[]}
          notices={departmentNotices}
          selectedTab={selectedTab}
          setSelectedTab={(tab) => setSelectedTab(tab as DepartmentTab)}
        />
      </section>
    </div>
  );
}

/*
// API 연동 버전 (나중에 사용할 코드)
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import BusinessDocumentTabs from "@/features/board/components/bucinessDocuments/BusinessDocumentTabs";
import BusinessDocumentSearch from "@/features/board/components/bucinessDocuments/BusinessDocumentSearch";
import BusinessDocumentTable from "@/features/board/components/bucinessDocuments/BusinessDocumentTable";
import { fetchNotices } from "@/features/post/services/boardService";
import type { Notice } from "@/features/post/types/notice";

export default function NoticesPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ["notices", activeTab, currentPage],
    queryFn: () => fetchNotices(activeTab, currentPage),
  });

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1); // 탭 변경시 첫 페이지로
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // TODO: 검색어에 따른 필터링 로직 구현
  };

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러가 발생했습니다.</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">공지사항</h1>

      <BusinessDocumentTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      <BusinessDocumentSearch
        onSearch={handleSearch}
        searchQuery={searchQuery}
      />

      <BusinessDocumentTable
        documents={data?.notices || []}
      />
    </div>
  );
}
*/
