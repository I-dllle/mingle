"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { settlementService } from "@/features/department/finance-legal/revenue/services/settlementService";
import { ArtistRevenueDto } from "@/features/department/finance-legal/revenue/types/Settlement";

export default function RevenueAnalyticsPage() {
  const [topArtists, setTopArtists] = useState<ArtistRevenueDto[]>([]);
  const [ratioTypeRevenue, setRatioTypeRevenue] = useState<
    Record<string, number>
  >({});
  const [userRevenue, setUserRevenue] = useState<number>(0);
  const [selectedUserId, setSelectedUserId] = useState<number>(0);
  const [artistLimit, setArtistLimit] = useState<number>(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userSearchLoading, setUserSearchLoading] = useState(false);

  // 날짜 필터
  const [dateFilter, setDateFilter] = useState({
    startDate: "",
    endDate: "",
  });

  // 통계 데이터
  const [statistics, setStatistics] = useState({
    totalRevenue: 0,
    totalArtists: 0,
    averageRevenue: 0,
    topArtistRevenue: 0,
  });
  // 분석 데이터 로드
  const loadAnalyticsData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [artistsData, ratioData] = await Promise.all([
        settlementService.getTopArtists(artistLimit),
        settlementService.getRevenueByRatioType(),
      ]);

      setTopArtists(artistsData);
      setRatioTypeRevenue(ratioData);

      // 통계 계산
      const totalRevenue = artistsData.reduce(
        (sum, artist) => sum + artist.totalRevenue,
        0
      );
      const topArtistRevenue =
        artistsData.length > 0 ? artistsData[0].totalRevenue : 0;

      setStatistics({
        totalRevenue,
        totalArtists: artistsData.length,
        averageRevenue:
          artistsData.length > 0 ? totalRevenue / artistsData.length : 0,
        topArtistRevenue,
      });
    } catch (error) {
      console.error("분석 데이터 로드 실패:", error);
      setError("분석 데이터를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 사용자별 수익 조회
  const handleUserRevenueSearch = async () => {
    if (selectedUserId <= 0) {
      setError("올바른 사용자 ID를 입력해주세요.");
      return;
    }

    setUserSearchLoading(true);
    setError(null);
    try {
      const revenue = await settlementService.getTotalRevenueByUser(
        selectedUserId
      );
      setUserRevenue(revenue);
    } catch (error) {
      console.error("사용자 수익 조회 실패:", error);
      setError("사용자 수익을 조회하는데 실패했습니다.");
    } finally {
      setUserSearchLoading(false);
    }
  };

  useEffect(() => {
    loadAnalyticsData();
  }, [artistLimit]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(amount);
  };
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                📊 수익 분석
              </h1>
              <p className="text-gray-600">
                아티스트별, 유형별 수익 분석 데이터를 확인하세요
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/revenue/dashboard"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                대시보드
              </Link>
              <Link
                href="/revenue/settlements"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                정산 관리
              </Link>
            </div>
          </div>
        </div>
        {/* 오류 메시지 */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  오류가 발생했습니다
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => setError(null)}
                    className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded-md hover:bg-red-200 transition-colors"
                  >
                    닫기
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    총 수익
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {formatCurrency(statistics.totalRevenue)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    총 아티스트
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {statistics.totalArtists.toLocaleString()}명
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-md flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    평균 수익
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {formatCurrency(statistics.averageRevenue)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    최고 수익
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {formatCurrency(statistics.topArtistRevenue)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        {/* 사용자별 수익 검색 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <svg
              className="w-5 h-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900">
              사용자별 수익 조회
            </h3>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                사용자 ID
              </label>
              <input
                type="number"
                value={selectedUserId || ""}
                onChange={(e) => setSelectedUserId(Number(e.target.value))}
                placeholder="사용자 ID를 입력하세요"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleUserRevenueSearch}
                disabled={userSearchLoading || selectedUserId <= 0}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {userSearchLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    조회중...
                  </>
                ) : (
                  "조회"
                )}
              </button>
            </div>
          </div>

          {userRevenue > 0 && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-blue-600 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    사용자 {selectedUserId}의 총 수익
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCurrency(userRevenue)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>{" "}
        {/* 메인 콘텐츠 그리드 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 상위 아티스트 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900">
                  상위 아티스트
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">
                  표시 개수:
                </label>
                <select
                  value={artistLimit}
                  onChange={(e) => setArtistLimit(Number(e.target.value))}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={5}>5개</option>
                  <option value={10}>10개</option>
                  <option value={20}>20개</option>
                  <option value={50}>50개</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-3">
                  <svg
                    className="animate-spin h-5 w-5 text-blue-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span className="text-gray-600">데이터를 불러오는 중...</span>
                </div>
              </div>
            ) : topArtists.length > 0 ? (
              <div className="space-y-3">
                {topArtists.map((artist, index) => (
                  <div
                    key={artist.artistId}
                    className="group flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all duration-200"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                          index === 0
                            ? "bg-yellow-500"
                            : index === 1
                            ? "bg-gray-400"
                            : index === 2
                            ? "bg-amber-600"
                            : "bg-blue-500"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {artist.artistName}
                        </p>
                        <p className="text-sm text-gray-500">
                          ID: {artist.artistId}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600 text-lg">
                        {formatCurrency(artist.totalRevenue)}
                      </p>
                      <p className="text-xs text-gray-500">
                        전체 수익의{" "}
                        {statistics.totalRevenue > 0
                          ? (
                              (artist.totalRevenue / statistics.totalRevenue) *
                              100
                            ).toFixed(1)
                          : 0}
                        %
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  아티스트 데이터 없음
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  현재 표시할 아티스트 데이터가 없습니다.
                </p>
              </div>
            )}
          </div>

          {/* 비율 유형별 수익 분배 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <svg
                className="w-5 h-5 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900">
                비율 유형별 수익 분배
              </h3>
            </div>

            {Object.keys(ratioTypeRevenue).length > 0 ? (
              <div className="space-y-6">
                {Object.entries(ratioTypeRevenue).map(
                  ([ratioType, revenue]) => {
                    const total = Object.values(ratioTypeRevenue).reduce(
                      (sum, val) => sum + val,
                      0
                    );
                    const percentage = total > 0 ? (revenue / total) * 100 : 0;

                    return (
                      <div key={ratioType} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-900">
                            {ratioType}
                          </span>
                          <div className="text-right">
                            <span className="text-sm font-medium text-purple-600">
                              {percentage.toFixed(1)}%
                            </span>
                            <div className="text-sm text-gray-500">
                              {formatCurrency(revenue)}
                            </div>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  }
                )}

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">
                      총계
                    </span>
                    <span className="text-lg font-bold text-purple-600">
                      {formatCurrency(
                        Object.values(ratioTypeRevenue).reduce(
                          (sum, val) => sum + val,
                          0
                        )
                      )}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  분배 데이터 없음
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  현재 표시할 비율 유형별 데이터가 없습니다.
                </p>
              </div>
            )}
          </div>
        </div>
        {/* 하단 네비게이션 */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            관련 페이지
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/revenue/dashboard"
              className="group p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 group-hover:bg-blue-100 rounded-lg flex items-center justify-center transition-colors">
                  <svg
                    className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                    대시보드
                  </h4>
                  <p className="text-sm text-gray-500">수익 현황 개요</p>
                </div>
              </div>
            </Link>

            <Link
              href="/revenue/settlements"
              className="group p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 group-hover:bg-green-100 rounded-lg flex items-center justify-center transition-colors">
                  <svg
                    className="w-5 h-5 text-gray-600 group-hover:text-green-600 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 group-hover:text-green-600 transition-colors">
                    정산 관리
                  </h4>
                  <p className="text-sm text-gray-500">정산 내역 및 관리</p>
                </div>
              </div>
            </Link>

            <Link
              href="/revenue/contracts"
              className="group p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 group-hover:bg-purple-100 rounded-lg flex items-center justify-center transition-colors">
                  <svg
                    className="w-5 h-5 text-gray-600 group-hover:text-purple-600 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 group-hover:text-purple-600 transition-colors">
                    계약별 조회
                  </h4>
                  <p className="text-sm text-gray-500">계약 기준 수익 분석</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
