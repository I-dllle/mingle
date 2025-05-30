"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ContractCategory,
  ContractType,
  RatioType,
  CreateContractRequest,
  CreateInternalContractRequest,
  SettlementRatioDto,
} from "@/features/department/finance-legal/contracts/types/Contract";
import { contractService } from "@/features/department/finance-legal/contracts/services/contractService";

interface CreateFormData {
  userId: number;
  teamId: number | null;
  summary: string;
  title: string;
  contractCategory: ContractCategory;
  startDate: string;
  endDate: string;
  contractType: ContractType;
  contractAmount: number;
  counterpartyCompanyName: string;
  useManualRatios: boolean;
  ratios: SettlementRatioDto[];
  targetUserIds: number[];
  ratioType: RatioType;
  defaultRatio: number;
  file: File | null;
}

export default function CreateContractPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam =
    (searchParams.get("category") as ContractCategory) ||
    ContractCategory.EXTERNAL;

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [createFormData, setCreateFormData] = useState<CreateFormData>({
    userId: 1,
    teamId: null, // 외부 계약에서는 팀 ID가 선택사항이므로 null로 초기화
    summary: "",
    title: "",
    contractCategory: categoryParam,
    startDate: "",
    endDate: "",
    contractType: ContractType.ELECTRONIC,
    contractAmount: 0,
    counterpartyCompanyName: "",
    useManualRatios: false,
    ratios: [],
    targetUserIds: [],
    ratioType: RatioType.ARTIST,
    defaultRatio: 50,
    file: null,
  });

  // 파일 선택 핸들러
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCreateFormData({
        ...createFormData,
        file: e.target.files[0],
      });
    }
  };
  // 계약서 생성
  const handleCreateContract = async (e: FormEvent) => {
    e.preventDefault();
    if (!createFormData.file) {
      setError("파일을 선택해주세요.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      let contractId: number;
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
          counterpartyCompanyName: createFormData.counterpartyCompanyName,
          useManualRatios: createFormData.useManualRatios,
          ratios: createFormData.ratios,
          targetUserIds: createFormData.targetUserIds,
        };

        // 디버깅용 로그
        console.log("외부 계약 생성 요청:", {
          ...request,
          teamIdValue: createFormData.teamId,
          teamIdType: typeof createFormData.teamId,
          isTeamIdNull: createFormData.teamId === null,
        });

        contractId = await contractService.createContract(
          request,
          createFormData.file
        );
      } else {
        const request: CreateInternalContractRequest = {
          userId: createFormData.userId,
          ratioType: createFormData.ratioType,
          defaultRatio: createFormData.defaultRatio,
          startDate: createFormData.startDate,
          endDate: createFormData.endDate,
        };
        contractId = await contractService.createInternalContract(
          request,
          createFormData.file
        );
      }      console.log(`계약서 생성 완료 (ID: ${contractId})`);

      // 성공 후 계약서 목록 페이지로 이동
      router.push(`/contracts`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "계약서 생성에 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      {" "}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">계약서 생성</h1>
        <Link
          href=".."
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          돌아가기
        </Link>
      </div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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
          </div>

          {/* 외부 계약 폼 필드 */}
          {createFormData.contractCategory === ContractCategory.EXTERNAL ? (
            <>
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
                </div>
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
                        teamId: e.target.value ? Number(e.target.value) : null,
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
                </div>{" "}
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
                  계약 상대방 회사명
                </label>
                <input
                  type="text"
                  value={createFormData.counterpartyCompanyName}
                  onChange={(e) =>
                    setCreateFormData({
                      ...createFormData,
                      counterpartyCompanyName: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="외부 계약 상대방 회사명을 입력하세요"
                  required
                />
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
              </div>

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
                            <option value={RatioType.PRODUCER}>프로듀서</option>
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
                              newRatios[index].userId = Number(e.target.value);
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
              {/* 내부 계약 폼 필드 */}
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

          {/* 공통 필드 */}
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
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              accept=".pdf,.doc,.docx"
              required
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? "생성 중..." : "계약서 생성"}
            </button>
            <Link
              href="/contracts"
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              취소
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
