"use client";

import React from "react";
import NoticeList from "@/features/post/components/notices/NoticeList";
import CompanyNews from "@/features/post/components/notices/CompanyNews";
import DepartmentNoticeList from "@/features/post/components/notices/DepartmentNoticeList";
import { useRouter } from "next/navigation";
import { getMainDepartmentNames } from "@/utils/departmentUtils";

// 실제 부서 데이터 사용
const departmentTabs = getMainDepartmentNames();
type DepartmentTab = string;

export default function CommonBoardPage() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = React.useState<DepartmentTab>(
    departmentTabs[0]
  ); // 첫 번째 부서를 기본값으로

  return (    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">공지사항</h1>
      </div>
      {/* 중요 공지사항 */}
      <div>
        <h2 className="text-lg font-semibold mb-3">중요 공지사항</h2>
        <NoticeList useApi={true} />
      </div>
      {/* 회사 소식 */}
      <div>
        <h2 className="text-lg font-semibold mb-3">회사 소식</h2>
        <CompanyNews useApi={true} />
      </div>{" "}
      {/* 부서별 공지사항 */}
      <div>
        <h2 className="text-lg font-semibold mb-3">부서별 공지사항</h2>
        <DepartmentNoticeList
          tabs={departmentTabs as unknown as string[]}
          selectedTab={selectedTab}
          setSelectedTab={(tab: string) => setSelectedTab(tab as DepartmentTab)}
          useApi={true}
        />
      </div>
    </div>
  );
}
