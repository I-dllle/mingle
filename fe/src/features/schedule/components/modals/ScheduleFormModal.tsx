"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/features/user/auth/hooks/useAuth";
import { Schedule, ScheduleFormData } from "../../types/Schedule";
import { ScheduleType, ScheduleStatus } from "../../types/Enums";
import { scheduleService } from "../../services/scheduleService.ts";
import { formatDate } from "@/features/schedule/utils/calendarUtils";
import Modal from "@/features/schedule/components/ui/Modal";
import { scheduleStatusLabels } from "../../types/scheduleLabels";

interface ScheduleFormModalProps {
  onClose: () => void;
  onSubmit: () => void;
  schedule?: Schedule;
  mode: "create" | "edit";
  initialStartDate?: string;
}

export function ScheduleFormModal({
  onClose,
  onSubmit,
  schedule,
  mode,
  initialStartDate,
}: ScheduleFormModalProps) {
  // ① useAuth로 user, loading 가져오기
  const { user, isLoading: authLoading } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const initialISO = initialStartDate || "";
  const hasTime = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(initialISO);

  // 오늘 09:00 / 10:00 기본 Date 객체 미리 준비
  const today = new Date();
  const todayStart = new Date(today);
  todayStart.setHours(9, 0, 0, 0);
  const todayEnd = new Date(today);
  todayEnd.setHours(10, 0, 0, 0);

  const defaultStart = initialISO
    ? hasTime
      ? new Date(initialISO)
      : new Date(`${initialISO}T09:00`)
    : todayStart;

  const defaultEnd = initialISO
    ? hasTime
      ? (() => {
          const d = new Date(initialISO);
          d.setHours(d.getHours() + 1, 0, 0, 0);
          return d;
        })()
      : new Date(`${initialISO}T10:00`)
    : todayEnd;

  const [formData, setFormData] = useState<ScheduleFormData>({
    title: schedule?.title || "",
    description: schedule?.description || "",
    // schedule이 있으면 수정모드 데이터, 없으면 defaultStart/defaultEnd 사용
    startTime:
      schedule?.startTime || formatDate(defaultStart, "yyyy-MM-dd'T'HH:mm"),
    endTime: schedule?.endTime || formatDate(defaultEnd, "yyyy-MM-dd'T'HH:mm"),
    memo: schedule?.memo || "",
    scheduleType: schedule?.scheduleType || ScheduleType.PERSONAL,
    scheduleStatus: schedule?.scheduleStatus || ScheduleStatus.NONE,
    departmentId: schedule?.departmentId ?? undefined,
    postId: schedule?.postId || null, // 관련 게시물 ID 추가
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "startTime") {
      const startDate = new Date(value);
      if (!isNaN(startDate.getTime())) {
        const endDate = new Date(formData.endTime);
        if (startDate > endDate) {
          // 종료 시간을 시작 시간 1시간 후로 자동 설정
          const newEndTime = new Date(startDate.getTime() + 60 * 60 * 1000);
          setFormData((prev) => ({
            ...prev,
            [name]: value,
            endTime: formatDate(newEndTime, "yyyy-MM-dd'T'HH:mm"),
          }));
          return;
        }
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (
      !isAdmin &&
      user?.department?.departmentId &&
      formData.scheduleType === ScheduleType.DEPARTMENT
    ) {
      setFormData((prev) => ({
        ...prev,
        departmentId: user.department!.departmentId,
      }));
    }
  }, [formData.scheduleType, user, isAdmin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      if (mode === "create") {
        // 생성 모드: scheduleType에 따라 분기
        switch (formData.scheduleType) {
          case ScheduleType.PERSONAL:
            // 개인 일정 생성
            await scheduleService.createSchedule(formData);
            break;
          case ScheduleType.DEPARTMENT:
            // 부서 일정 생성 (모든 유저)
            await scheduleService.createDepartmentSchedule(formData);
            break;
          case ScheduleType.COMPANY:
            // 회사 일정 생성 (관리자만)
            await scheduleService.createCompanySchedule(formData);
            break;
        }
      } else {
        // 수정 모드
        if (isAdmin) {
          // 관리자: 모든 타입 updateAnySchedule 호출
          await scheduleService.updateAnySchedule(schedule!.id, formData);
        } else {
          // 일반 유저: 자신의 개인·부서 일정만 updateSchedule 호출
          await scheduleService.updateSchedule(schedule!.id, formData);
        }
      }

      onSubmit();
      onClose();
    } catch (err) {
      console.error("일정 저장 실패", err);
      setError("일정 저장 중 오류가 발생했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  const typeOptions = [
    { key: "personal", label: "개인 일정", value: ScheduleType.PERSONAL },
    { key: "department", label: "부서 일정", value: ScheduleType.DEPARTMENT },
    ...(isAdmin
      ? [{ key: "company", label: "회사 일정", value: ScheduleType.COMPANY }]
      : []),
  ];

  return (
    <Modal
      onClose={onClose}
      title={mode === "create" ? "새 일정 만들기" : "일정 수정하기"}
    >
      <div className="p-5">
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

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 제목 입력 필드 */}
          <div className="space-y-1">
            <div className="flex items-center">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2 text-purple-400"
              >
                <rect
                  x="4"
                  y="4"
                  width="12"
                  height="12"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M8 10H12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M10 8L10 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-sm font-medium text-gray-500">제목</span>
            </div>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-3 text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-300 focus:border-purple-300 transition-all bg-white"
              placeholder="일정 제목을 입력하세요"
              required
            />
          </div>

          {/* 시간 설정 영역 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2 text-purple-400"
                >
                  <rect
                    x="3"
                    y="4"
                    width="14"
                    height="13"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path d="M3 8H17" stroke="currentColor" strokeWidth="1.5" />
                  <path
                    d="M7 2V4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M13 2V4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="text-sm font-medium text-gray-500">
                  시작 시간
                </span>
              </div>
              <input
                type="datetime-local"
                name="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
                className="w-full px-4 py-3 text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-300 focus:border-purple-300 transition-all bg-white"
                step="1800"
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2 text-purple-400"
                >
                  <circle
                    cx="10"
                    cy="10"
                    r="7"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M10 6V10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M10 10L13 13"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="text-sm font-medium text-gray-500">
                  종료 시간
                </span>
              </div>
              <input
                type="datetime-local"
                name="endTime"
                value={formData.endTime}
                onChange={handleInputChange}
                className="w-full px-4 py-3 text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-300 focus:border-purple-300 transition-all bg-white"
                min={formData.startTime}
                step="1800"
              />
            </div>
          </div>

          {/* 일정 유형과 상태 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2 text-purple-400"
                >
                  <rect
                    x="3"
                    y="3"
                    width="14"
                    height="14"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path d="M3 8H17" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M8 8V17" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                <span className="text-sm font-medium text-gray-500">
                  일정 유형
                </span>
              </div>
              <div className="relative">
                <select
                  name="scheduleType"
                  value={formData.scheduleType}
                  onChange={handleInputChange}
                  disabled={authLoading || isSaving}
                  className="w-full px-4 py-3 text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-300 focus:border-purple-300 transition-all bg-white appearance-none"
                  required
                >
                  {typeOptions.map((opt) => (
                    <option key={opt.key} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    xmlns="http://www.w3.org/2000/svg"
                    className="fill-current text-gray-500"
                  >
                    <path
                      d="M2 4L6 8L10 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2 text-purple-400"
                >
                  <path
                    d="M4 10L8 14L16 6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-sm font-medium text-gray-500">상태</span>
              </div>
              <div className="relative">
                <select
                  name="scheduleStatus"
                  value={formData.scheduleStatus}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-300 focus:border-purple-300 transition-all bg-white appearance-none"
                >
                  {Object.entries(scheduleStatusLabels).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    xmlns="http://www.w3.org/2000/svg"
                    className="fill-current text-gray-500"
                  >
                    <path
                      d="M2 4L6 8L10 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* 설명 입력 필드 */}
          <div className="space-y-1">
            <div className="flex items-center">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2 text-purple-400"
              >
                <rect
                  x="3"
                  y="3"
                  width="14"
                  height="14"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M6 7H14"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M6 10H14"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M6 13H10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-sm font-medium text-gray-500">설명</span>
            </div>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-3 text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-300 focus:border-purple-300 transition-all bg-white resize-none"
              rows={3}
              placeholder="일정에 대한 설명을 입력하세요"
            />
          </div>

          {/* 메모 입력 필드 */}
          <div className="space-y-1">
            <div className="flex items-center">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2 text-purple-400"
              >
                <path
                  d="M17 3.00001L8.06066 11.9393M17 3.00001L11.0607 17.6777M17 3.00001L3 8.93935"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-sm font-medium text-gray-500">메모</span>
            </div>
            <textarea
              name="memo"
              value={formData.memo}
              onChange={handleInputChange}
              className="w-full px-4 py-3 text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-300 focus:border-purple-300 transition-all bg-white resize-none"
              rows={2}
              placeholder="추가 메모를 입력하세요"
            />
          </div>

          {/* 관련 게시물 연결 섹션 */}
          <div className="space-y-1">
            <div className="flex items-center">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2 text-purple-400"
              >
                <path
                  d="M10 5H8.75C7.75544 5 6.80161 5.39509 6.09835 6.09835C5.39509 6.80161 5 7.75544 5 8.75C5 9.74456 5.39509 10.6984 6.09835 11.4017C6.80161 12.1049 7.75544 12.5 8.75 12.5H10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 12.5H11.25C12.2446 12.5 13.1984 12.1049 13.9017 11.4017C14.6049 10.6984 15 9.74456 15 8.75C15 7.75544 14.6049 6.80161 13.9017 6.09835C13.1984 5.39509 12.2446 5 11.25 5H10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-sm font-medium text-gray-500">
                관련 게시물 연결
              </span>
            </div>
            <div className="mt-2">
              <div className="flex items-center space-x-2 mb-3">
                <button
                  type="button"
                  className="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center"
                  onClick={() => {
                    // 나중에 게시물 검색/선택 모달 구현
                    alert(
                      "게시물 검색 모달이 열릴 예정입니다. 아직 개발 중입니다."
                    );
                    // 테스트용 임시 postId 설정
                    setFormData((prev) => ({
                      ...prev,
                      postId: prev.postId ? null : 123,
                    }));
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-1.5"
                  >
                    <path
                      d="M7 11.5C9.48528 11.5 11.5 9.48528 11.5 7C11.5 4.51472 9.48528 2.5 7 2.5C4.51472 2.5 2.5 4.51472 2.5 7C2.5 9.48528 4.51472 11.5 7 11.5Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M13.5 13.5L10.5 10.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  게시물 찾기
                </button>
              </div>

              {/* 연결된 게시물 (있을 경우만 표시) */}
              {formData.postId && (
                <div className="space-y-2">
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg group">
                    <div className="w-7 h-7 rounded-md bg-blue-100 flex items-center justify-center mr-3">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-blue-500"
                      >
                        <path
                          d="M7.36667 1.16667H3.5C3.19167 1.16667 2.8958 1.29048 2.67701 1.50927C2.45822 1.72806 2.33334 2.02392 2.33334 2.33333V11.6667C2.33334 11.9761 2.45822 12.272 2.67701 12.4908C2.8958 12.7095 3.19167 12.8333 3.5 12.8333H10.5C10.8084 12.8333 11.1043 12.7095 11.3231 12.4908C11.5419 12.272 11.6667 11.9761 11.6667 11.6667V5.46667L7.36667 1.16667Z"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M7 1.16667V5.25001H11.0833"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
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
                    <button
                      type="button"
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, postId: null }));
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M13 3L3 13M3 3L13 13"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {/* 게시물이 연결되지 않았을 때 안내 메시지 */}
              {!formData.postId && (
                <div className="flex items-center p-4 bg-gray-50 border border-dashed border-gray-200 rounded-lg justify-center">
                  <p className="text-gray-400 text-sm">
                    연결된 게시물이 없습니다
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 저장/취소 버튼 */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={authLoading || isSaving}
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-all duration-200 disabled:opacity-50"
            >
              {isSaving
                ? "저장 중..."
                : mode === "create"
                ? "생성하기"
                : "수정하기"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

// 기본 내보내기 추가
export default ScheduleFormModal;
