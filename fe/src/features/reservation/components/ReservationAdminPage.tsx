// /features/reservation/admin/ReservationAdminPage.tsx
"use client";

import React, { useState, useEffect } from "react";
import { format, addMonths, subMonths } from "date-fns";
import type { Reservation } from "@/features/reservation/types/rservation";
import type { ReservationFormInput } from "@/features/reservation/types/rservation";
import { reservationService } from "@/features/reservation/services/reservationService";
import { ReservationForm } from "@/features/reservation/components/ReservationForm";
import { Calendar, PencilIcon, Trash2Icon } from "lucide-react";

export default function ReservationAdminPage() {
  // ─── 1. currentMonth 상태 (YYYY-MM) ───
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState<string>(
    format(today, "yyyy-MM")
  );

  // ─── 2. 관리자 전용 예약 목록 상태 ───
  const [reservations, setReservations] = useState<Reservation[]>([]);

  // ─── 3. 수정 모달 상태 ───
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  // ─── 4. 삭제 확인 모달 상태 ───
  const [reservationToDelete, setReservationToDelete] =
    useState<Reservation | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] =
    useState<boolean>(false);

  // ─── 5. 예약 목록 조회 함수 ───
  const fetchAdminReservations = async () => {
    try {
      const data = await reservationService.getAdminReservationsByMonth(
        currentMonth
      );
      setReservations(data);
    } catch (err) {
      console.error("관리자 예약 목록 불러오기 실패:", err);
      setReservations([]);
    }
  };

  // currentMonth가 바뀔 때마다 예약 목록 재조회
  useEffect(() => {
    fetchAdminReservations();
  }, [currentMonth]);

  // ─── 6. 이전달/다음달 버튼 핸들러 ───
  const handlePrevMonth = () => {
    const prev = subMonths(new Date(currentMonth + "-01"), 1);
    setCurrentMonth(format(prev, "yyyy-MM"));
  };
  const handleNextMonth = () => {
    const next = addMonths(new Date(currentMonth + "-01"), 1);
    setCurrentMonth(format(next, "yyyy-MM"));
  };

  // ─── 7. 달력(월 선택기) 변경 핸들러 ───
  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentMonth(e.target.value); // e.target.value 는 "YYYY-MM"
  };

  // ─── 8. 수정 버튼 클릭 ───
  const handleEditClick = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setIsEditModalOpen(true);
  };

  // ─── 9. 수정 모달 저장 ───
  const handleEditSubmit = async (formData: ReservationFormInput) => {
    if (!selectedReservation) return;
    try {
      await reservationService.adminUpdate(selectedReservation.id, formData);
      setIsEditModalOpen(false);
      setSelectedReservation(null);
      fetchAdminReservations();
    } catch (err) {
      console.error("관리자 예약 수정 실패:", err);
    }
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
    setSelectedReservation(null);
  };

  // ─── 10. 삭제 버튼 클릭 ───
  const handleDeleteClick = (reservation: Reservation) => {
    setReservationToDelete(reservation);
    setIsDeleteConfirmOpen(true);
  };

  // ─── 11. 삭제 확인(취소) ───
  const handleDeleteConfirm = async () => {
    if (!reservationToDelete) return;

    const proceed = window.confirm("정말 삭제하시겠습니까?");
    if (!proceed) {
      setIsDeleteConfirmOpen(false);
      setReservationToDelete(null);
      return;
    }

    try {
      // PATCH로 “관리자 강제 취소(소프트 삭제)” 요청
      const response = await fetch(
        `http://localhost:8080/api/v1/reservations/admin/${reservationToDelete.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `예약 삭제 실패: ${response.status}`);
      }

      setIsDeleteConfirmOpen(false);
      setReservationToDelete(null);
      fetchAdminReservations();
    } catch (err: any) {
      console.error("관리자 예약 삭제 실패:", err);
      alert("삭제 중 오류가 발생했습니다.\n" + err.message);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteConfirmOpen(false);
    setReservationToDelete(null);
  };
  // ─── 12. 렌더링 ───
  return (
    <div className="p-8 bg-gray-50 min-h-screen space-y-6">
      {/* ─── 헤더 영역 ─── */}
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100 bg-gradient-to-r from-violet-50 to-white">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 mr-2 text-violet-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            관리자용 예약 관리
          </h1>
          <p className="text-gray-500 mt-1 pl-10">
            공간 예약 일정을 한눈에 확인하고 관리할 수 있습니다
          </p>
        </div>{" "}
        {/* ─── 이전달 / 현재달 / 다음달 + 달력 아이콘 ─── */}
        <div className="flex items-center">
          <div className="flex items-center rounded-lg overflow-hidden shadow-sm border border-violet-100">
            <button
              onClick={handlePrevMonth}
              className="px-3 py-2 bg-white hover:bg-violet-50 transition flex items-center text-violet-700 border-r border-violet-100"
              aria-label="이전 달"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>

            <div className="px-5 py-2 bg-white text-violet-900 font-medium">
              {currentMonth.split("-")[0]}년 {currentMonth.split("-")[1]}월
            </div>

            <button
              onClick={handleNextMonth}
              className="px-3 py-2 bg-white hover:bg-violet-50 transition flex items-center text-violet-700 border-l border-violet-100"
              aria-label="다음 달"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>

          {/* 달력 아이콘 버튼 */}
          <div className="relative flex items-center ml-2">
            <button
              onClick={() => {
                const monthPicker = document.getElementById(
                  "month-picker"
                ) as HTMLInputElement | null;
                if (
                  monthPicker &&
                  typeof monthPicker.showPicker === "function"
                ) {
                  monthPicker.showPicker();
                }
              }}
              className="p-2 bg-violet-100 hover:bg-violet-200 text-violet-700 rounded-lg transition-all duration-200 flex items-center justify-center border border-violet-200"
              aria-label="달력 열기"
            >
              <Calendar size={18} />
            </button>
            <input
              id="month-picker"
              type="month"
              className="absolute left-0 opacity-0 w-0 h-0"
              value={currentMonth}
              onChange={handleMonthChange}
            />
          </div>
        </div>
      </div>
      {/* ─── 예약 목록 테이블 ─── */}{" "}
      <div className="overflow-hidden bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="px-6 py-5 bg-white border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-violet-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
              </svg>
              예약 목록
            </h2>
            <p className="text-gray-500 text-sm mt-1 pl-7">
              총{" "}
              <span className="text-violet-600 font-medium">
                {reservations.length}
              </span>
              개의 예약이 있습니다
            </p>
          </div>
          <div className="px-3 py-2 bg-violet-50 rounded-lg text-sm text-violet-700 font-medium flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            최근 업데이트: {new Date().toLocaleDateString()}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {/* “순번” 컬럼으로 변경 */}
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-200">
                  순번
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-200">
                  날짜
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-200">
                  시간
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-200">
                  방 이름
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-200">
                  제목
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-200">
                  예약자
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-200">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {reservations.map((res, index) => {
                // 순번은 index + 1
                const seq = index + 1;
                // 날짜/시간 가공
                const displayDate = format(new Date(res.date), "MM/dd");
                const displayTime = `${res.startTime} ~ ${res.endTime}`;

                return (
                  <tr
                    key={res.id}
                    className="hover:bg-violet-50/30 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {seq}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {displayDate}
                      </div>
                      <div className="text-xs text-gray-500">
                        {res.date
                          ? new Date(res.date).toLocaleDateString("ko-KR", {
                              weekday: "short",
                            })
                          : ""}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 bg-violet-100 text-violet-800 rounded-md text-xs font-medium">
                        {displayTime}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-7 w-7 rounded-md bg-violet-100 text-violet-700 flex items-center justify-center mr-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                          </svg>
                        </div>
                        <span className="text-sm text-gray-900">
                          {res.roomName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800 max-w-xs truncate">
                      {res.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm">
                        <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center mr-2 text-xs font-medium text-gray-600">
                          {res.userName ? res.userName.charAt(0) : "?"}
                        </div>
                        <span>{res.userName}</span>{" "}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEditClick(res)}
                          className="flex items-center justify-center text-violet-600 hover:text-violet-700 transition-all p-2 rounded-full hover:bg-violet-50 border border-transparent hover:border-violet-200 focus:outline-none focus:ring-2 focus:ring-violet-200"
                          aria-label="수정"
                        >
                          <PencilIcon
                            size={16}
                            className="transform hover:scale-110 transition-transform"
                          />
                          <span className="sr-only">수정</span>
                        </button>
                        <button
                          onClick={() => handleDeleteClick(res)}
                          className="flex items-center justify-center text-red-500 hover:text-red-600 transition-all p-2 rounded-full hover:bg-red-50 border border-transparent hover:border-red-200 focus:outline-none focus:ring-2 focus:ring-red-200"
                          aria-label="삭제"
                        >
                          <Trash2Icon
                            size={16}
                            className="transform hover:scale-110 transition-transform"
                          />
                          <span className="sr-only">삭제</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {reservations.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="inline-flex flex-col items-center">
                      <div className="p-4 rounded-full bg-violet-50 mb-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 text-violet-400"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect
                            x="3"
                            y="4"
                            width="18"
                            height="18"
                            rx="2"
                            ry="2"
                          ></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                      </div>
                      <p className="text-violet-800 font-medium mb-2">
                        예약 내역이 없습니다
                      </p>
                      <p className="text-gray-500 mb-2 text-sm">
                        이 달에 등록된 예약이 없습니다.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>{" "}
      {/* ─── 수정 모달 (ReservationForm 재활용) ─── */}
      {isEditModalOpen && selectedReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <ReservationForm
            initial={{
              roomId: selectedReservation.roomId,
              date: selectedReservation.date,
              startTime: selectedReservation.startTime,
              endTime: selectedReservation.endTime,
              title: selectedReservation.title ?? undefined,
              roomName: selectedReservation.roomName,
              reservations: [],
            }}
            onSubmit={handleEditSubmit}
            onCancel={handleEditCancel}
            isRoomSelected={true}
          />
        </div>
      )}
      {/* ─── 삭제 확인 모달 ─── */}
      {isDeleteConfirmOpen && reservationToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-[420px]">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 text-red-600"
                >
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                예약 삭제 확인
              </h3>
              <button
                onClick={handleDeleteCancel}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="mb-5 p-3 bg-red-50 rounded-lg text-sm text-red-700 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              이 예약을 삭제하시겠습니까? 이 작업은 취소할 수 없습니다.
            </div>

            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-700">
                    예약 정보
                  </h4>
                </div>
                <div className="px-4 py-3 space-y-2 text-sm">
                  <div className="flex items-center">
                    <div className="w-24 text-gray-500">일정:</div>
                    <div className="font-medium text-gray-800">
                      {reservationToDelete.date} (
                      {reservationToDelete.startTime} ~{" "}
                      {reservationToDelete.endTime})
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-24 text-gray-500">방 이름:</div>
                    <div className="font-medium text-gray-800 flex items-center">
                      <span className="inline-flex items-center justify-center h-5 w-5 bg-violet-100 text-violet-700 rounded mr-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                          <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                      </span>
                      {reservationToDelete.roomName}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-24 text-gray-500">제목:</div>
                    <div className="font-medium text-gray-800">
                      {reservationToDelete.title}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-24 text-gray-500">예약자:</div>
                    <div className="font-medium text-gray-800 flex items-center">
                      <span className="inline-flex items-center justify-center h-5 w-5 bg-gray-100 text-gray-700 rounded-full mr-1 text-xs">
                        {reservationToDelete.userName
                          ? reservationToDelete.userName.charAt(0)
                          : "?"}
                      </span>
                      {reservationToDelete.userName}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-24 text-gray-500">예약 ID:</div>
                    <div className="font-medium text-gray-800 bg-gray-100 px-2 py-0.5 rounded text-xs">
                      {reservationToDelete.id}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 pt-4 border-t border-gray-100">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 border border-gray-200 rounded-md hover:bg-gray-50 text-gray-700 transition shadow-sm flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-1"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                취소
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition shadow-sm flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-1"
                >
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
