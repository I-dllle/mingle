"use client";

import Link from "next/link";
import { AlertTriangle, Calendar, FileText } from "lucide-react";
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
      [ContractStatus.CONFIRMED]: "확인됨",
      [ContractStatus.ACTIVE]: "활성",
      [ContractStatus.EXPIRED]: "만료됨",
      [ContractStatus.PENDING]: "대기 중",
      [ContractStatus.TERMINATED]: "종료됨",
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: ContractStatus) => {
    const colorMap = {
      [ContractStatus.DRAFT]: "bg-gray-100 text-gray-800",
      [ContractStatus.REVIEW]: "bg-yellow-100 text-yellow-800",
      [ContractStatus.SIGNED_OFFLINE]: "bg-blue-100 text-blue-800",
      [ContractStatus.SIGNED]: "bg-blue-100 text-blue-800",
      [ContractStatus.CONFIRMED]: "bg-green-100 text-green-800",
      [ContractStatus.ACTIVE]: "bg-green-100 text-green-800",
      [ContractStatus.EXPIRED]: "bg-red-100 text-red-800",
      [ContractStatus.PENDING]: "bg-orange-100 text-orange-800",
      [ContractStatus.TERMINATED]: "bg-gray-100 text-gray-800",
    };
    return colorMap[status] || "bg-gray-100 text-gray-800";
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
        color: "bg-red-100 border-red-200 text-red-800",
      };
    if (daysLeft <= 7)
      return {
        level: "critical",
        color: "bg-red-50 border-red-200 text-red-700",
      };
    if (daysLeft <= 30)
      return {
        level: "warning",
        color: "bg-yellow-50 border-yellow-200 text-yellow-700",
      };
    return {
      level: "normal",
      color: "bg-blue-50 border-blue-200 text-blue-700",
    };
  };
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-red-100 bg-red-50/60">
          <div className="animate-pulse">
            <div className="h-6 bg-red-200 rounded w-48"></div>
          </div>
        </div>
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">만료 예정 계약을 불러오는 중...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-red-100 bg-red-50/60">
        <h3 className="text-lg font-semibold text-red-800 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          만료 예정 계약 ({contracts.length}개)
        </h3>
        <p className="text-sm text-red-600 mt-1">
          계약 만료일이 가까운 계약들을 관리하세요
        </p>
      </div>

      {contracts.length === 0 ? (
        <div className="px-6 py-8 text-center">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">만료 예정인 계약이 없습니다.</p>
          <p className="text-sm text-gray-500 mt-1">
            모든 계약이 적절히 관리되고 있습니다.
          </p>
        </div>
      ) : (
        <div className="p-6">
          <div className="grid gap-4">
            {contracts.map((contract) => {
              const daysLeft = getDaysUntilExpiry(contract.endDate);
              const urgency = getUrgencyLevel(daysLeft);
              return (
                <Link
                  key={contract.id}
                  href={`/panel/contracts/${contract.id}?category=${category}`}
                  className={`block rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${urgency.color}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-4 w-4" />
                        <span className="font-mono text-sm font-medium">
                          {formatContractId(contract.id)}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            contract.status
                          )}`}
                        >
                          {getStatusText(contract.status)}
                        </span>
                      </div>

                      <h4 className="font-semibold text-lg mb-2 line-clamp-2">
                        {contract.title}
                      </h4>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">사용자:</span>
                          <span className="ml-1 font-medium">
                            {contract.userName}
                          </span>
                          {contract.teamName && (
                            <div className="text-xs text-gray-500 mt-1">
                              팀: {contract.teamName}
                            </div>
                          )}
                        </div>
                        <div>
                          <span className="text-gray-600">기간:</span>
                          <div className="text-sm">
                            {contract.startDate} ~ {contract.endDate}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-right ml-4">
                      <div className="text-2xl font-bold">
                        {daysLeft < 0 ? (
                          <span className="text-red-600">만료됨</span>
                        ) : (
                          <span
                            className={
                              daysLeft <= 7
                                ? "text-red-600"
                                : daysLeft <= 30
                                ? "text-yellow-600"
                                : "text-blue-600"
                            }
                          >
                            D-{daysLeft}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        {daysLeft < 0 ? "만료된 계약" : "일 남음"}
                      </div>
                    </div>
                  </div>
                  {daysLeft <= 7 && daysLeft >= 0 && (
                    <div className="mt-3 p-2 bg-red-100 border border-red-200 rounded text-sm text-red-700">
                      <AlertTriangle className="h-4 w-4 inline mr-1" />
                      긴급: 곧 만료되는 계약입니다. 갱신 또는 후속 조치가
                      필요합니다.
                    </div>
                  )}{" "}
                  {daysLeft < 0 && (
                    <div className="mt-3 p-2 bg-red-200 border border-red-300 rounded text-sm text-red-800">
                      <AlertTriangle className="h-4 w-4 inline mr-1" />
                      이미 만료된 계약입니다. 즉시 검토가 필요합니다.
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
