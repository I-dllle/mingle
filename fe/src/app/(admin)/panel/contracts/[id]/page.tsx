"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  Calendar,
  User,
  Download,
  Edit,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  Share2,
  Settings,
} from "lucide-react";
import { contractService } from "@/features/department/finance-legal/contracts/services/contractService";
import {
  ContractDetailDto,
  ContractStatus,
  ContractCategory,
} from "@/features/department/finance-legal/contracts/types/Contract";

export default function ContractDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  // URL에서 카테고리를 가져오거나 기본값 사용
  const categoryParam =
    (searchParams.get("category") as ContractCategory) ||
    ContractCategory.EXTERNAL;
  const contractId = parseInt(params.id as string);

  const [contract, setContract] = useState<ContractDetailDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const getStatusIcon = (status: ContractStatus) => {
    const iconMap = {
      [ContractStatus.DRAFT]: <Edit className="h-4 w-4" />,
      [ContractStatus.REVIEW]: <Eye className="h-4 w-4" />,
      [ContractStatus.SIGNED_OFFLINE]: <CheckCircle className="h-4 w-4" />,
      [ContractStatus.SIGNED]: <CheckCircle className="h-4 w-4" />,
      [ContractStatus.CONFIRMED]: <CheckCircle className="h-4 w-4" />,
      [ContractStatus.ACTIVE]: <CheckCircle className="h-4 w-4" />,
      [ContractStatus.EXPIRED]: <XCircle className="h-4 w-4" />,
      [ContractStatus.PENDING]: <Clock className="h-4 w-4" />,
      [ContractStatus.TERMINATED]: <XCircle className="h-4 w-4" />,
    };
    return iconMap[status] || <AlertCircle className="h-4 w-4" />;
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
  const fetchContractDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await contractService.getContractDetail(
        contractId,
        categoryParam
      );
      setContract(response);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "계약 상세 정보 조회에 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  };
  const handleGoBack = () => {
    router.back();
  };

  const handleShare = () => {
    // 공유 로직
    navigator.clipboard.writeText(window.location.href);
    alert("계약서 링크가 클립보드에 복사되었습니다.");
  };

  const handleDownload = () => {
    // 다운로드 로직
    console.log("계약서 다운로드:", contractId);
  };
  useEffect(() => {
    if (contractId) {
      fetchContractDetail();
    }
  }, [contractId, categoryParam]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">계약서 정보를 불러오는 중...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <div className="flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          </div>
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft size={16} />
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="text-center py-12">
            <p className="text-gray-600">계약서를 찾을 수 없습니다.</p>
            <button
              onClick={handleGoBack}
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors mx-auto"
            >
              <ArrowLeft size={16} />
              돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* 상단 네비게이션 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleGoBack}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-white/70 rounded-xl transition-all duration-200 backdrop-blur-sm"
              >
                <ArrowLeft size={20} />
                <span className="font-medium">계약 목록</span>
              </button>

              {/* 브레드크럼 */}
              <nav className="flex items-center space-x-2 text-sm">
                <span className="text-gray-500">계약 관리</span>
                <span className="text-gray-300">/</span>
                <span className="text-gray-500">계약서 상세</span>
                <span className="text-gray-300">/</span>
                <span className="text-blue-600 font-semibold">
                  {formatContractId(contract.id)}
                </span>
              </nav>
            </div>{" "}
            {/* 빠른 액션 버튼들 */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-white/70 rounded-xl transition-all duration-200 backdrop-blur-sm"
              >
                <Share2 size={16} />
                <span className="hidden sm:inline">공유</span>
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-white/70 rounded-xl transition-all duration-200 backdrop-blur-sm"
              >
                <Download size={16} />
                <span className="hidden sm:inline">다운로드</span>
              </button>
            </div>
          </div>
        </div>
        {/* 헤더 섹션 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg mb-8 overflow-hidden">
          <div className="p-8">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {" "}
                <div className="flex items-center gap-4 mb-3">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <h1 className="text-3xl font-bold text-gray-900">
                        계약서 상세 정보
                      </h1>
                      <span
                        className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full shadow-sm ${getStatusColor(
                          contract.status
                        )}`}
                      >
                        {getStatusIcon(contract.status)}
                        {getStatusText(contract.status)}
                      </span>

                      {/* 만료일 경고 */}
                      {contract.endDate &&
                        new Date(contract.endDate) < new Date() && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-red-700 bg-red-50 rounded-full shadow-sm">
                            <AlertCircle size={12} />
                            만료됨
                          </span>
                        )}
                    </div>
                    <p className="text-gray-500 mt-1">
                      {formatContractId(contract.id)} •{" "}
                      {new Date().toLocaleDateString("ko-KR")} 조회
                    </p>
                  </div>
                </div>{" "}
                {/* 계약 기간 진행률 바 - 크고 자세하게 */}
                {contract.startDate && contract.endDate && (
                  <div className="mt-8 w-full">
                    <div className="bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-2xl p-8 border border-blue-100/50 w-full">
                      <div className="flex items-center justify-between mb-6">
                        <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-3">
                          <Clock className="h-5 w-5 text-blue-600" />
                          계약 진행 상황
                        </h4>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">
                            {contract.endDate &&
                            new Date(contract.endDate) < new Date()
                              ? "만료됨"
                              : `${Math.ceil(
                                  (new Date(contract.endDate).getTime() -
                                    new Date().getTime()) /
                                    (1000 * 60 * 60 * 24)
                                )}일 남음`}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            총{" "}
                            {Math.ceil(
                              (new Date(contract.endDate).getTime() -
                                new Date(contract.startDate).getTime()) /
                                (1000 * 60 * 60 * 24)
                            )}
                            일 계약 기간
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {" "}
                        <div className="flex items-center justify-between text-sm font-medium text-gray-600 w-full flex-wrap gap-y-2 mb-2">
                          <span className="flex items-center gap-2 bg-white/70 px-3 py-1.5 rounded-lg shadow-sm">
                            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                            시작:{" "}
                            <span className="font-bold text-blue-700">
                              {new Date(contract.startDate).toLocaleDateString(
                                "ko-KR"
                              )}
                            </span>
                          </span>
                          <span className="text-gray-800 font-semibold bg-white/70 px-4 py-1.5 rounded-lg shadow-sm">
                            {Math.round(
                              Math.min(
                                100,
                                Math.max(
                                  0,
                                  ((new Date().getTime() -
                                    new Date(contract.startDate).getTime()) /
                                    (new Date(contract.endDate).getTime() -
                                      new Date(contract.startDate).getTime())) *
                                    100
                                )
                              )
                            )}
                            % 진행
                          </span>
                          <span className="flex items-center gap-2 bg-white/70 px-3 py-1.5 rounded-lg shadow-sm">
                            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                            종료:{" "}
                            <span className="font-bold text-red-700">
                              {new Date(contract.endDate).toLocaleDateString(
                                "ko-KR"
                              )}
                            </span>
                          </span>
                        </div>
                        <div className="relative w-full">
                          <div className="bg-gray-200 rounded-full h-6 overflow-hidden shadow-inner w-full">
                            <div
                              className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 h-6 rounded-full transition-all duration-1000 shadow-sm relative overflow-hidden"
                              style={{
                                width: `${Math.min(
                                  100,
                                  Math.max(
                                    0,
                                    ((new Date().getTime() -
                                      new Date(contract.startDate).getTime()) /
                                      (new Date(contract.endDate).getTime() -
                                        new Date(
                                          contract.startDate
                                        ).getTime())) *
                                      100
                                  )
                                )}%`,
                              }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                            </div>
                          </div>

                          {/* 현재 위치 표시 */}
                          <div
                            className="absolute -top-2 w-8 h-8 bg-blue-600 rounded-full border-2 border-white shadow-xl transform -translate-x-1/2 flex items-center justify-center"
                            style={{
                              left: `${Math.min(
                                100,
                                Math.max(
                                  0,
                                  ((new Date().getTime() -
                                    new Date(contract.startDate).getTime()) /
                                    (new Date(contract.endDate).getTime() -
                                      new Date(contract.startDate).getTime())) *
                                    100
                                )
                              )}%`,
                            }}
                          >
                            <div className="w-3 h-3 bg-white rounded-full"></div>
                          </div>
                        </div>{" "}
                        <div className="grid grid-cols-3 gap-4 mt-6 text-center w-full">
                          <div className="bg-white/60 rounded-lg p-4 shadow-sm">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                              경과 일수
                            </p>
                            <p className="text-lg font-bold text-blue-600 mt-1">
                              {(() => {
                                // 시작일과 현재 날짜에서 시간 부분을 제거하고 날짜만 비교
                                const startDate = new Date(contract.startDate);
                                const today = new Date();

                                // 날짜만 사용하여 새로운 Date 객체 생성
                                const normalizedStartDate = new Date(
                                  startDate.getFullYear(),
                                  startDate.getMonth(),
                                  startDate.getDate()
                                );
                                const normalizedToday = new Date(
                                  today.getFullYear(),
                                  today.getMonth(),
                                  today.getDate()
                                );

                                // 밀리초 차이를 일수로 계산
                                const diffTime =
                                  normalizedToday.getTime() -
                                  normalizedStartDate.getTime();
                                const diffDays = Math.floor(
                                  diffTime / (1000 * 60 * 60 * 24)
                                );

                                return Math.max(0, diffDays);
                              })()}
                              일
                            </p>
                          </div>
                          <div className="bg-white/60 rounded-lg p-4 shadow-sm">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                              현재 상태
                            </p>
                            <p className="text-lg font-bold text-gray-800 mt-1">
                              {getStatusText(contract.status)}
                            </p>
                          </div>
                          <div className="bg-white/60 rounded-lg p-4 shadow-sm">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                              남은 일수
                            </p>
                            <p
                              className={`text-lg font-bold mt-1 ${
                                contract.endDate &&
                                new Date(contract.endDate) < new Date()
                                  ? "text-red-600"
                                  : Math.ceil(
                                      (new Date(contract.endDate).getTime() -
                                        new Date().getTime()) /
                                        (1000 * 60 * 60 * 24)
                                    ) <= 30
                                  ? "text-orange-600"
                                  : "text-green-600"
                              }`}
                            >
                              {contract.endDate &&
                              new Date(contract.endDate) < new Date()
                                ? "만료됨"
                                : `${Math.ceil(
                                    (new Date(contract.endDate).getTime() -
                                      new Date().getTime()) /
                                      (1000 * 60 * 60 * 24)
                                  )}일`}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}{" "}
              </div>
              {/* 주요 액션 버튼들 - 상단으로 이동함 */}
              <div className="flex items-center gap-3">
                {/* 상단 네비게이션 영역으로 이동 */}
              </div>
            </div>
          </div>
        </div>{" "}
        {/* 메인 콘텐츠 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 왼쪽 컬럼 - 주요 정보 */}
          <div className="lg:col-span-2 space-y-8">
            {/* 계약 정보 및 요약 카드 */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
              <div className="p-8">
                <h3 className="text-xl font-light mb-6 flex items-center gap-3 text-gray-800">
                  <div className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  계약 정보 및 요약
                </h3>
                {/* 기본 정보 - 작은 크기 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-gradient-to-br from-[#BCA5D4]/20 to-[#BACBFE]/30 rounded-lg p-4">
                    <label className="text-xs font-semibold text-[#7B96E5] uppercase tracking-wider">
                      계약 ID
                    </label>
                    <p className="text-sm font-mono font-bold text-gray-900 mt-1">
                      {formatContractId(contract.id)}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-[#BACBFE]/20 to-[#BACBFE]/30 rounded-lg p-4">
                    <label className="text-xs font-semibold text-[#8A6AAD] uppercase tracking-wider">
                      계약 유형
                    </label>{" "}
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      {categoryParam === ContractCategory.EXTERNAL
                        ? "외부 계약"
                        : "내부 계약"}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-[#BCA5D4]/20 to-[#BACBFE]/30 rounded-lg p-4">
                    <label className="text-xs font-semibold text-[#7B96E5] uppercase tracking-wider">
                      현재 상태
                    </label>
                    <div className="mt-2">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-lg ${getStatusColor(
                          contract.status
                        )}`}
                      >
                        {getStatusIcon(contract.status)}
                        {getStatusText(contract.status)}
                      </span>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-[#BACBFE]/20 to-[#BACBFE]/30 rounded-lg p-4">
                    <label className="text-xs font-semibold text-[#8A6AAD] uppercase tracking-wider">
                      생성일
                    </label>
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      {new Date().toLocaleDateString("ko-KR")}
                    </p>
                  </div>
                </div>{" "}
                {/* 계약 요약 */}
                <div className="bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-xl p-8 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-blue-500 to-blue-600 rounded-l-xl"></div>
                  <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4 ml-4">
                    계약 요약
                  </h4>
                  <p className="text-gray-700 leading-relaxed text-base ml-4">
                    {contract.summary ||
                      "요약 정보가 제공되지 않았습니다. 계약서 내용을 확인하려면 문서를 다운로드하거나 편집 모드로 진입하세요."}
                  </p>
                </div>
              </div>
            </div>
            {/* 서명자 정보 카드 */}
            {contract.signerName && (
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
                <div className="p-8">
                  <h3 className="text-xl font-light mb-6 flex items-center gap-3 text-gray-800">
                    <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    서명자 정보
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center">
                        <User className="h-8 w-8 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xl font-semibold text-gray-900 mb-1">
                          {contract.signerName}
                        </p>
                        <p className="text-sm text-purple-600 font-medium">
                          주 서명자
                        </p>
                      </div>
                    </div>
                    {contract.signerMemo && (
                      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6">
                        <label className="text-xs font-semibold text-purple-600 uppercase tracking-wider">
                          서명 메모
                        </label>
                        <p className="text-gray-700 mt-3 italic leading-relaxed">
                          {contract.signerMemo}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>{" "}
          {/* 오른쪽 컬럼 - 부가 정보 */}
          <div className="space-y-8">
            {/* 일정 정보 카드 */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
              <div className="p-8">
                <h3 className="text-xl font-light mb-6 flex items-center gap-3 text-gray-800">
                  <div className="p-2 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  계약 기간
                </h3>{" "}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-[#BCA5D4]/20 to-[#BCA5D4]/30 rounded-xl p-6">
                    <label className="text-xs font-semibold text-[#8A6AAD] uppercase tracking-wider">
                      시작일
                    </label>
                    <p className="text-lg font-semibold text-gray-900 mt-2">
                      {contract.startDate}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-[#BACBFE]/20 to-[#BACBFE]/30 rounded-xl p-6">
                    <label className="text-xs font-semibold text-[#7B96E5] uppercase tracking-wider">
                      종료일
                    </label>
                    <p className="text-lg font-semibold text-gray-900 mt-2">
                      {contract.endDate}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
