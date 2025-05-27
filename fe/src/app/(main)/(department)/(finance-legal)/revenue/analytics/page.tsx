"use client";

import { useState, useEffect } from "react";
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

  // 분석 데이터 로드
  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      const [artistsData, ratioData] = await Promise.all([
        settlementService.getTopArtists(artistLimit),
        settlementService.getRevenueByRatioType(),
      ]);

      setTopArtists(artistsData);
      setRatioTypeRevenue(ratioData);
    } catch (error) {
      console.error("분석 데이터 로드 실패:", error);
      alert("분석 데이터를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 사용자별 수익 조회
  const handleUserRevenueSearch = async () => {
    if (selectedUserId <= 0) {
      alert("올바른 사용자 ID를 입력해주세요.");
      return;
    }

    try {
      const revenue = await settlementService.getTotalRevenueByUser(
        selectedUserId
      );
      setUserRevenue(revenue);
    } catch (error) {
      console.error("사용자 수익 조회 실패:", error);
      alert("사용자 수익을 조회하는데 실패했습니다.");
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
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">수익 분석</h1>
        <p className="text-gray-600">
          아티스트별, 유형별 수익 분석 데이터를 확인하세요
        </p>
      </div>

      {/* 사용자별 수익 검색 */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          사용자별 수익 조회
        </h3>
        <div className="flex items-center gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              사용자 ID
            </label>
            <input
              type="number"
              value={selectedUserId || ""}
              onChange={(e) => setSelectedUserId(Number(e.target.value))}
              placeholder="사용자 ID 입력"
              className="border border-gray-300 rounded-md px-3 py-2 w-40"
            />
          </div>
          <button
            onClick={handleUserRevenueSearch}
            className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            조회
          </button>
          {userRevenue > 0 && (
            <div className="mt-6 p-3 bg-blue-50 rounded-md">
              <p className="text-sm text-gray-600">
                사용자 {selectedUserId}의 총 수익
              </p>
              <p className="text-lg font-bold text-blue-600">
                {formatCurrency(userRevenue)}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 상위 아티스트 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-700">
              상위 아티스트
            </h3>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">표시 개수:</label>
              <select
                value={artistLimit}
                onChange={(e) => setArtistLimit(Number(e.target.value))}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm"
              >
                <option value={5}>5개</option>
                <option value={10}>10개</option>
                <option value={20}>20개</option>
                <option value={50}>50개</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">로딩중...</p>
            </div>
          ) : topArtists.length > 0 ? (
            <div className="space-y-3">
              {topArtists.map((artist, index) => (
                <div
                  key={artist.artistId}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{artist.artistName}</p>
                      <p className="text-sm text-gray-500">
                        ID: {artist.artistId}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">
                      {formatCurrency(artist.totalRevenue)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              아티스트 데이터가 없습니다.
            </p>
          )}
        </div>

        {/* 비율 유형별 수익 분배 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            비율 유형별 수익 분배
          </h3>

          {Object.keys(ratioTypeRevenue).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(ratioTypeRevenue).map(([ratioType, revenue]) => {
                const total = Object.values(ratioTypeRevenue).reduce(
                  (sum, val) => sum + val,
                  0
                );
                const percentage = total > 0 ? (revenue / total) * 100 : 0;

                return (
                  <div key={ratioType}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{ratioType}</span>
                      <span className="text-sm text-gray-600">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-right mt-1">
                      <span className="text-sm font-medium text-gray-700">
                        {formatCurrency(revenue)}
                      </span>
                    </div>
                  </div>
                );
              })}

              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="font-bold">총계</span>
                  <span className="font-bold text-blue-600">
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
            <p className="text-gray-500 text-center py-8">
              비율 유형별 데이터가 없습니다.
            </p>
          )}
        </div>
      </div>

      {/* 네비게이션 */}
      <div className="mt-8 flex justify-center gap-4">
        <a
          href="/revenue/dashboard"
          className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
        >
          대시보드로
        </a>
        <a
          href="/revenue/settlements"
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
        >
          정산 관리
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
