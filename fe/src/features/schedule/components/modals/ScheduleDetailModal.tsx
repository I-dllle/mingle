"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Modal from "@/features/schedule/components/ui/Modal";
import { Schedule } from "../../types/Schedule";
import { formatDate } from "@/features/schedule/utils/calendarUtils";
import StatusBadge from "../ui/StatusBadge";
import { scheduleService } from "../../services/scheduleService";
import { ScheduleFormModal } from "./ScheduleFormModal";
import { scheduleTypeLabels } from "../../constants/scheduleLabels";

// 추가: user 불러오는 함수와 타입
import { fetchCurrentUser } from "@/features/auth/services/authService";
import { userService } from "@/features/auth/services/userService";
import type { User } from "@/features/auth/types/user";

interface ScheduleDetailModalProps {
  scheduleId: number;
  onClose: () => void;
}

export default function ScheduleDetailModal({
  scheduleId,
  onClose,
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
  const isAdmin =
    user?.role === "ROLE_ADMIN" || user?.role === "ROLE_SUPER_ADMIN";
  const canEditDelete = isAdmin || schedule?.userId === user?.id;

  // 삭제 핸들러
  const handleDeleteSchedule = async () => {
    if (!schedule || !confirm("정말 이 일정을 삭제하시겠습니까?")) return;
    try {
      await scheduleService.deleteSchedule(schedule.id);
      onClose();
      router.refresh();
    } catch {
      setError("일정 삭제에 실패했습니다.");
    }
  };

  // 수정 완료 후: 폼만 닫고, 상세 데이터를 다시 불러옵니다
  const handleEditComplete = async () => {
    setIsEditModalOpen(false);
    await loadSchedule();
  };

  return (
    <>
      <Modal onClose={onClose} title={schedule?.title || "일정 상세"}>
        <div className="w-full max-w-2xl bg-white rounded-lg p-5">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* 상세 정보 */}
          <div className="mb-4">
            <StatusBadge status={schedule!.scheduleStatus} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* 시간 */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">시간</h3>
                <p className="text-gray-900">
                  {formatDate(schedule!.startTime, "yyyy년 MM월 dd일 HH:mm")} ~
                  <br />
                  {formatDate(schedule!.endTime, "yyyy년 MM월 dd일 HH:mm")}
                </p>
              </div>
              {/* 유형 */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  일정 유형
                </h3>
                <p className="text-gray-900">
                  {scheduleTypeLabels[schedule!.scheduleType]}
                </p>
              </div>
              {/* 부서 (있을 때만) */}
              {schedule!.departmentId && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    부서
                  </h3>
                  <p className="text-gray-900">{schedule!.departmentId}</p>
                </div>
              )}
            </div>
            {/* 설명 */}
            {schedule!.description && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">설명</h3>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                  {schedule!.description}
                </p>
              </div>
            )}
          </div>
          {/* 메모 */}
          {schedule!.memo && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-1">메모</h3>
              <p className="text-gray-900 bg-gray-50 p-3 rounded-md whitespace-pre-line">
                {schedule!.memo}
              </p>
            </div>
          )}

          {/* 수정·삭제 버튼 */}
          {canEditDelete && (
            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-md hover:bg-purple-100"
              >
                수정
              </button>
              <button
                onClick={handleDeleteSchedule}
                className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100"
              >
                삭제
              </button>
            </div>
          )}
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
