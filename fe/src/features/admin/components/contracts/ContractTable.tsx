"use client";

import Link from "next/link";
import { Eye, Edit, Download, FileText, Users, Calendar } from "lucide-react";
import {
  ContractResponse,
  ContractSimpleDto,
  ContractStatus,
  ContractCategory,
} from "@/features/department/finance-legal/contracts/types/Contract";

interface ContractTableProps {
  contracts: ContractResponse[];
  allContracts: ContractSimpleDto[];
  category: ContractCategory;
  onSort: (field: string) => void;
  sortField: string;
  sortDirection: "asc" | "desc";
  loading?: boolean;
}

export default function ContractTable({
  contracts,
  allContracts,
  category,
  onSort,
  sortField,
  sortDirection,
  loading,
}: ContractTableProps) {
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

  const displayContracts = contracts.length > 0 ? contracts : allContracts;
  if (loading) {
    return (
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/60">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-48"></div>
          </div>
        </div>
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">계약 목록을 불러오는 중...</p>
        </div>
      </div>
    );
  }
  if (displayContracts.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/60">
          <h3 className="text-lg font-semibold">계약 목록</h3>
        </div>
        <div className="p-8 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">조건에 맞는 계약이 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-gray-50/60 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5" />
            계약 목록
            <span className="text-sm text-gray-600 ml-2">
              (총 {displayContracts.length}개)
            </span>
          </h3>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50/40">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100/50"
                onClick={() => onSort("id")}
              >
                <div className="flex items-center gap-1">
                  계약 ID
                  {sortField === "id" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                제목
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  사용자/팀
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => onSort("startDate")}
              >
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  시작일
                  {sortField === "startDate" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => onSort("endDate")}
              >
                <div className="flex items-center gap-1">
                  종료일
                  {sortField === "endDate" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                액션
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {contracts.length > 0
              ? contracts.map((contract) => (
                  <tr
                    key={contract.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatContractId(contract.id)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="max-w-xs truncate font-medium">
                        {contract.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div className="font-medium">{contract.userName}</div>
                        {contract.teamName && (
                          <div className="text-xs text-gray-500">
                            팀: {contract.teamName}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          contract.status
                        )}`}
                      >
                        {getStatusText(contract.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {contract.startDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {contract.endDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/panel/contracts/${contract.id}?category=${category}`}
                          className="flex items-center gap-1 px-3 py-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                          상세보기
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              : allContracts.map((contract) => (
                  <tr
                    key={contract.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatContractId(contract.id)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="max-w-xs truncate font-medium">
                        {contract.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="text-gray-500">-</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {contract.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {contract.startDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {contract.endDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/panel/contracts/${contract.id}?category=${category}`}
                          className="flex items-center gap-1 px-3 py-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                          상세보기
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
