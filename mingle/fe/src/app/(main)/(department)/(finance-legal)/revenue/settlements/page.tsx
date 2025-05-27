"use client";

import { useState, useEffect } from "react";
import { settlementService } from "@/features/department/finance-legal/revenue/services/settlementService";
import {
  SettlementDto,
  SettlementRequest,
} from "@/features/department/finance-legal/revenue/types/Settlement";

export default function SettlementsPage() {
  const [settlements, setSettlements] = useState<SettlementDto[]>([]);
  const [contractId, setContractId] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedSettlement, setSelectedSettlement] =
    useState<SettlementDto | null>(null);

  // 새 정산 생성용 상태
  const [newSettlement, setNewSettlement] = useState({
    contractId: 0,
    totalRevenue: 0,
  });

  // 정산 수정용 상태
  const [updateData, setUpdateData] = useState({
    totalAmount: 0,
    memo: "",
    isSettled: false,
    source: "",
    incomeDate: "",
  });

  // 계약별 정산 목록 조회
  const loadSettlements = async () => {
    if (contractId <= 0) {
      alert("올바른 계약 ID를 입력해주세요.");
      return;
    }

    setLoading(true);
    try {
      const data = await settlementService.getSettlementsByContract(contractId);
      setSettlements(data);
    } catch (error) {
      console.error("정산 목록 조회 실패:", error);
      alert("정산 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 정산 생성
  const handleCreateSettlement = async () => {
    if (newSettlement.contractId <= 0 || newSettlement.totalRevenue <= 0) {
      alert("계약 ID와 총 수익을 올바르게 입력해주세요.");
      return;
    }

    try {
      const request: SettlementRequest = {
        totalRevenue: newSettlement.totalRevenue,
      };

      await settlementService.createSettlementForContract(
        newSettlement.contractId,
        request
      );
      setShowCreateModal(false);
      setNewSettlement({ contractId: 0, totalRevenue: 0 });
      alert("정산이 성공적으로 생성되었습니다.");

      // 현재 조회중인 계약과 같으면 목록 새로고침
      if (contractId === newSettlement.contractId) {
        loadSettlements();
      }
    } catch (error) {
      console.error("정산 생성 실패:", error);
      alert("정산 생성에 실패했습니다.");
    }
  };

  // 정산 수정
  const handleUpdateSettlement = async () => {
    if (!selectedSettlement) return;

    try {
      await settlementService.updateSettlement(
        selectedSettlement.id,
        updateData
      );
      setShowUpdateModal(false);
      setSelectedSettlement(null);
      alert("정산이 성공적으로 수정되었습니다.");
      loadSettlements();
    } catch (error) {
      console.error("정산 수정 실패:", error);
      alert("정산 수정에 실패했습니다.");
    }
  };

  // 정산 삭제
  const handleDeleteSettlement = async (settlementId: number) => {
    if (!confirm("정말로 이 정산을 삭제하시겠습니까?")) return;

    try {
      await settlementService.deleteSettlement(settlementId);
      alert("정산이 성공적으로 삭제되었습니다.");
      loadSettlements();
    } catch (error) {
      console.error("정산 삭제 실패:", error);
      alert("정산 삭제에 실패했습니다.");
    }
  };

  // 정산 상태 변경
  const handleStatusChange = async (
    settlementId: number,
    isSettled: boolean
  ) => {
    try {
      await settlementService.changeSettlementStatus(settlementId, {
        isSettled,
      });
      alert("정산 상태가 성공적으로 변경되었습니다.");
      loadSettlements();
    } catch (error) {
      console.error("상태 변경 실패:", error);
      alert("상태 변경에 실패했습니다.");
    }
  };

  // 수정 모달 열기
  const openUpdateModal = (settlement: SettlementDto) => {
    setSelectedSettlement(settlement);
    setUpdateData({
      totalAmount: settlement.amount,
      memo: settlement.memo,
      isSettled: settlement.isSettled,
      source: "",
      incomeDate: settlement.date,
    });
    setShowUpdateModal(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR");
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">정산 관리</h1>
        <p className="text-gray-600">정산 생성, 수정, 삭제 및 상태 관리</p>
      </div>

      {/* 검색 및 생성 */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="flex justify-between items-end">
          <div className="flex items-center gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                계약 ID
              </label>
              <input
                type="number"
                value={contractId || ""}
                onChange={(e) => setContractId(Number(e.target.value))}
                placeholder="계약 ID 입력"
                className="border border-gray-300 rounded-md px-3 py-2 w-40"
              />
            </div>
            <button
              onClick={loadSettlements}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "로딩중..." : "조회"}
            </button>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            새 정산 생성
          </button>
        </div>
      </div>

      {/* 정산 목록 */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-700">정산 목록</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  금액
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  날짜
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  메모
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {settlements.length > 0 ? (
                settlements.map((settlement) => (
                  <tr key={settlement.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {settlement.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {formatCurrency(settlement.amount)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          settlement.isSettled
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {settlement.isSettled ? "완료" : "대기"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {formatDate(settlement.date)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {settlement.memo || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openUpdateModal(settlement)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDeleteSettlement(settlement.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          삭제
                        </button>
                        <button
                          onClick={() =>
                            handleStatusChange(
                              settlement.id,
                              !settlement.isSettled
                            )
                          }
                          className="text-purple-600 hover:text-purple-800"
                        >
                          {settlement.isSettled ? "대기로" : "완료로"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    정산 데이터가 없습니다. 계약 ID를 입력하고 조회해주세요.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 정산 생성 모달 */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">새 정산 생성</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  계약 ID
                </label>
                <input
                  type="number"
                  value={newSettlement.contractId || ""}
                  onChange={(e) =>
                    setNewSettlement({
                      ...newSettlement,
                      contractId: Number(e.target.value),
                    })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  총 수익
                </label>
                <input
                  type="number"
                  value={newSettlement.totalRevenue || ""}
                  onChange={(e) =>
                    setNewSettlement({
                      ...newSettlement,
                      totalRevenue: Number(e.target.value),
                    })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleCreateSettlement}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                생성
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 정산 수정 모달 */}
      {showUpdateModal && selectedSettlement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">
              정산 수정 (ID: {selectedSettlement.id})
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  총 금액
                </label>
                <input
                  type="number"
                  value={updateData.totalAmount || ""}
                  onChange={(e) =>
                    setUpdateData({
                      ...updateData,
                      totalAmount: Number(e.target.value),
                    })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  메모
                </label>
                <textarea
                  value={updateData.memo}
                  onChange={(e) =>
                    setUpdateData({ ...updateData, memo: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  소스
                </label>
                <input
                  type="text"
                  value={updateData.source}
                  onChange={(e) =>
                    setUpdateData({ ...updateData, source: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  수익 날짜
                </label>
                <input
                  type="date"
                  value={updateData.incomeDate}
                  onChange={(e) =>
                    setUpdateData({ ...updateData, incomeDate: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isSettled"
                  checked={updateData.isSettled}
                  onChange={(e) =>
                    setUpdateData({
                      ...updateData,
                      isSettled: e.target.checked,
                    })
                  }
                  className="mr-2"
                />
                <label
                  htmlFor="isSettled"
                  className="text-sm font-medium text-gray-700"
                >
                  정산 완료
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowUpdateModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleUpdateSettlement}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                수정
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 네비게이션 */}
      <div className="mt-8 flex justify-center gap-4">
        <a
          href="/revenue/dashboard"
          className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
        >
          대시보드로
        </a>
        <a
          href="/revenue/analytics"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          수익 분석
        </a>
        <a
          href="/revenue/contracts"
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
        >
          계약별 조회
        </a>
      </div>
    </div>
  );
}
