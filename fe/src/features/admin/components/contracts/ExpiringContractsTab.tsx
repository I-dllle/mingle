"use client";

import Link from "next/link";
import {
  AlertTriangle,
  Calendar,
  FileText,
  Clock,
  Users,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import {
  ContractResponse,
  ContractStatus,
  ContractCategory,
} from "@/features/department/finance-legal/contracts/types/Contract";

interface ExpiringContractsTabProps {
  contracts: ContractResponse[];
  category: ContractCategory;
  loading?: boolean;
}

export default function ExpiringContractsTab({
  contracts,
  category,
  loading,
}: ExpiringContractsTabProps) {
  const getStatusText = (status: ContractStatus) => {
    const statusMap = {
      [ContractStatus.DRAFT]: "초안",
      [ContractStatus.REVIEW]: "검토 중",
      [ContractStatus.SIGNED_OFFLINE]: "오프라인 서명",
      [ContractStatus.SIGNED]: "서명됨",
      [ContractStatus.CONFIRMED]: "확정됨",
      [ContractStatus.ACTIVE]: "활성",
      [ContractStatus.EXPIRED]: "만료됨",
      [ContractStatus.PENDING]: "대기 중",
      [ContractStatus.TERMINATED]: "종료됨",
    };
    return statusMap[status] || status;
  };
  const getStatusColor = (status: ContractStatus) => {
    const colorMap = {
      [ContractStatus.DRAFT]: "bg-slate-100 text-slate-700",
      [ContractStatus.REVIEW]: "bg-amber-100 text-amber-700",
      [ContractStatus.SIGNED_OFFLINE]: "bg-sky-100 text-sky-700",
      [ContractStatus.SIGNED]: "bg-blue-100 text-blue-700",
      [ContractStatus.CONFIRMED]: "bg-emerald-100 text-emerald-700",
      [ContractStatus.ACTIVE]: "bg-green-100 text-green-700",
      [ContractStatus.EXPIRED]: "bg-rose-100 text-rose-700",
      [ContractStatus.PENDING]: "bg-orange-100 text-orange-700",
      [ContractStatus.TERMINATED]: "bg-gray-100 text-gray-700",
    };
    return colorMap[status] || "bg-gray-100 text-gray-700";
  };

  const formatContractId = (id: number) => {
    return `CT-${String(id).padStart(6, "0")}`;
  };

  const getDaysUntilExpiry = (endDate: string) => {
    const today = new Date();
    const expiry = new Date(endDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  const getUrgencyLevel = (daysLeft: number) => {
    if (daysLeft < 0)
      return {
        level: "expired",
        priority: 1,
        label: "만료됨",
        color: "bg-red-50 border-red-200",
        textColor: "text-red-800",
        badgeColor: "bg-red-100 text-red-800",
        actionRequired: "즉시 대응 필요",
      };
    if (daysLeft <= 3)
      return {
        level: "critical",
        priority: 2,
        label: "긴급",
        color: "bg-orange-50 border-orange-200",
        textColor: "text-orange-800",
        badgeColor: "bg-orange-100 text-orange-800",
        actionRequired: "3일 내 갱신 검토",
      };
    if (daysLeft <= 7)
      return {
        level: "urgent",
        priority: 3,
        label: "주의",
        color: "bg-yellow-50 border-yellow-200",
        textColor: "text-yellow-800",
        badgeColor: "bg-yellow-100 text-yellow-800",
        actionRequired: "갱신 절차 준비",
      };
    if (daysLeft <= 30)
      return {
        level: "warning",
        priority: 4,
        label: "예정",
        color: "bg-blue-50 border-blue-200",
        textColor: "text-blue-800",
        badgeColor: "bg-blue-100 text-blue-800",
        actionRequired: "갱신 계획 수립",
      };
    return {
      level: "normal",
      priority: 5,
      label: "안정",
      color: "bg-gray-50 border-gray-200",
      textColor: "text-gray-800",
      badgeColor: "bg-gray-100 text-gray-800",
      actionRequired: "정기 모니터링",
    };
  };
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {" "}
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60">
          <div className="animate-pulse">
            <div className="h-6 bg-slate-200 rounded w-48"></div>
          </div>
        </div>
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">만료 예정 계약을 불러오는 중...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {" "}
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          만료 예정 계약 ({contracts.length}개)
        </h3>
        <p className="text-sm text-slate-600 mt-1">
          계약 만료일이 가까운 계약들을 관리하세요
        </p>
      </div>{" "}
      {contracts.length === 0 ? (
        <div className="px-6 py-12 text-center">
          <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            만료 예정 계약이 없습니다
          </h4>
          <p className="text-gray-500">
            모든 계약이 안전하게 관리되고 있습니다.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {contracts
            .sort((a, b) => {
              const daysA = getDaysUntilExpiry(a.endDate);
              const daysB = getDaysUntilExpiry(b.endDate);
              const urgencyA = getUrgencyLevel(daysA);
              const urgencyB = getUrgencyLevel(daysB);
              return urgencyA.priority - urgencyB.priority;
            })
            .map((contract) => {
              const daysLeft = getDaysUntilExpiry(contract.endDate);
              const urgency = getUrgencyLevel(daysLeft);

              return (
                <div
                  key={contract.id}
                  className={`p-6 hover:bg-gray-50 transition-colors ${urgency.color} border-l-4`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      {/* 헤더 영역 */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <span className="font-mono text-sm font-medium text-gray-700">
                            {formatContractId(contract.id)}
                          </span>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${urgency.badgeColor}`}
                        >
                          {urgency.label}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            contract.status
                          )}`}
                        >
                          {getStatusText(contract.status)}
                        </span>
                      </div>

                      {/* 계약명 */}
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                        {contract.title}
                      </h3>

                      {/* 정보 그리드 */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-400" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {contract.userName}
                            </div>
                            {contract.teamName && (
                              <div className="text-xs text-gray-500">
                                {contract.teamName}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              계약 기간
                            </div>
                            <div className="text-xs text-gray-500">
                              {contract.startDate} ~ {contract.endDate}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              만료까지
                            </div>
                            <div
                              className={`text-xs font-medium ${urgency.textColor}`}
                            >
                              {daysLeft < 0
                                ? "이미 만료됨"
                                : `${daysLeft}일 남음`}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 액션 요구사항 */}
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${urgency.badgeColor}`}
                      >
                        <AlertTriangle className="h-4 w-4" />
                        <span className="font-medium">
                          {urgency.actionRequired}
                        </span>
                      </div>
                    </div>

                    {/* 우측 액션 영역 */}
                    <div className="flex flex-col items-end gap-3 ml-6">
                      {/* D-Day 표시 */}
                      <div className="text-right">
                        {daysLeft < 0 ? (
                          <div className="text-2xl font-bold text-red-600">
                            만료됨
                          </div>
                        ) : (
                          <div
                            className={`text-2xl font-bold ${urgency.textColor}`}
                          >
                            D-{daysLeft}
                          </div>
                        )}
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(contract.endDate).toLocaleDateString(
                            "ko-KR"
                          )}
                        </div>
                      </div>{" "}
                      {/* 액션 버튼 */}
                      <Link
                        href={`/adminContracts/${contract.id}?category=${category}`}
                        className="inline-flex items-center gap-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        상세보기
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
