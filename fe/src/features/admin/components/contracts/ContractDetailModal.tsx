"use client";

import { X, FileText, Calendar, User, Building, Hash } from "lucide-react";
import {
  ContractDetailDto,
  ContractStatus,
} from "@/features/department/finance-legal/contracts/types/Contract";

interface ContractDetailModalProps {
  contract: ContractDetailDto;
  onClose: () => void;
}

export default function ContractDetailModal({
  contract,
  onClose,
}: ContractDetailModalProps) {
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="h-6 w-6" />
              계약 상세 정보
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              계약 ID: {formatContractId(contract.id)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* 기본 정보 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Hash className="h-5 w-5" />
                기본 정보
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    계약 ID
                  </label>
                  <p className="text-lg font-mono">
                    {formatContractId(contract.id)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    상태
                  </label>
                  <div className="mt-1">
                    <span
                      className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                        contract.status
                      )}`}
                    >
                      {getStatusText(contract.status)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                일정 정보
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    시작일
                  </label>
                  <p className="text-lg">{contract.startDate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    종료일
                  </label>
                  <p className="text-lg">{contract.endDate}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 계약 내용 */}
          <div className="bg-white border rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              계약 요약
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-800 leading-relaxed">
                {contract.summary || "요약 정보가 제공되지 않았습니다."}
              </p>
            </div>
          </div>

          {/* 서명자 정보 */}
          {contract.signerName && (
            <div className="bg-white border rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="h-5 w-5" />
                서명자 정보
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    서명자 이름
                  </label>
                  <p className="text-lg font-medium">{contract.signerName}</p>
                </div>
                {contract.signerMemo && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      서명 메모
                    </label>
                    <div className="mt-2 bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-800">{contract.signerMemo}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 액션 버튼 */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              닫기
            </button>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              편집
            </button>
            <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              다운로드
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
