"use client";

import { Search, X } from "lucide-react";
import { useState, useEffect } from "react";
import {
  ContractSearchCondition,
  ContractStatus,
  ContractType,
  ContractCategory,
  UserSearchDto,
} from "@/features/department/finance-legal/contracts/types/Contract";

interface ContractSearchFiltersProps {
  condition: ContractSearchCondition;
  onConditionChange: (condition: ContractSearchCondition) => void;
  onSearch: () => void;
  onReset: () => void;
  loading?: boolean;
  onParticipantSearch: (name: string) => Promise<UserSearchDto[]>;
}

export default function ContractSearchFilters({
  condition,
  onConditionChange,
  onSearch,
  onReset,
  loading,
  onParticipantSearch,
}: ContractSearchFiltersProps) {
  const [participantName, setParticipantName] = useState("");
  const [participantResults, setParticipantResults] = useState<UserSearchDto[]>(
    []
  );
  const [selectedParticipant, setSelectedParticipant] =
    useState<UserSearchDto | null>(null);
  const [searchTimer, setSearchTimer] = useState<NodeJS.Timeout | null>(null);

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

  const handleParticipantSearch = async () => {
    if (participantName.trim().length >= 2) {
      try {
        const results = await onParticipantSearch(participantName.trim());
        setParticipantResults(results);
      } catch (error) {
        console.error("참여자 검색 실패:", error);
        setParticipantResults([]);
      }
    }
  };

  const handleSelectParticipant = (user: UserSearchDto) => {
    setSelectedParticipant(user);
    setParticipantName(user.nickname);
    setParticipantResults([]);
    onConditionChange({
      ...condition,
      participantUserId: user.id,
    });
  };

  const handleClearParticipant = () => {
    setSelectedParticipant(null);
    setParticipantName("");
    setParticipantResults([]);
    onConditionChange({
      ...condition,
      participantUserId: undefined,
    });
  };
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Search className="h-5 w-5" />
          검색 조건
        </h2>
        <button
          onClick={onReset}
          disabled={loading}
          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50"
        >
          <X className="h-4 w-4 inline mr-1" />
          전체 초기화
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 팀 ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            팀 ID
          </label>
          <input
            type="number"
            value={condition.teamId || ""}
            onChange={(e) =>
              onConditionChange({
                ...condition,
                teamId: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="팀 ID 입력"
          />
        </div>

        {/* 참여자 검색 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            참여자 검색
          </label>
          <div className="relative">
            <input
              type="text"
              value={participantName}
              onChange={(e) => {
                const value = e.target.value;
                setParticipantName(value);

                if (searchTimer) {
                  clearTimeout(searchTimer);
                }

                if (value.trim().length >= 2) {
                  const timer = setTimeout(() => {
                    handleParticipantSearch();
                  }, 300);
                  setSearchTimer(timer);
                } else if (value.trim().length === 0) {
                  setParticipantResults([]);
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="참여자 이름 입력 (2글자 이상)"
              disabled={!!selectedParticipant}
            />

            {participantResults.length > 0 && !selectedParticipant && (
              <div className="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-md border border-gray-200 max-h-48 overflow-y-auto">
                {participantResults.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => handleSelectParticipant(user)}
                    className="px-3 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <div className="font-medium">{user.nickname}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </div>
                ))}
              </div>
            )}

            {selectedParticipant && (
              <button
                type="button"
                onClick={handleClearParticipant}
                className="absolute right-2 top-2 p-1 text-red-500 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* 계약 상태 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">전체</option>
            {Object.values(ContractStatus).map((status) => (
              <option key={status} value={status}>
                {getStatusText(status)}
              </option>
            ))}
          </select>
        </div>

        {/* 계약 타입 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">전체</option>
            <option value={ContractType.PAPER}>종이 계약</option>
            <option value={ContractType.ELECTRONIC}>전자 계약</option>
          </select>
        </div>

        {/* 계약 카테고리 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">전체</option>
            <option value={ContractCategory.INTERNAL}>내부 계약</option>
            <option value={ContractCategory.EXTERNAL}>외부 계약</option>
          </select>
        </div>

        {/* 시작일 범위 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 참여자 사용자 ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            참여자 ID
          </label>
          <input
            type="number"
            value={condition.participantUserId || ""}
            onChange={(e) =>
              onConditionChange({
                ...condition,
                participantUserId: e.target.value
                  ? Number(e.target.value)
                  : undefined,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="참여자 사용자 ID 입력"
          />
        </div>
      </div>

      {/* 검색 버튼 */}
      <div className="flex gap-2 mt-6">
        <button
          onClick={onSearch}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
        >
          <Search className="h-4 w-4" />
          {loading ? "검색 중..." : "검색"}
        </button>
        <button
          onClick={onReset}
          disabled={loading}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
        >
          초기화
        </button>
      </div>
    </div>
  );
}
