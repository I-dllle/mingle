"use client";

import { useState } from "react";
import {
  Bell,
  X,
  AlertTriangle,
  Clock,
  FileText,
  Download,
} from "lucide-react";
import { useContractAlerts } from "@/features/admin/hooks/useContractAlerts";
import { ContractResponse } from "@/features/department/finance-legal/contracts/types/Contract";

interface ContractAlertsProps {
  contracts: ContractResponse[];
  onContractClick: (contractId: number) => void;
}

export default function ContractAlerts({
  contracts,
  onContractClick,
}: ContractAlertsProps) {
  const { alerts, dismissAlert, getUnreadCount } = useContractAlerts(contracts);
  const [isOpen, setIsOpen] = useState(false);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "expired":
      case "expiring":
        return Clock;
      case "review_needed":
        return FileText;
      case "signature_pending":
        return Download;
      default:
        return AlertTriangle;
    }
  };

  const getAlertColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "border-red-200 bg-red-50 text-red-800";
      case "high":
        return "border-orange-200 bg-orange-50 text-orange-800";
      case "medium":
        return "border-yellow-200 bg-yellow-50 text-yellow-800";
      case "low":
        return "border-blue-200 bg-blue-50 text-blue-800";
      default:
        return "border-gray-200 bg-gray-50 text-gray-800";
    }
  };

  const unreadCount = getUnreadCount();

  return (
    <div className="relative">
      {/* 알림 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* 알림 패널 */}
      {isOpen && (
        <>
          {/* 배경 오버레이 */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* 알림 드롭다운 */}
          <div className="absolute right-0 top-full mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">알림</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              {unreadCount > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  {unreadCount}개의 새 알림이 있습니다
                </p>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto">
              {alerts.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>새로운 알림이 없습니다</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {alerts.map((alert) => {
                    const Icon = getAlertIcon(alert.type);
                    return (
                      <div
                        key={alert.id}
                        className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors border-l-4 ${getAlertColor(
                          alert.priority
                        )}`}
                        onClick={() => {
                          onContractClick(alert.contractId);
                          setIsOpen(false);
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {alert.contractTitle}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {alert.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                              {alert.createdAt.toLocaleString("ko-KR")}
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              dismissAlert(alert.id);
                            }}
                            className="p-1 hover:bg-gray-200 rounded text-gray-400 hover:text-gray-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {alerts.length > 0 && (
              <div className="p-3 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => {
                    alerts.forEach((alert) => dismissAlert(alert.id));
                  }}
                  className="w-full text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  모든 알림 지우기
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
