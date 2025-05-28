"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ContractCategory,
  ContractStatus,
} from "@/features/department/finance-legal/contracts/types/Contract";

// 필요한 타입들 정의 - 실제 구현 시에는 적절한 타입 파일에서 import해야 함
interface Contract {
  id: number;
  userId: number;
  title: string;
  summary: string;
  status: ContractStatus;
  startDate: string;
  endDate: string;
  fileUrl: string;
  signerName: string;
  signerMemo: string;
  createdAt: string;
  updatedAt: string;
}

interface ChangeStatusRequest {
  nextStatus: ContractStatus;
}

interface OfflineSignRequest {
  signerName: string;
  memo: string;
}

// 서비스 객체의 목업 - 실제 구현 필요
const contractService = {
  // 계약 상세 정보 조회
  getContractDetail: async (
    id: number,
    category: ContractCategory
  ): Promise<Contract> => {
    // API 호출 로직 필요
    return {
      id: 0,
      userId: 0,
      title: "",
      summary: "",
      status: ContractStatus.DRAFT,
      startDate: "",
      endDate: "",
      fileUrl: "",
      signerName: "",
      signerMemo: "",
      createdAt: "",
      updatedAt: "",
    };
  },

  // 계약 상태 변경
  changeContractStatus: async (
    id: number,
    request: ChangeStatusRequest,
    category: ContractCategory
  ): Promise<void> => {
    // API 호출 로직 필요
  },

  // 계약 확정
  confirmContract: async (
    id: number,
    category: ContractCategory
  ): Promise<void> => {
    // API 호출 로직 필요
  },

  // 계약 삭제
  deleteContract: async (
    id: number,
    category: ContractCategory
  ): Promise<void> => {
    // API 호출 로직 필요
  },

  // 오프라인 서명
  signOfflineAsAdmin: async (
    id: number,
    request: OfflineSignRequest
  ): Promise<void> => {
    // API 호출 로직 필요
  },

  // 전자 서명 요청
  signOnBehalf: async (id: number, userId: number): Promise<string> => {
    // API 호출 로직 필요
    return "";
  },
};

export default function ContractDetailPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const categoryParam =
    (searchParams.get("category") as ContractCategory) ||
    ContractCategory.EXTERNAL;

  const contractId = Number(params.id);
  const [category, setCategory] = useState<ContractCategory>(categoryParam);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);

  // 오프라인 서명 폼 상태
  const [showOfflineSignForm, setShowOfflineSignForm] = useState(false);
  const [offlineSignData, setOfflineSignData] = useState({
    signerName: "",
    memo: "",
  });

  // 전자 서명 요청 폼 상태
  const [showElectronicSignForm, setShowElectronicSignForm] = useState(false);
  const [electronicSignData, setElectronicSignData] = useState({
    userId: 1,
  });

  // 계약 상세 정보 조회
  const fetchContractDetail = async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      const data = await contractService.getContractDetail(id, category);
      setContract(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "계약서 정보를 불러오는데 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  // 계약서 상태 변경
  const handleStatusChange = async (id: number, nextStatus: ContractStatus) => {
    try {
      const request: ChangeStatusRequest = { nextStatus };
      await contractService.changeContractStatus(id, request, category);
      await fetchContractDetail(id);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "상태 변경에 실패했습니다."
      );
    }
  };
  // 계약서 확정
  const handleConfirm = async (id: number) => {
    try {
      await contractService.confirmContract(id, category);

      // 상태를 확정됨에서 활성화됨으로 변경
      await handleStatusChange(id, ContractStatus.CONFIRMED);

      // 잠시 후 ACTIVE로 변경 (실제 구현에서는 백엔드에서 이 부분을 처리할 수도 있음)
      setTimeout(async () => {
        await handleStatusChange(id, ContractStatus.ACTIVE);
      }, 1000);

      await fetchContractDetail(id);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "계약서 확정에 실패했습니다."
      );
    }
  };

  // 계약서 삭제
  const handleDelete = async (id: number) => {
    if (!confirm("정말로 이 계약서를 삭제하시겠습니까?")) {
      return;
    }    try {
      await contractService.deleteContract(id, category);
      router.push(`..?category=${category}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "계약서 삭제에 실패했습니다."
      );
    }
  };
  // 오프라인 서명 처리
  const handleOfflineSign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract) return;

    setLoading(true);
    setError(null);

    try {
      const request: OfflineSignRequest = {
        signerName: offlineSignData.signerName,
        memo: offlineSignData.memo,
      };

      await contractService.signOfflineAsAdmin(contract.id, request);

      // 상태를 오프라인 서명됨으로 변경
      await handleStatusChange(contract.id, ContractStatus.SIGNED_OFFLINE);

      // 폼 초기화
      setOfflineSignData({
        signerName: "",
        memo: "",
      });
      setShowOfflineSignForm(false);

      // 상세 정보 새로고침
      await fetchContractDetail(contract.id);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "오프라인 서명 처리에 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  };
  // 전자 서명 요청 생성
  const handleElectronicSign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract) return;

    setLoading(true);
    setError(null);

    try {
      const signatureUrl = await contractService.signOnBehalf(
        contract.id,
        electronicSignData.userId
      );

      // 서명 URL을 새 창에서 열기
      window.open(signatureUrl, "_blank");

      // 계약 상태를 서명됨으로 변경
      await handleStatusChange(contract.id, ContractStatus.SIGNED);

      // 폼 초기화
      setElectronicSignData({
        userId: 1,
      });
      setShowElectronicSignForm(false);

      // 상세 정보 새로고침
      await fetchContractDetail(contract.id);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "전자 서명 요청 생성에 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  };
  // 상태에 따른 색상 반환
  const getStatusColor = (status: ContractStatus) => {
    switch (status) {
      case ContractStatus.DRAFT:
        return "text-gray-600";
      case ContractStatus.REVIEW:
        return "text-yellow-600";
      case ContractStatus.SIGNED_OFFLINE:
        return "text-blue-600";
      case ContractStatus.SIGNED:
        return "text-blue-600";
      case ContractStatus.CONFIRMED:
        return "text-green-600";
      case ContractStatus.ACTIVE:
        return "text-green-800";
      case ContractStatus.EXPIRED:
        return "text-orange-600";
      case ContractStatus.PENDING:
        return "text-yellow-600";
      case ContractStatus.TERMINATED:
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  // 초기 데이터 로딩
  useEffect(() => {
    if (contractId) {
      fetchContractDetail(contractId);
    }
  }, [contractId, category]);
  // 상태에 따라 사용 가능한 액션 반환
  const getAvailableActions = (status: ContractStatus) => {
    switch (status) {
      case ContractStatus.DRAFT:
        return {
          canReview: true,
          canSign: false,
          canConfirm: false,
          canDelete: true,
        };
      case ContractStatus.REVIEW:
        return {
          canReview: false,
          canSign: true,
          canConfirm: false,
          canDelete: true,
        };
      case ContractStatus.PENDING:
        return {
          canReview: true,
          canSign: false,
          canConfirm: false,
          canDelete: true,
        };
      case ContractStatus.SIGNED:
      case ContractStatus.SIGNED_OFFLINE:
        return {
          canReview: false,
          canSign: false,
          canConfirm: true,
          canDelete: true,
        };
      case ContractStatus.CONFIRMED:
      case ContractStatus.ACTIVE:
        return {
          canReview: false,
          canSign: false,
          canConfirm: false,
          canDelete: false,
          canTerminate: true,
        };
      case ContractStatus.TERMINATED:
      case ContractStatus.EXPIRED:
        return {
          canReview: false,
          canSign: false,
          canConfirm: false,
          canDelete: true,
        };
      default:
        return {
          canReview: false,
          canSign: false,
          canConfirm: false,
          canDelete: false,
        };
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">        <h1 className="text-2xl font-bold">계약서 상세</h1>
        <div className="flex gap-2">
          {" "}
          <Link
            href={`..?category=${category}`}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            목록으로
          </Link>
          <Link
            href=".."
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            메인으로
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : contract ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold mb-4">기본 정보</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        ID
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {contract.id}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        상태
                      </label>
                      <p
                        className={`mt-1 text-sm ${getStatusColor(
                          contract.status
                        )}`}
                      >
                        {contract.status}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">
                      제목
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {contract.title}
                    </p>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">
                      요약
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {contract.summary}
                    </p>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        시작일
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {new Date(contract.startDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        종료일
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {new Date(contract.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        생성일
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {new Date(contract.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        수정일
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {new Date(contract.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold mb-4">서명 정보</h2>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      서명자명
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {contract.signerName || "아직 서명되지 않음"}
                    </p>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">
                      서명 메모
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {contract.signerMemo || "메모 없음"}
                    </p>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">
                      계약서 파일
                    </label>
                    {contract.fileUrl ? (
                      <a
                        href={contract.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-flex items-center text-sm text-blue-600 hover:underline"
                      >
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          ></path>
                        </svg>
                        계약서 파일 보기/다운로드
                      </a>
                    ) : (
                      <p className="mt-1 text-sm text-gray-500">
                        파일이 없습니다.
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-4">액션</h2>{" "}
                  <div className="flex flex-wrap gap-2">
                    {contract.status &&
                      getAvailableActions(contract.status).canReview && (
                        <button
                          onClick={() =>
                            handleStatusChange(
                              contract.id,
                              ContractStatus.REVIEW
                            )
                          }
                          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                          검토 요청
                        </button>
                      )}

                    {contract.status &&
                      getAvailableActions(contract.status).canSign && (
                        <>
                          <button
                            onClick={() => setShowOfflineSignForm(true)}
                            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                          >
                            오프라인 서명
                          </button>

                          <button
                            onClick={() => setShowElectronicSignForm(true)}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                          >
                            전자서명 요청
                          </button>
                        </>
                      )}

                    {contract.status &&
                      getAvailableActions(contract.status).canConfirm && (
                        <button
                          onClick={() => handleConfirm(contract.id)}
                          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                        >
                          계약 확정
                        </button>
                      )}

                    {contract.status &&
                      getAvailableActions(contract.status).canTerminate && (
                        <button
                          onClick={() =>
                            handleStatusChange(
                              contract.id,
                              ContractStatus.TERMINATED
                            )
                          }
                          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                        >
                          계약 종료
                        </button>
                      )}

                    {contract.status &&
                      getAvailableActions(contract.status).canDelete && (
                        <button
                          onClick={() => handleDelete(contract.id)}
                          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                          삭제
                        </button>
                      )}
                  </div>
                </div>
              </div>
            </div>

            {/* 오프라인 서명 폼 */}
            {showOfflineSignForm && (
              <div className="mt-6 border-t pt-6">
                <h2 className="text-lg font-semibold mb-4">
                  오프라인 서명 처리
                </h2>
                <form onSubmit={handleOfflineSign} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      서명자명
                    </label>
                    <input
                      type="text"
                      value={offlineSignData.signerName}
                      onChange={(e) =>
                        setOfflineSignData({
                          ...offlineSignData,
                          signerName: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="외부 계약 상대방 이름을 입력하세요"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      메모
                    </label>
                    <textarea
                      value={offlineSignData.memo}
                      onChange={(e) =>
                        setOfflineSignData({
                          ...offlineSignData,
                          memo: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      rows={3}
                      placeholder="서명 날짜, 위치 등의 추가 정보를 입력하세요"
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                      {loading ? "처리 중..." : "서명 처리"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowOfflineSignForm(false)}
                      className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                      취소
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* 전자 서명 요청 폼 */}
            {showElectronicSignForm && (
              <div className="mt-6 border-t pt-6">
                <h2 className="text-lg font-semibold mb-4">
                  전자 서명 요청 생성
                </h2>
                <form onSubmit={handleElectronicSign} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      서명 요청 대상 ID
                    </label>
                    <input
                      type="number"
                      value={electronicSignData.userId}
                      onChange={(e) =>
                        setElectronicSignData({
                          ...electronicSignData,
                          userId: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      min="1"
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                      {loading ? "생성 중..." : "서명 요청"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowElectronicSignForm(false)}
                      className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                      취소
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            계약서를 찾을 수 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
