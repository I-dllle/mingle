"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Modal from "@/features/schedule/components/ui/Modal";
import { Schedule } from "../../types/Schedule";
import { formatDate } from "@/features/schedule/utils/calendarUtils";
import StatusBadge from "../ui/StatusBadge";
import { scheduleService } from "../../services/scheduleService";
import { ScheduleFormModal } from "./ScheduleFormModal";
import { scheduleTypeLabels } from "../../types/scheduleLabels";

// 추가: user 불러오는 함수와 타입
import { fetchCurrentUser } from "@/features/auth/services/authService";
import { userService } from "@/features/auth/services/userService";
import type { User } from "@/features/auth/types/user";
import { ScheduleType } from "@/features/schedule/types/Enums";

interface ScheduleDetailModalProps {
  scheduleId: number;
  onClose: () => void;
  onDeleteSuccess?: () => void;
}

export default function ScheduleDetailModal({
  scheduleId,
  onClose,
  onDeleteSuccess,
}: ScheduleDetailModalProps) {
  const router = useRouter();

  // 유저 로딩
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // 일정 로딩
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [loadingSchedule, setLoadingSchedule] = useState(true);

  // 에러
  const [error, setError] = useState<string | null>(null);

  // 수정 모달 토글
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // 1) 로그인 유저 정보 불러오기
  useEffect(() => {
    (async () => {
      try {
        const me = await fetchCurrentUser();
        setUser(me ?? (await userService.getMyProfile()));
      } catch {
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    })();
  }, []);

  // 2) 일정 상세 정보 불러오기
  // 함수로 분리
  const loadSchedule = async () => {
    setLoadingSchedule(true);
    setError(null);
    try {
      const data = await scheduleService.getScheduleById(scheduleId);
      setSchedule(data);
    } catch (e) {
      console.error("일정을 불러오는데 실패했습니다", e);
      setError("일정 상세 정보를 불러오는데 실패했습니다.");
    } finally {
      setLoadingSchedule(false);
    }
  };

  // 마운트 & scheduleId 변경 시 호출
  useEffect(() => {
    loadSchedule();
  }, [scheduleId]);

  // 3) 로딩 중 렌더링
  if (loadingUser || loadingSchedule) {
    return (
      <Modal onClose={onClose} title="로딩 중…">
        <div className="py-16 text-center">잠시만 기다려 주세요...</div>
      </Modal>
    );
  }

  // 4) 수정/삭제 권한
  const isAdmin = user?.role === "ADMIN";
  const isOwner = schedule?.userId === user?.id;
  // 회사 일정은 관리자만, 그 외(개인/부서)은 생성자만
  const canEditDelete =
    (schedule?.scheduleType === ScheduleType.COMPANY && isAdmin) || isOwner;

  // 삭제 핸들러
  const handleDeleteSchedule = async () => {
    if (!schedule || !confirm("정말 이 일정을 삭제하시겠습니까?")) return;
    try {
      await scheduleService.deleteSchedule(schedule.id);
    } catch (e: any) {
      // DELETE 204 No Content 응답에서 JSON 파싱 에러가 날 경우,
      // 실제로는 삭제가 됐을 수 있으니 무시
      const msg = e?.message || "";
      if (
        !msg.includes("Unexpected end of JSON") &&
        !msg.includes("No Content")
      ) {
        setError("일정 삭제에 실패했습니다.");
        return;
      }
    }
    // 삭제 성공 콜백 호출 (리스트 갱신용)
    // 삭제 성공 후 콜백 또는 닫기
    if (onDeleteSuccess) {
      onDeleteSuccess();
    } else {
      onClose();
    }
  };

  // 수정 완료 후: 폼만 닫고, 상세 데이터를 다시 불러옵니다
  const handleEditComplete = async () => {
    setIsEditModalOpen(false);
    await loadSchedule();
  };

  return (
    <>
      <Modal onClose={onClose} title="">
        <div className="w-full max-w-2xl bg-white rounded-lg p-5">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 text-red-700 rounded-lg shadow-sm animate-fade-in flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-red-500"
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
              {error}
            </div>
          )}

          {/* 제목과 태그 헤더 */}
          <div className="mb-6">
            {/* 상태 태그 */}
            {schedule!.scheduleStatus !== "NONE" && (
              <div className="mb-2">
                <StatusBadge status={schedule!.scheduleStatus} />
              </div>
            )}{" "}
            {/* 제목 */}
            <h1 className="text-xl font-bold text-gray-900 mb-1">
              {schedule!.title}
            </h1>{" "}
            <div className="flex items-center text-sm space-x-1">
              <span
                className={`font-medium ${
                  schedule!.scheduleType === ScheduleType.COMPANY
                    ? "text-pink-500"
                    : schedule!.scheduleType === ScheduleType.DEPARTMENT
                    ? "text-amber-400"
                    : "text-purple-600"
                }`}
              >
                {scheduleTypeLabels[schedule!.scheduleType]}
                {schedule!.scheduleType === ScheduleType.DEPARTMENT &&
                  schedule!.departmentName &&
                  ` · ${schedule!.departmentName}`}
              </span>
            </div>
          </div>

          {/* 일정 정보 */}
          <div className="space-y-6">
            {/* 시간 정보 */}
            <div className="flex items-start space-x-3">
              <div className="mt-0.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>{" "}
              <div>
                <h3 className="text-sm text-gray-500 mb-1">일정 기간</h3>
                <p className="text-base font-medium text-gray-900">
                  {formatDate(schedule!.startTime, "yyyy.MM.dd (E)")}{" "}
                  {formatDate(schedule!.startTime, "HH:mm")} ~{" "}
                  {new Date(schedule!.startTime).toDateString() !==
                  new Date(schedule!.endTime).toDateString()
                    ? `${formatDate(
                        schedule!.endTime,
                        "yyyy.MM.dd (E)"
                      )} ${formatDate(schedule!.endTime, "HH:mm")}`
                    : formatDate(schedule!.endTime, "HH:mm")}
                </p>
              </div>
            </div>

            {/* 설명 */}
            {schedule!.description && (
              <div className="flex items-start space-x-3">
                <div className="mt-0.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm text-gray-500 mb-1">설명</h3>
                  <p className="text-base text-gray-800 whitespace-pre-line">
                    {schedule!.description}
                  </p>
                </div>
              </div>
            )}

            {/* 메모 */}
            {schedule!.memo && (
              <div className="flex items-start space-x-3">
                <div className="mt-0.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm text-gray-500 mb-1">메모</h3>
                  <p className="text-base text-gray-800 whitespace-pre-line">
                    {schedule!.memo}
                  </p>
                </div>
              </div>
            )}

            {/* 관련 게시물 */}
            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-sm text-gray-500 mb-3">관련 게시물</h3>
              <div className="space-y-2">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-8 h-8 rounded-md bg-blue-100 flex items-center justify-center mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-blue-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      2분기 마케팅 전략 보고서
                    </p>
                    <p className="text-xs text-gray-500">
                      마케팅팀 / 2025.05.29
                    </p>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-8 h-8 rounded-md bg-green-100 flex items-center justify-center mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      분석결과 엑셀
                    </p>
                    <p className="text-xs text-gray-500">
                      경영지원팀 / 2025.05.28
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 수정·삭제 버튼 */}
          <div className="flex justify-end space-x-2 mt-8 pt-5 border-t border-gray-100">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-200"
            >
              닫기
            </button>
            {canEditDelete && (
              <>
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all duration-200"
                >
                  수정
                </button>
                <button
                  onClick={handleDeleteSchedule}
                  className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-all duration-200"
                >
                  삭제
                </button>
              </>
            )}
          </div>
        </div>
      </Modal>

      {/* 수정 모달 */}
      {isEditModalOpen && schedule && (
        <ScheduleFormModal
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleEditComplete}
          schedule={schedule}
          mode="edit"
        />
      )}
    </>
  );
}
