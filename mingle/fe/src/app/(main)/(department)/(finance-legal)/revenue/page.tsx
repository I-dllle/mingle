"use client";

import Link from "next/link";

export default function RevenuePage() {
  const menuItems = [
    {
      title: "대시보드",
      description: "전체 수익 현황 및 통계 요약을 확인하세요",
      href: "/revenue/dashboard",
      icon: "📊",
      features: [
        "정산 통계 요약",
        "전체/기간별 총 수익",
        "회사 순수익",
        "월별 수익 요약",
      ],
    },
    {
      title: "분석 리포트",
      description: "상세한 수익 분석 및 리포트를 확인하세요",
      href: "/revenue/analytics",
      icon: "📈",
      features: [
        "상위 아티스트 순위",
        "비율별 수익 분배",
        "사용자별 수익 조회",
      ],
    },
    {
      title: "정산 관리",
      description: "정산 생성, 수정, 삭제 및 상태 관리",
      href: "/revenue/settlements",
      icon: "💰",
      features: ["정산 생성/수정/삭제", "정산 상태 변경", "정산 승인 프로세스"],
    },
    {
      title: "계약별 조회",
      description: "계약 기준으로 정산 내역을 조회하세요",
      href: "/revenue/contracts",
      icon: "📋",
      features: ["계약별 정산 목록", "계약별 정산 상세", "계약별 수익 현황"],
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Revenue Management
        </h1>
        <p className="text-lg text-gray-600">
          수익 및 정산 관리 시스템에 오신 것을 환영합니다. 아래 메뉴에서 원하는
          기능을 선택하세요.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="block p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-start space-x-4">
              <div className="text-3xl">{item.icon}</div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <ul className="space-y-1">
                  {item.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="text-sm text-gray-500 flex items-center"
                    >
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          시스템 개요
        </h3>
        <p className="text-blue-700 text-sm">
          이 시스템은 아티스트와 회사 간의 수익 분배 및 정산을 관리하는 통합
          플랫폼입니다. 각 계약에 따른 정산 비율을 관리하고, 실시간으로 수익
          현황을 모니터링할 수 있습니다.
        </p>
      </div>
    </div>
  );
}
