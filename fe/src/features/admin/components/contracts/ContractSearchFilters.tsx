"use client";

import {
  Search,
  Filter,
  Calendar,
  FileText,
  Tag,
  Building2,
  RotateCcw,
} from "lucide-react";
import {
  ContractSearchCondition,
  ContractStatus,
  ContractType,
  ContractCategory,
} from "@/features/department/finance-legal/contracts/types/Contract";

interface ContractSearchFiltersProps {
  condition: ContractSearchCondition;
  onConditionChange: (condition: ContractSearchCondition) => void;
  onSearch: () => void;
  onReset: () => void;
  loading?: boolean;
}

export default function ContractSearchFilters({
  condition,
  onConditionChange,
  onSearch,
  onReset,
  loading,
}: ContractSearchFiltersProps) {
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

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
      {/* 헤더 */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Filter className="h-5 w-5 text-blue-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">검색 필터</h2>
      </div>

      {/* 필터 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 계약 상태 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Tag className="h-4 w-4 text-gray-500" />
            계약 상태
          </label>
          <select
            value={condition.status || ""}
            onChange={(e) =>
              onConditionChange({
                ...condition,
                status: e.target.value
                  ? (e.target.value as ContractStatus)
                  : undefined,
              })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="">전체 상태</option>
            {Object.values(ContractStatus).map((status) => (
              <option key={status} value={status}>
                {getStatusText(status)}
              </option>
            ))}
          </select>
        </div>

        {/* 계약 타입 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <FileText className="h-4 w-4 text-gray-500" />
            계약 타입
          </label>
          <select
            value={condition.contractType || ""}
            onChange={(e) =>
              onConditionChange({
                ...condition,
                contractType: e.target.value
                  ? (e.target.value as ContractType)
                  : undefined,
              })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="">전체 타입</option>
            <option value={ContractType.PAPER}>종이 계약</option>
            <option value={ContractType.ELECTRONIC}>전자 계약</option>
          </select>
        </div>

        {/* 계약 카테고리 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Building2 className="h-4 w-4 text-gray-500" />
            계약 카테고리
          </label>
          <select
            value={condition.contractCategory || ""}
            onChange={(e) =>
              onConditionChange({
                ...condition,
                contractCategory: e.target.value
                  ? (e.target.value as ContractCategory)
                  : undefined,
              })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="">전체 카테고리</option>
            <option value={ContractCategory.INTERNAL}>내부 계약</option>
            <option value={ContractCategory.EXTERNAL}>외부 계약</option>
          </select>
        </div>

        {/* 시작일 범위 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            시작일 (부터)
          </label>
          <input
            type="date"
            value={condition.startDateFrom || ""}
            onChange={(e) =>
              onConditionChange({
                ...condition,
                startDateFrom: e.target.value || undefined,
              })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            시작일 (까지)
          </label>
          <input
            type="date"
            value={condition.startDateTo || ""}
            onChange={(e) =>
              onConditionChange({
                ...condition,
                startDateTo: e.target.value || undefined,
              })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* 검색 버튼 */}
      <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={onSearch}
          disabled={loading}
          className="flex-1 sm:flex-none px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 font-medium"
        >
          <Search className="h-4 w-4" />
          {loading ? "검색 중..." : "검색"}
        </button>
        <button
          onClick={onReset}
          disabled={loading}
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 font-medium"
        >
          <RotateCcw className="h-4 w-4" />
          초기화
        </button>
      </div>
    </div>
  );
}
