"use client";

import React from "react";

interface ManagementTabProps {
  selectedUserId: string;
  onSelectedUserIdChange: (userId: string) => void;
  selectedContractId: string;
  onSelectedContractIdChange: (contractId: string) => void;
}

export default function ManagementTab({
  selectedUserId,
  onSelectedUserIdChange,
  selectedContractId,
  onSelectedContractIdChange,
}: ManagementTabProps) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">
            계약별 수익 조회
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                계약 ID
              </label>
              <input
                type="text"
                value={selectedContractId}
                onChange={(e) => onSelectedContractIdChange(e.target.value)}
                placeholder="계약 ID를 입력하세요"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-violet-500 focus:border-violet-500"
              />
            </div>
            <button className="w-full bg-violet-600 text-white py-2 px-4 rounded-lg hover:bg-violet-700 transition-colors">
              조회
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">
            사용자별 수익 조회
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                사용자 ID
              </label>
              <input
                type="text"
                value={selectedUserId}
                onChange={(e) => onSelectedUserIdChange(e.target.value)}
                placeholder="사용자 ID를 입력하세요"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-violet-500 focus:border-violet-500"
              />
            </div>
            <button className="w-full bg-violet-600 text-white py-2 px-4 rounded-lg hover:bg-violet-700 transition-colors">
              조회
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">
          시스템 관리
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 text-left border border-slate-200 rounded-lg hover:border-violet-300 hover:bg-violet-50 transition-colors">
            <div className="text-2xl mb-2">⚙️</div>
            <h4 className="font-medium text-slate-900 mb-1">설정 관리</h4>
            <p className="text-sm text-slate-600">시스템 설정을 관리합니다</p>
          </button>

          <button className="p-4 text-left border border-slate-200 rounded-lg hover:border-violet-300 hover:bg-violet-50 transition-colors">
            <div className="text-2xl mb-2">📊</div>
            <h4 className="font-medium text-slate-900 mb-1">보고서 생성</h4>
            <p className="text-sm text-slate-600">수익 보고서를 생성합니다</p>
          </button>

          <button className="p-4 text-left border border-slate-200 rounded-lg hover:border-violet-300 hover:bg-violet-50 transition-colors">
            <div className="text-2xl mb-2">🔄</div>
            <h4 className="font-medium text-slate-900 mb-1">배치 작업</h4>
            <p className="text-sm text-slate-600">
              정산 배치 작업을 관리합니다
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
