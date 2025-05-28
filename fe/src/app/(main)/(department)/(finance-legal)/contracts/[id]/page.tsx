"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ContractCategory,
  ContractStatus,
  ContractDetailDto,
  ContractConditionResponse,
  ChangeStatusRequest,
  OfflineSignRequest
} from "@/features/department/finance-legal/contracts/types/Contract";
import { contractService } from "@/features/department/finance-legal/contracts/services/contractService";

// 이전에 정의된 목업 서비스 객체를 제거하고, 대신 임포트된 contractService를 사용합니다.

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
  const [contract, setContract] = useState<ContractDetailDto | null>(null);
  // 임시 생성일/수정일 정보
  const [createdDate, setCreatedDate] = useState<Date>(new Date());
  const [updatedDate, setUpdatedDate] = useState<Date>(new Date());

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
    }
    try {
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
      };      await contractService.signOfflineAsAdmin(contract.id, request);

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
    switch (status) {      case ContractStatus.DRAFT:
        return {
          canReview: true,
          canSign: false,
          canConfirm: false,
          canDelete: true,
          canTerminate: false,
        };
      case ContractStatus.REVIEW:
        return {
          canReview: false,
          canSign: true,
          canConfirm: false,
          canDelete: true,
          canTerminate: false,
        };
      case ContractStatus.PENDING:
        return {
          canReview: true,
          canSign: false,
          canConfirm: false,
          canDelete: true,
          canTerminate: false,
        };
      case ContractStatus.SIGNED:
      case ContractStatus.SIGNED_OFFLINE:
        return {
          canReview: false,
          canSign: false,
          canConfirm: true,
          canDelete: true,
          canTerminate: false,
        };
      case ContractStatus.CONFIRMED:
      case ContractStatus.ACTIVE:
        return {
          canReview: false,
          canSign: false,
          canConfirm: false,
          canDelete: false,
          canTerminate: true,
        };      case ContractStatus.TERMINATED:
      case ContractStatus.EXPIRED:
        return {
          canReview: false,
          canSign: false,
          canConfirm: false,
          canDelete: true,
          canTerminate: false,
        };
      default:
        return {
          canReview: false,
          canSign: false,
          canConfirm: false,
          canDelete: false,
          canTerminate: false,
        };
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* 상단 헤더 */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex flex-wrap justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              계약서 상세 정보
            </h1>
            <p className="text-gray-600 mt-1">
              계약의 상세 정보 및 상태를 관리합니다.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
            <Link
              href={`..?category=${category}`}
              className="inline-flex items-center bg-white border border-gray-300 text-gray-700 px-4 py-2.5 rounded-md hover:bg-gray-50 transition-colors shadow-sm font-medium"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              목록으로
            </Link>
            <Link
              href=".."
              className="inline-flex items-center bg-blue-600 text-white px-4 py-2.5 rounded-md hover:bg-blue-700 transition-colors shadow-sm font-medium"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              대시보드
            </Link>
          </div>
        </div>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* 로딩 화면 */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6 flex flex-col items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-500">계약 정보를 불러오는 중...</p>
        </div>
      ) : contract ? (
        <div>
          {/* 상태 표시 영역 */}
          <div className="bg-white rounded-lg shadow-sm border mb-6 overflow-hidden">
            <div className="bg-gray-50 p-4 border-b">
              <div className="flex flex-wrap items-center justify-between">
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <h2 className="text-lg font-semibold text-gray-900">
                    #{contract.id} {contract.summary}
                  </h2>
                </div>
                <div className="mt-2 sm:mt-0">
                  <span
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${
                      contract.status === ContractStatus.ACTIVE
                        ? "bg-green-100 text-green-800"
                        : contract.status === ContractStatus.DRAFT
                        ? "bg-gray-100 text-gray-800"
                        : contract.status === ContractStatus.REVIEW
                        ? "bg-yellow-100 text-yellow-800"
                        : contract.status === ContractStatus.SIGNED ||
                          contract.status === ContractStatus.SIGNED_OFFLINE
                        ? "bg-blue-100 text-blue-800"
                        : contract.status === ContractStatus.CONFIRMED
                        ? "bg-green-100 text-green-800"
                        : contract.status === ContractStatus.EXPIRED
                        ? "bg-red-100 text-red-800"
                        : contract.status === ContractStatus.PENDING
                        ? "bg-orange-100 text-orange-800"
                        : contract.status === ContractStatus.TERMINATED
                        ? "bg-gray-100 text-gray-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {contract.status}
                  </span>
                </div>
              </div>
            </div>

            {/* 계약 진행 상태 표시 */}
            <div className="p-4">
              <div className="relative">
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-100">
                  <div
                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                      contract.status === ContractStatus.ACTIVE
                        ? "bg-green-500 w-full"
                        : contract.status === ContractStatus.DRAFT
                        ? "bg-blue-500 w-1/5"
                        : contract.status === ContractStatus.REVIEW
                        ? "bg-blue-500 w-2/5"
                        : contract.status === ContractStatus.SIGNED ||
                          contract.status === ContractStatus.SIGNED_OFFLINE
                        ? "bg-blue-500 w-3/5"
                        : contract.status === ContractStatus.CONFIRMED
                        ? "bg-blue-500 w-4/5"
                        : contract.status === ContractStatus.EXPIRED ||
                          contract.status === ContractStatus.TERMINATED
                        ? "bg-red-500 w-full"
                        : contract.status === ContractStatus.PENDING
                        ? "bg-yellow-500 w-2/5"
                        : "bg-gray-300 w-0"
                    }`}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>초안</span>
                  <span>검토</span>
                  <span>서명</span>
                  <span>확정</span>
                  <span>활성화</span>
                </div>
              </div>
            </div>
          </div>

          {/* 메인 콘텐츠 영역 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 왼쪽 컬럼: 기본 정보 */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border mb-6">
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    기본 정보
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="mb-4">                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          계약서 제목
                        </label>
                        <p className="text-gray-900">{contract.summary}</p>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          요약
                        </label>
                        <p className="text-gray-900 whitespace-pre-line">
                          {contract.summary || "요약 내용이 없습니다."}
                        </p>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          계약 상태
                        </label>
                        <p className={`${getStatusColor(contract.status)}`}>
                          {contract.status}
                        </p>
                      </div>
                    </div>

                    <div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          계약 기간
                        </label>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-900">
                            {new Date(contract.startDate).toLocaleDateString()}
                          </span>
                          <span className="text-gray-500">~</span>
                          <span className="text-gray-900">
                            {new Date(contract.endDate).toLocaleDateString()}
                          </span>
                        </div>
                        {(() => {
                          // 만료일까지 남은 일수 계산
                          const today = new Date();
                          const endDate = new Date(contract.endDate);
                          const daysLeft = Math.ceil(
                            (endDate.getTime() - today.getTime()) /
                              (1000 * 60 * 60 * 24)
                          );
                          const isExpiringSoon = daysLeft > 0 && daysLeft <= 30;
                          const isExpired = daysLeft <= 0;

                          return (
                            <div className="mt-1">
                              {isExpired ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                  만료됨
                                </span>
                              ) : isExpiringSoon ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                                  만료까지 D-{daysLeft}
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                  유효
                                </span>
                              )}
                            </div>
                          );
                        })()}
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          관리 정보
                        </label>                        <div className="space-y-1 text-sm">
                          <p className="text-gray-600">
                            <span className="inline-block w-20">생성일:</span>
                            <span className="text-gray-900">
                              {createdDate.toLocaleDateString()}
                            </span>
                          </p>
                          <p className="text-gray-600">
                            <span className="inline-block w-20">
                              최종 수정일:
                            </span>
                            <span className="text-gray-900">
                              {updatedDate.toLocaleDateString()}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 서명 정보 영역 */}
              <div className="bg-white rounded-lg shadow-sm border mb-6">
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                    서명 정보
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          서명자
                        </label>
                        <p className="text-gray-900">
                          {contract.signerName || "아직 서명되지 않음"}
                        </p>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          서명 메모
                        </label>
                        <p className="text-gray-900 whitespace-pre-line">
                          {contract.signerMemo || "메모 없음"}
                        </p>
                      </div>
                    </div>

                    <div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          계약서 파일
                        </label>
                        {contract.fileUrl ? (
                          <a
                            href={contract.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 mr-2 text-gray-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                            계약서 파일 보기
                          </a>
                        ) : (
                          <p className="text-gray-500 mt-1">
                            첨부된 파일이 없습니다.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 오른쪽 컬럼: 작업 및 액션 */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border mb-6">
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    계약 작업
                  </h2>

                  <div className="space-y-3">
                    {contract.status &&
                      getAvailableActions(contract.status).canReview && (
                        <button
                          onClick={() =>
                            handleStatusChange(
                              contract.id,
                              ContractStatus.REVIEW
                            )
                          }
                          className="w-full inline-flex justify-center items-center px-4 py-2.5 bg-blue-50 border border-blue-300 rounded-md hover:bg-blue-100 text-blue-700 transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          검토 요청
                        </button>
                      )}

                    {contract.status &&
                      getAvailableActions(contract.status).canSign && (
                        <>
                          <button
                            onClick={() => setShowOfflineSignForm(true)}
                            className="w-full inline-flex justify-center items-center px-4 py-2.5 bg-yellow-50 border border-yellow-300 rounded-md hover:bg-yellow-100 text-yellow-700 transition-colors"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 mr-2"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                              />
                            </svg>
                            오프라인 서명
                          </button>

                          <button
                            onClick={() => setShowElectronicSignForm(true)}
                            className="w-full inline-flex justify-center items-center px-4 py-2.5 bg-blue-50 border border-blue-300 rounded-md hover:bg-blue-100 text-blue-700 transition-colors"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 mr-2"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                              />
                            </svg>
                            전자 서명 요청
                          </button>
                        </>
                      )}

                    {contract.status &&
                      getAvailableActions(contract.status).canConfirm && (
                        <button
                          onClick={() => handleConfirm(contract.id)}
                          className="w-full inline-flex justify-center items-center px-4 py-2.5 bg-green-50 border border-green-300 rounded-md hover:bg-green-100 text-green-700 transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
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
                          className="w-full inline-flex justify-center items-center px-4 py-2.5 bg-orange-50 border border-orange-300 rounded-md hover:bg-orange-100 text-orange-700 transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          계약 종료
                        </button>
                      )}

                    {contract.status &&
                      getAvailableActions(contract.status).canDelete && (
                        <button
                          onClick={() => handleDelete(contract.id)}
                          className="w-full inline-flex justify-center items-center px-4 py-2.5 bg-red-50 border border-red-300 rounded-md hover:bg-red-100 text-red-700 transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          계약 삭제
                        </button>
                      )}
                  </div>
                </div>
              </div>

              {/* 서명 폼 */}
              {showOfflineSignForm && (
                <div className="bg-white rounded-lg shadow-sm border mb-6">
                  <div className="p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          rows={3}
                          placeholder="서명 날짜, 위치 등의 추가 정보를 입력하세요"
                          required
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="submit"
                          disabled={loading}
                          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                          {loading ? "처리 중..." : "서명 처리"}
                        </button>

                        <button
                          type="button"
                          onClick={() => setShowOfflineSignForm(false)}
                          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                        >
                          취소
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* 전자 서명 요청 폼 */}
              {showElectronicSignForm && (
                <div className="bg-white rounded-lg shadow-sm border mb-6">
                  <div className="p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                        />
                      </svg>
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          min="1"
                          required
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="submit"
                          disabled={loading}
                          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                          {loading ? "생성 중..." : "서명 요청"}
                        </button>

                        <button
                          type="button"
                          onClick={() => setShowElectronicSignForm(false)}
                          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                        >
                          취소
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6 text-center py-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-gray-500">계약서를 찾을 수 없습니다.</p>
        </div>
      )}
    </div>
  );
}
