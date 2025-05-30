"use client";

import { useState, useEffect } from "react";
import { ReservationResponse } from "@/features/reservation/types/Reservation";
import {
  ReservationStatus,
  reservationStatusLabels,
} from "@/features/reservation/types/ReservationStatus";
import { RoomType, roomTypeLabels } from "@/features/reservation/types/Room";
import ReservationDetail from "@/features/reservation/components/ReservationDetail";
import ReservationNav from "@/features/reservation/components/ReservationNav";
import { formatDate } from "@/lib/date";

// 관리자용 예약 API 서비스
const adminReservationService = {
  async getAllReservations(): Promise<ReservationResponse[]> {
    const response = await fetch("/api/v1/admin/reservations");
    if (!response.ok) {
      throw new Error("Failed to fetch reservations");
    }
    return response.json();
  },

  async updateReservationStatus(
    id: number,
    status: ReservationStatus
  ): Promise<ReservationResponse> {
    const response = await fetch(`/api/v1/admin/reservations/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error("Failed to update reservation status");
    }
    return response.json();
  },

  async deleteReservation(id: number): Promise<void> {
    const response = await fetch(`/api/v1/admin/reservations/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete reservation");
    }
  },
};

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<ReservationResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReservation, setSelectedReservation] =
    useState<ReservationResponse | null>(null);
  const [filters, setFilters] = useState({
    status: "all",
    roomType: "all",
    dateFrom: "",
    dateTo: "",
    searchTerm: "",
  });

  // 예약 내역 로드
  useEffect(() => {
    const loadReservations = async () => {
      try {
        setIsLoading(true);
        const data = await adminReservationService.getAllReservations();
        setReservations(data);
        setError(null);
      } catch (err) {
        console.error("예약 내역을 불러오는 중 오류가 발생했습니다:", err);
        setError("예약 내역을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    loadReservations();
  }, []);

  // 예약 상태 변경 핸들러
  const handleStatusChange = async (id: number, status: ReservationStatus) => {
    try {
      const updatedReservation =
        await adminReservationService.updateReservationStatus(id, status);
      setReservations((prev) =>
        prev.map((res) => (res.id === id ? updatedReservation : res))
      );
      setSelectedReservation((prev) =>
        prev && prev.id === id ? updatedReservation : prev
      );
    } catch (err) {
      console.error("예약 상태 변경 중 오류가 발생했습니다:", err);
      alert("예약 상태 변경 중 오류가 발생했습니다.");
    }
  };

  // 예약 삭제 핸들러
  const handleDeleteReservation = async (id: number) => {
    if (!window.confirm("정말로 이 예약을 삭제하시겠습니까?")) {
      return;
    }

    try {
      await adminReservationService.deleteReservation(id);
      setReservations((prev) => prev.filter((res) => res.id !== id));
      setSelectedReservation(null);
    } catch (err) {
      console.error("예약 삭제 중 오류가 발생했습니다:", err);
      alert("예약 삭제 중 오류가 발생했습니다.");
    }
  };

  // 필터 변경 핸들러
  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // 필터링된 예약 목록
  const filteredReservations = reservations.filter((res) => {
    // 상태 필터
    if (filters.status !== "all" && res.reservationStatus !== filters.status) {
      return false;
    }

    // 방 타입 필터
    if (filters.roomType !== "all" && res.roomType !== filters.roomType) {
      return false;
    }

    // 날짜 범위 필터
    if (filters.dateFrom && res.date < filters.dateFrom) {
      return false;
    }
    if (filters.dateTo && res.date > filters.dateTo) {
      return false;
    }

    // 검색어 필터 (방 이름, 사용자 이름)
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      return (
        res.roomName.toLowerCase().includes(term) ||
        res.userName.toLowerCase().includes(term)
      );
    }

    return true;
  });
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">예약 관리</h1>

      {/* 예약 시스템 네비게이션 */}
      <ReservationNav isAdmin={true} />

      {/* 필터 섹션 */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              상태
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="all">모든 상태</option>
              {Object.entries(reservationStatusLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              방 유형
            </label>
            <select
              value={filters.roomType}
              onChange={(e) => handleFilterChange("roomType", e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="all">모든 유형</option>
              {Object.entries(roomTypeLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              시작일
            </label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              종료일
            </label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange("dateTo", e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              검색
            </label>
            <input
              type="text"
              placeholder="방 이름 또는 사용자 이름으로 검색"
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredReservations.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">방 이름</th>
                <th className="py-3 px-4 text-left">방 유형</th>
                <th className="py-3 px-4 text-left">날짜</th>
                <th className="py-3 px-4 text-left">시간</th>
                <th className="py-3 px-4 text-left">예약자</th>
                <th className="py-3 px-4 text-left">상태</th>
                <th className="py-3 px-4 text-center">액션</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservations.map((res) => (
                <tr
                  key={res.id}
                  className="border-t hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedReservation(res)}
                >
                  <td className="py-3 px-4">{res.id}</td>
                  <td className="py-3 px-4">{res.roomName}</td>
                  <td className="py-3 px-4">{roomTypeLabels[res.roomType]}</td>
                  <td className="py-3 px-4">
                    {formatDate(res.date, "yyyy년 M월 d일 (EEE)")}
                  </td>
                  <td className="py-3 px-4">{`${res.startTime} - ${res.endTime}`}</td>
                  <td className="py-3 px-4">{res.userName}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs ${
                        res.reservationStatus === ReservationStatus.CONFIRMED
                          ? "bg-blue-100 text-blue-800"
                          : res.reservationStatus === ReservationStatus.PENDING
                          ? "bg-yellow-100 text-yellow-800"
                          : res.reservationStatus === ReservationStatus.IN_USE
                          ? "bg-green-100 text-green-800"
                          : res.reservationStatus ===
                            ReservationStatus.COMPLETED
                          ? "bg-gray-100 text-gray-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {reservationStatusLabels[res.reservationStatus]}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedReservation(res);
                      }}
                      className="text-blue-600 hover:text-blue-900 mr-2"
                    >
                      상세
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteReservation(res.id);
                      }}
                      className="text-red-600 hover:text-red-900"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500">조회된 예약이 없습니다.</p>
        </div>
      )}

      {selectedReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <ReservationDetail
              reservation={selectedReservation}
              onClose={() => setSelectedReservation(null)}
              onCancel={() => handleDeleteReservation(selectedReservation.id)}
              onStatusChange={(status) =>
                handleStatusChange(selectedReservation.id, status)
              }
              isAdmin={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}
