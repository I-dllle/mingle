import { useState, useEffect } from "react";
import {
  ContractResponse,
  ContractStatus,
} from "@/features/department/finance-legal/contracts/types/Contract";

interface ContractAlert {
  id: string;
  type: "expiring" | "expired" | "review_needed" | "signature_pending";
  contractId: number;
  contractTitle: string;
  message: string;
  priority: "low" | "medium" | "high" | "critical";
  createdAt: Date;
}

export const useContractAlerts = (contracts: ContractResponse[]) => {
  const [alerts, setAlerts] = useState<ContractAlert[]>([]);

  const generateAlerts = (contractList: ContractResponse[]) => {
    const newAlerts: ContractAlert[] = [];
    const today = new Date();

    contractList.forEach((contract) => {
      const endDate = new Date(contract.endDate);
      const daysUntilExpiry = Math.ceil(
        (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );

      // 만료 관련 알림
      if (daysUntilExpiry < 0) {
        newAlerts.push({
          id: `expired_${contract.id}`,
          type: "expired",
          contractId: contract.id,
          contractTitle: contract.title,
          message: `계약이 ${Math.abs(daysUntilExpiry)}일 전에 만료되었습니다.`,
          priority: "critical",
          createdAt: new Date(),
        });
      } else if (daysUntilExpiry <= 7) {
        newAlerts.push({
          id: `expiring_critical_${contract.id}`,
          type: "expiring",
          contractId: contract.id,
          contractTitle: contract.title,
          message: `계약이 ${daysUntilExpiry}일 후 만료됩니다.`,
          priority: "critical",
          createdAt: new Date(),
        });
      } else if (daysUntilExpiry <= 30) {
        newAlerts.push({
          id: `expiring_${contract.id}`,
          type: "expiring",
          contractId: contract.id,
          contractTitle: contract.title,
          message: `계약이 ${daysUntilExpiry}일 후 만료됩니다.`,
          priority: "high",
          createdAt: new Date(),
        });
      }

      // 상태 관련 알림
      if (contract.status === ContractStatus.REVIEW) {
        newAlerts.push({
          id: `review_${contract.id}`,
          type: "review_needed",
          contractId: contract.id,
          contractTitle: contract.title,
          message: "검토가 필요한 계약입니다.",
          priority: "medium",
          createdAt: new Date(),
        });
      }

      if (contract.status === ContractStatus.PENDING) {
        newAlerts.push({
          id: `signature_${contract.id}`,
          type: "signature_pending",
          contractId: contract.id,
          contractTitle: contract.title,
          message: "서명 대기 중인 계약입니다.",
          priority: "medium",
          createdAt: new Date(),
        });
      }
    });

    return newAlerts.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  };

  useEffect(() => {
    const newAlerts = generateAlerts(contracts);
    setAlerts(newAlerts);
  }, [contracts]);

  const dismissAlert = (alertId: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== alertId));
  };

  const getAlertsByPriority = (priority: ContractAlert["priority"]) => {
    return alerts.filter((alert) => alert.priority === priority);
  };

  const getUnreadCount = () => alerts.length;

  return {
    alerts,
    dismissAlert,
    getAlertsByPriority,
    getUnreadCount,
  };
};
