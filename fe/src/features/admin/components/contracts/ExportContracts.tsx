"use client";

import { useState } from "react";
import { Download, FileText, Settings, X } from "lucide-react";
import { useContractExport } from "@/features/admin/hooks/useContractExport";

interface ExportContractsProps {
  contracts: any[];
  onClose: () => void;
}

export default function ExportContracts({
  contracts,
  onClose,
}: ExportContractsProps) {
  const { exportContracts, isExporting, exportProgress } = useContractExport();
  const [exportOptions, setExportOptions] = useState({
    format: "excel" as "excel" | "csv" | "pdf",
    includeDetails: true,
    dateRange: {
      start: "",
      end: "",
    },
  });

  const handleExport = async () => {
    const result = await exportContracts(contracts, exportOptions);
    if (result.success) {
      // 성공 메시지 표시
      alert(`${result.filename} 파일이 다운로드되었습니다.`);
      onClose();
    } else {
      // 에러 메시지 표시
      alert(`내보내기 실패: ${result.error}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Download className="h-5 w-5" />
            계약 내보내기
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
            disabled={isExporting}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* 파일 형식 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              파일 형식
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "excel", label: "Excel", icon: "📊" },
                { value: "csv", label: "CSV", icon: "📄" },
                { value: "pdf", label: "PDF", icon: "📑" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() =>
                    setExportOptions((prev) => ({
                      ...prev,
                      format: option.value as any,
                    }))
                  }
                  className={`p-3 text-sm border rounded-lg transition-colors ${
                    exportOptions.format === option.value
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  disabled={isExporting}
                >
                  <div className="text-center">
                    <div className="text-lg mb-1">{option.icon}</div>
                    <div className="font-medium">{option.label}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 내보내기 옵션 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              내보내기 옵션
            </label>
            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={exportOptions.includeDetails}
                  onChange={(e) =>
                    setExportOptions((prev) => ({
                      ...prev,
                      includeDetails: e.target.checked,
                    }))
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  disabled={isExporting}
                />
                <span className="text-sm text-gray-700">상세 정보 포함</span>
              </label>
            </div>
          </div>

          {/* 날짜 범위 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              날짜 범위 (선택사항)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  시작일
                </label>
                <input
                  type="date"
                  value={exportOptions.dateRange.start}
                  onChange={(e) =>
                    setExportOptions((prev) => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, start: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                  disabled={isExporting}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  종료일
                </label>
                <input
                  type="date"
                  value={exportOptions.dateRange.end}
                  onChange={(e) =>
                    setExportOptions((prev) => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, end: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                  disabled={isExporting}
                />
              </div>
            </div>
          </div>

          {/* 내보내기 진행률 */}
          {isExporting && (
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>내보내는 중...</span>
                <span>{exportProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${exportProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* 요약 정보 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              내보내기 요약
            </h4>
            <div className="text-sm text-gray-600 space-y-1">
              <div>• 총 {contracts.length}개 계약</div>
              <div>• {exportOptions.format.toUpperCase()} 형식</div>
              <div>
                •{" "}
                {exportOptions.includeDetails
                  ? "상세 정보 포함"
                  : "기본 정보만"}
              </div>
              {exportOptions.dateRange.start && exportOptions.dateRange.end && (
                <div>
                  • {exportOptions.dateRange.start} ~{" "}
                  {exportOptions.dateRange.end}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t bg-gray-50 rounded-b-lg">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={isExporting}
          >
            취소
          </button>
          <button
            onClick={handleExport}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            disabled={isExporting || contracts.length === 0}
          >
            <Download className="h-4 w-4" />
            {isExporting ? "내보내는 중..." : "내보내기"}
          </button>
        </div>
      </div>
    </div>
  );
}
