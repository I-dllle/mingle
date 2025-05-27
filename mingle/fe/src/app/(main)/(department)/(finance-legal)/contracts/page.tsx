"use client";

import React, { useState, useEffect } from "react";
import {
  ContractCategory,
  ContractSimpleDto,
  ContractDetailDto,
  ContractStatus,
  ChangeStatusRequest,
  CreateContractRequest,
  CreateInternalContractRequest,
  ContractType,
  RatioType,
  SettlementRatioDto,
  OfflineSignRequest,
} from "@/features/department/finance-legal/contracts/types/Contract";
import { contractService } from "@/features/department/finance-legal/contracts/services/contractService";

interface ContractsPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function ContractsPage({ searchParams }: ContractsPageProps) {
  const [contracts, setContracts] = useState<ContractSimpleDto[]>([]);
  const [selectedContract, setSelectedContract] =
    useState<ContractDetailDto | null>(null);
  const [category, setCategory] = useState<ContractCategory>(
    ContractCategory.EXTERNAL
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showDetail, setShowDetail] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showOfflineSignForm, setShowOfflineSignForm] = useState(false);
  const [showElectronicSignForm, setShowElectronicSignForm] = useState(false);
  const [offlineSignData, setOfflineSignData] = useState({
    signerName: "",
    memo: "",
  });
  const [electronicSignData, setElectronicSignData] = useState({
    userId: 1,
  });
  const [createFormData, setCreateFormData] = useState({
    // 외부 계약용 필드
    userId: 1,
    teamId: null as number | null,
    summary: "",
    title: "",
    contractCategory: ContractCategory.EXTERNAL,
    startDate: "",
    endDate: "",
    contractType: ContractType.ELECTRONIC,
    contractAmount: 0,
    useManualRatios: false,
    ratios: [] as SettlementRatioDto[],
    targetUserIds: [] as number[],
    // 내부 계약용 필드
    ratioType: RatioType.ARTIST,
    defaultRatio: 50,
    file: null as File | null,
  });
  // 계약서 목록 조회
  const fetchContracts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await contractService.getAllContracts(
        category,
        currentPage,
        10
      );
      setContracts(response.content);
      setTotalPages(response.totalPages);

      // 첫 번째 계약이 있으면 자동으로 상세 정보 로드
      if (response.content.length > 0) {
        const firstContract = response.content[0];
        await fetchContractDetail(firstContract.id);
      } else {
        // 계약이 없으면 상세 정보 초기화
        setSelectedContract(null);
        setShowDetail(false);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "계약서 목록을 불러오는데 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  };
  // 계약서 상세 조회
  const fetchContractDetail = async (id: number) => {
    try {
      const detail = await contractService.getContractDetail(id, category);
      setSelectedContract(detail);
      setShowDetail(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "계약서 상세 정보를 불러오는데 실패했습니다."
      );
    }
  };

  // 계약서 상태 변경
  const handleStatusChange = async (id: number, nextStatus: ContractStatus) => {
    try {
      const request: ChangeStatusRequest = { nextStatus };
      await contractService.changeContractStatus(id, request, category);
      await fetchContracts(); // 목록 새로고침
      if (selectedContract && selectedContract.id === id) {
        await fetchContractDetail(id); // 상세 정보 새로고침
      }
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
      await fetchContracts();
      if (selectedContract && selectedContract.id === id) {
        await fetchContractDetail(id);
      }
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
      await fetchContracts();
      if (selectedContract && selectedContract.id === id) {
        setSelectedContract(null);
        setShowDetail(false);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "계약서 삭제에 실패했습니다."
      );
    }
  };
  // 계약서 생성
  const handleCreateContract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createFormData.file) {
      setError("파일을 선택해주세요.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      if (createFormData.contractCategory === ContractCategory.EXTERNAL) {
        const request: CreateContractRequest = {
          userId: createFormData.userId,
          teamId: createFormData.teamId,
          summary: createFormData.summary,
          title: createFormData.title,
          contractCategory: createFormData.contractCategory,
          startDate: createFormData.startDate,
          endDate: createFormData.endDate,
          contractType: createFormData.contractType,
          contractAmount: createFormData.contractAmount,
          useManualRatios: createFormData.useManualRatios,
          ratios: createFormData.ratios,
          targetUserIds: createFormData.targetUserIds,
        };
        await contractService.createContract(request, createFormData.file);
      } else {
        const request: CreateInternalContractRequest = {
          userId: createFormData.userId,
          ratioType: createFormData.ratioType,
          defaultRatio: createFormData.defaultRatio,
          startDate: createFormData.startDate,
          endDate: createFormData.endDate,
        };
        await contractService.createInternalContract(
          request,
          createFormData.file
        );
      }

      // 폼 초기화
      setCreateFormData({
        userId: 1,
        teamId: 1,
        summary: "",
        title: "",
        contractCategory: ContractCategory.EXTERNAL,
        startDate: "",
        endDate: "",
        contractType: ContractType.ELECTRONIC,
        contractAmount: 0,
        useManualRatios: false,
        ratios: [],
        targetUserIds: [],
        ratioType: RatioType.ARTIST,
        defaultRatio: 50,
        file: null,
      });
      setShowCreateForm(false);
      await fetchContracts();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "계약서 생성에 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  // 오프라인 서명 처리
  const handleOfflineSign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContract) return;

    setLoading(true);
    setError(null);

    try {
      const request: OfflineSignRequest = {
        signerName: offlineSignData.signerName,
        memo: offlineSignData.memo,
      };

      await contractService.signOfflineAsAdmin(selectedContract.id, request);

      // 폼 초기화
      setOfflineSignData({
        signerName: "",
        memo: "",
      });
      setShowOfflineSignForm(false);

      // 상세 정보 및 목록 새로고침
      await fetchContractDetail(selectedContract.id);
      await fetchContracts();
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
    if (!selectedContract) return;

    setLoading(true);
    setError(null);

    try {
      const signatureUrl = await contractService.signOnBehalf(
        selectedContract.id,
        electronicSignData.userId
      );

      // 서명 URL을 새 창에서 열기
      window.open(signatureUrl, "_blank");

      // 폼 초기화
      setElectronicSignData({
        userId: 1,
      });
      setShowElectronicSignForm(false);

      // 상세 정보 및 목록 새로고침
      await fetchContractDetail(selectedContract.id);
      await fetchContracts();
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
        return "text-gray-500";
      case ContractStatus.REVIEW:
        return "text-yellow-500";
      case ContractStatus.SIGNED:
        return "text-blue-500";
      case ContractStatus.CONFIRMED:
        return "text-green-500";
      case ContractStatus.ACTIVE:
        return "text-green-600";
      case ContractStatus.EXPIRED:
        return "text-red-500";
      case ContractStatus.TERMINATED:
        return "text-red-600";
      default:
        return "text-gray-500";
    }
  };

  // 상태 텍스트 반환
  const getStatusText = (status: ContractStatus) => {
    switch (status) {
      case ContractStatus.DRAFT:
        return "초안";
      case ContractStatus.REVIEW:
        return "검토중";
      case ContractStatus.SIGNED:
        return "서명됨";
      case ContractStatus.CONFIRMED:
        return "확정됨";
      case ContractStatus.ACTIVE:
        return "활성";
      case ContractStatus.EXPIRED:
        return "만료됨";
      case ContractStatus.TERMINATED:
        return "종료됨";
      default:
        return status;
    }
  };

  // 컴포넌트 마운트 시 및 카테고리/페이지 변경 시 데이터 로드
  useEffect(() => {
    fetchContracts();
  }, [category, currentPage]);
  return (
    <div className="container mx-auto p-6">
      {" "}
      <div className="flex justify-end items-center mb-6">
        <div className="flex gap-3">
          <button
            onClick={() => {
              // 계약서 목록 페이지로 이동
              window.location.href = "/contracts/list";
            }}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            계약서 목록
          </button>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {showCreateForm ? "취소" : "계약서 생성"}
          </button>
        </div>
      </div>{" "}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      {/* 계약서 생성 폼 */}
      {showCreateForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">계약서 생성</h2>
          <form onSubmit={handleCreateContract} className="space-y-4">
            {/* 카테고리 선택 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                계약 카테고리
              </label>
              <select
                value={createFormData.contractCategory}
                onChange={(e) =>
                  setCreateFormData({
                    ...createFormData,
                    contractCategory: e.target.value as ContractCategory,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value={ContractCategory.EXTERNAL}>외부 계약</option>
                <option value={ContractCategory.INTERNAL}>내부 계약</option>
              </select>
            </div>{" "}
            {createFormData.contractCategory === ContractCategory.EXTERNAL ? (
              <>
                {" "}
                {/* 작성자 ID와 팀 ID */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      작성자 ID
                    </label>
                    <input
                      type="number"
                      value={createFormData.userId}
                      onChange={(e) =>
                        setCreateFormData({
                          ...createFormData,
                          userId: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      min="1"
                      required
                    />
                  </div>{" "}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      팀 ID (선택사항)
                    </label>
                    <input
                      type="number"
                      value={createFormData.teamId || ""}
                      onChange={(e) =>
                        setCreateFormData({
                          ...createFormData,
                          teamId: e.target.value
                            ? Number(e.target.value)
                            : null,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      min="1"
                      placeholder="팀 ID를 입력하세요 (선택사항)"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      제목
                    </label>
                    <input
                      type="text"
                      value={createFormData.title}
                      onChange={(e) =>
                        setCreateFormData({
                          ...createFormData,
                          title: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      계약 금액
                    </label>
                    <input
                      type="number"
                      value={createFormData.contractAmount}
                      onChange={(e) =>
                        setCreateFormData({
                          ...createFormData,
                          contractAmount: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    요약
                  </label>
                  <textarea
                    value={createFormData.summary}
                    onChange={(e) =>
                      setCreateFormData({
                        ...createFormData,
                        summary: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows={3}
                    required
                  />
                </div>{" "}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      계약 타입
                    </label>
                    <select
                      value={createFormData.contractType}
                      onChange={(e) =>
                        setCreateFormData({
                          ...createFormData,
                          contractType: e.target.value as ContractType,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value={ContractType.ELECTRONIC}>전자 계약</option>
                      <option value={ContractType.PAPER}>종이 계약</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      수동 비율 사용
                    </label>
                    <select
                      value={createFormData.useManualRatios.toString()}
                      onChange={(e) =>
                        setCreateFormData({
                          ...createFormData,
                          useManualRatios: e.target.value === "true",
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="false">내부계약 기준</option>
                      <option value="true">수동 입력</option>
                    </select>
                  </div>
                </div>
                {/* 수동 비율 입력 섹션 */}
                {createFormData.useManualRatios && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-md font-medium mb-3">정산 비율 설정</h3>
                    <div className="space-y-3">
                      {createFormData.ratios.map((ratio, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-4 gap-3 items-end"
                        >
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              비율 타입
                            </label>
                            <select
                              value={ratio.ratioType}
                              onChange={(e) => {
                                const newRatios = [...createFormData.ratios];
                                newRatios[index].ratioType = e.target
                                  .value as RatioType;
                                setCreateFormData({
                                  ...createFormData,
                                  ratios: newRatios,
                                });
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            >
                              <option value={RatioType.ARTIST}>아티스트</option>
                              <option value={RatioType.PRODUCER}>
                                프로듀서
                              </option>
                              <option value={RatioType.AGENCY}>회사</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              사용자 ID
                            </label>
                            <input
                              type="number"
                              value={ratio.userId}
                              onChange={(e) => {
                                const newRatios = [...createFormData.ratios];
                                newRatios[index].userId = Number(
                                  e.target.value
                                );
                                setCreateFormData({
                                  ...createFormData,
                                  ratios: newRatios,
                                });
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              min="1"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              비율 (%)
                            </label>
                            <input
                              type="number"
                              value={ratio.percentage}
                              onChange={(e) => {
                                const newRatios = [...createFormData.ratios];
                                newRatios[index].percentage = Number(
                                  e.target.value
                                );
                                setCreateFormData({
                                  ...createFormData,
                                  ratios: newRatios,
                                });
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              min="0"
                              max="100"
                              required
                            />
                          </div>
                          <div>
                            <button
                              type="button"
                              onClick={() => {
                                const newRatios = createFormData.ratios.filter(
                                  (_, i) => i !== index
                                );
                                setCreateFormData({
                                  ...createFormData,
                                  ratios: newRatios,
                                });
                              }}
                              className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                              삭제
                            </button>
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          const newRatio: SettlementRatioDto = {
                            ratioType: RatioType.ARTIST,
                            userId: 1,
                            percentage: 0,
                          };
                          setCreateFormData({
                            ...createFormData,
                            ratios: [...createFormData.ratios, newRatio],
                          });
                        }}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        비율 추가
                      </button>
                    </div>
                  </div>
                )}
                {/* 내부계약 기준 대상 사용자 입력 섹션 */}
                {!createFormData.useManualRatios && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-md font-medium mb-3">
                      내부계약 기준 대상 사용자
                    </h3>
                    <div className="space-y-3">
                      {createFormData.targetUserIds.map((userId, index) => (
                        <div key={index} className="flex gap-3 items-end">
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              사용자 ID
                            </label>
                            <input
                              type="number"
                              value={userId}
                              onChange={(e) => {
                                const newUserIds = [
                                  ...createFormData.targetUserIds,
                                ];
                                newUserIds[index] = Number(e.target.value);
                                setCreateFormData({
                                  ...createFormData,
                                  targetUserIds: newUserIds,
                                });
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              min="1"
                              required
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const newUserIds =
                                createFormData.targetUserIds.filter(
                                  (_, i) => i !== index
                                );
                              setCreateFormData({
                                ...createFormData,
                                targetUserIds: newUserIds,
                              });
                            }}
                            className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            삭제
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          setCreateFormData({
                            ...createFormData,
                            targetUserIds: [...createFormData.targetUserIds, 1],
                          });
                        }}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        사용자 추가
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* 계약 당사자 ID 입력 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    계약 당사자 ID
                  </label>
                  <input
                    type="number"
                    value={createFormData.userId}
                    onChange={(e) =>
                      setCreateFormData({
                        ...createFormData,
                        userId: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    min="1"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      비율 타입
                    </label>
                    <select
                      value={createFormData.ratioType}
                      onChange={(e) =>
                        setCreateFormData({
                          ...createFormData,
                          ratioType: e.target.value as RatioType,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value={RatioType.ARTIST}>아티스트</option>
                      <option value={RatioType.PRODUCER}>프로듀서</option>
                      <option value={RatioType.AGENCY}>회사</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      기본 비율 (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={createFormData.defaultRatio}
                      onChange={(e) =>
                        setCreateFormData({
                          ...createFormData,
                          defaultRatio: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>
              </>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  시작일
                </label>
                <input
                  type="date"
                  value={createFormData.startDate}
                  onChange={(e) =>
                    setCreateFormData({
                      ...createFormData,
                      startDate: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  종료일
                </label>
                <input
                  type="date"
                  value={createFormData.endDate}
                  onChange={(e) =>
                    setCreateFormData({
                      ...createFormData,
                      endDate: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                계약서 파일
              </label>
              <input
                type="file"
                onChange={(e) =>
                  setCreateFormData({
                    ...createFormData,
                    file: e.target.files?.[0] || null,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                accept=".pdf,.doc,.docx"
                required
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
              >
                {loading ? "생성 중..." : "생성"}
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                취소
              </button>
            </div>
          </form>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {" "}
        {/* 계약서 목록 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">대기중인 계약서 목록</h2>{" "}
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value as ContractCategory);
                setCurrentPage(0);
              }}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-0 focus:border-gray-300"
            >
              <option value={ContractCategory.EXTERNAL}>외부 계약</option>
              <option value={ContractCategory.INTERNAL}>내부 계약</option>
            </select>
          </div>

          {loading ? (
            <div className="text-center py-4">로딩 중...</div>
          ) : contracts.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              계약서가 없습니다.
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {contracts.map((contract) => (
                  <div
                    key={contract.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => fetchContractDetail(contract.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{contract.title}</h3>
                        <p className="text-sm text-gray-600">
                          {contract.startDate} ~ {contract.endDate}
                        </p>
                        <span
                          className={`text-sm ${getStatusColor(
                            contract.category as any
                          )}`}
                        >
                          {contract.category === ContractCategory.EXTERNAL
                            ? "외부계약"
                            : "내부계약"}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(contract.id);
                          }}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 페이지네이션 */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-6 gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                    disabled={currentPage === 0}
                    className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
                  >
                    이전
                  </button>
                  <span className="px-3 py-1">
                    {currentPage + 1} / {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages - 1, currentPage + 1))
                    }
                    disabled={currentPage === totalPages - 1}
                    className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
                  >
                    다음
                  </button>
                </div>
              )}
            </>
          )}
        </div>{" "}
        {/* 계약서 상세 정보 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">
            {category === ContractCategory.INTERNAL
              ? "내부 계약 상세"
              : "외부 계약서 상세"}
          </h2>
          {!showDetail ? (
            <div className="text-center py-8 text-gray-500">
              계약서를 선택하여 상세 정보를 확인하세요.
            </div>
          ) : selectedContract ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ID
                </label>
                <p className="text-sm text-gray-900">{selectedContract.id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  요약
                </label>
                <p className="text-sm text-gray-900">
                  {selectedContract.summary}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  서명자
                </label>
                <p className="text-sm text-gray-900">
                  {selectedContract.signerName}
                </p>
              </div>{" "}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  메모
                </label>
                <p className="text-sm text-gray-900">
                  {selectedContract.signerMemo || "없음"}
                </p>
              </div>
              {/* 내부 계약일 때만 사용자 ID 표시 */}
              {(category === ContractCategory.INTERNAL ||
                selectedContract.userId > 0) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    사용자 ID
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedContract.userId}
                  </p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  상태
                </label>
                <span
                  className={`text-sm ${getStatusColor(
                    selectedContract.status
                  )}`}
                >
                  {getStatusText(selectedContract.status)}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  계약 기간
                </label>
                <p className="text-sm text-gray-900">
                  {selectedContract.startDate} ~ {selectedContract.endDate}
                </p>
              </div>
              {selectedContract.fileUrl && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    파일
                  </label>
                  <a
                    href={selectedContract.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 text-sm"
                  >
                    파일 다운로드
                  </a>
                </div>
              )}{" "}
              {/* 액션 버튼들 */}
              <div className="flex flex-wrap gap-2 pt-4">
                {selectedContract.status === ContractStatus.DRAFT && (
                  <button
                    onClick={() =>
                      handleStatusChange(
                        selectedContract.id,
                        ContractStatus.REVIEW
                      )
                    }
                    className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    검토 시작
                  </button>
                )}

                {selectedContract.status === ContractStatus.REVIEW && (
                  <>
                    <button
                      onClick={() =>
                        handleStatusChange(
                          selectedContract.id,
                          ContractStatus.SIGNED
                        )
                      }
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      서명 완료
                    </button>
                    <button
                      onClick={() =>
                        setShowOfflineSignForm(!showOfflineSignForm)
                      }
                      className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                    >
                      오프라인 서명
                    </button>
                    <button
                      onClick={() =>
                        setShowElectronicSignForm(!showElectronicSignForm)
                      }
                      className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                    >
                      전자 서명 요청
                    </button>
                  </>
                )}

                {selectedContract.status === ContractStatus.SIGNED && (
                  <button
                    onClick={() => handleConfirm(selectedContract.id)}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    계약 확정
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-4">로딩 중...</div>
          )}{" "}
        </div>
      </div>
      {/* 오프라인 서명 폼 */}
      {showOfflineSignForm && selectedContract && (
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-lg font-semibold mb-4">오프라인 서명 처리</h2>
          <form onSubmit={handleOfflineSign} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                서명자 이름
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
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
              >
                {loading ? "처리 중..." : "오프라인 서명 처리"}
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
      {showElectronicSignForm && selectedContract && (
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-lg font-semibold mb-4">전자 서명 요청 생성</h2>
          <form onSubmit={handleElectronicSign} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                당사자 사용자 ID
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
                placeholder="서명할 사용자의 ID를 입력하세요"
                min="1"
                required
              />
            </div>
            <div className="text-sm text-gray-600">
              <p>• 지정된 사용자에게 전자 서명 요청이 생성됩니다.</p>
              <p>• 생성된 서명 URL이 새 창에서 열립니다.</p>
              <p>• 해당 사용자에게 이메일이 발송될 수 있습니다.</p>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 disabled:opacity-50"
              >
                {loading ? "생성 중..." : "전자 서명 요청 생성"}
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
  );
}
