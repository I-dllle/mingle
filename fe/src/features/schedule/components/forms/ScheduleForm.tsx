"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  scheduleService,
  formatScheduleTime,
} from "@/features/schedule/services/scheduleService";
import { ScheduleType, ScheduleStatus } from "@/features/schedule/types/Enums";
import {
  scheduleStatusLabels,
  scheduleTypeLabels,
} from "@/features/schedule/types/scheduleLabels";
import { Schedule, ScheduleFormData } from "@/features/schedule/types/Schedule";

interface ScheduleFormProps {
  initialData?: Schedule;
  isEditing?: boolean;
  initialDate?: string | null;
  onClose?: () => void; // 모달 닫기 함수 추가
}

export default function ScheduleForm({
  initialData,
  isEditing = false,
  initialDate = null,
  onClose,
}: ScheduleFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [departments, setDepartments] = useState<
    { id: number; departmentName: string }[]
  >([]);
  const [formData, setFormData] = useState<ScheduleFormData>(() => {
    const baseDate = initialDate ? new Date(initialDate) : new Date();
    // 시작 시간을 09:00으로 설정
    const startDate = new Date(baseDate);
    startDate.setHours(9, 0, 0, 0);

    // 종료 시간을 10:00으로 설정
    const endDate = new Date(baseDate);
    endDate.setHours(10, 0, 0, 0);

    return initialData
      ? {
          title: initialData.title,
          description: initialData.description,
          memo: initialData.memo,
          startTime: initialData.startTime,
          endTime: initialData.endTime,
          scheduleType: initialData.scheduleType,
          scheduleStatus: initialData.scheduleStatus,
          departmentId: initialData.departmentId,
          postId: initialData.postId,
        }
      : {
          title: "",
          description: "",
          memo: "",
          startTime: formatScheduleTime(startDate),
          endTime: formatScheduleTime(endDate),
          scheduleType: ScheduleType.PERSONAL, // 기본값은 개인 일정
          scheduleStatus: ScheduleStatus.NONE, // 기본값을 없음으로 설정
          departmentId: undefined,
          postId: undefined,
        };
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // 폼 입력값 변경 처리
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target; // 부서ID는 숫자로 변환
    if (name === "departmentId") {
      setFormData({
        ...formData,
        departmentId: value ? parseInt(value) : undefined,
      });
    } else if (name === "scheduleStatus") {
      setFormData({
        ...formData,
        scheduleStatus: value as ScheduleStatus,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // 일정 유형 변경 처리
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as ScheduleType;

    // 개인 일정이면 부서 ID 초기화
    if (value === ScheduleType.PERSONAL) {
      setFormData({
        ...formData,
        scheduleType: value,
        departmentId: undefined,
      });
    } else {
      setFormData({
        ...formData,
        scheduleType: value,
      });
    }
  };

  // 폼 제출 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null); // 일정 시간 유효성 검증
    const startTime = new Date(formData.startTime);
    const endTime = new Date(formData.endTime);

    if (endTime <= startTime) {
      setError("종료 시간은 시작 시간보다 이후여야 합니다.");
      setLoading(false);
      return;
    }

    // 타이틀 길이 제한 검증
    if (formData.title.length > 100) {
      setError("일정 제목은 100자를 초과할 수 없습니다.");
      setLoading(false);
      return;
    }

    try {
      if (isEditing && initialData) {
        // 일정 수정
        await scheduleService.updateSchedule(initialData.id, formData);
        setSuccess("일정이 성공적으로 수정되었습니다.");

        setTimeout(() => {
          if (onClose) {
            onClose();
            router.refresh(); // 페이지 새로고침하여 캘린더 업데이트
          } else {
            router.push("/schedule");
          }
        }, 1500);
      } else {
        // 일정 생성
        await scheduleService.createSchedule(formData);
        setSuccess("새 일정이 성공적으로 생성되었습니다.");

        setTimeout(() => {
          if (onClose) {
            onClose();
            router.refresh(); // 페이지 새로고침하여 캘린더 업데이트
          } else {
            router.push("/schedule");
          }
        }, 1500);
      }
    } catch (error) {
      console.error("일정 저장에 실패했습니다", error);
      setError("일정 저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl p-6 shadow-lg overflow-hidden"
    >
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl shadow-sm animate-fade-in flex items-center group hover:bg-red-100 transition-all duration-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2 text-red-500 group-hover:scale-110 transition-transform duration-300"
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

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl shadow-sm animate-fade-in flex items-center group hover:bg-green-100 transition-all duration-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2 text-green-500 group-hover:scale-110 transition-transform duration-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {success}
        </div>
      )}

      <div className="mb-5 relative group">
        <label
          htmlFor="title"
          className="block text-sm font-medium text-purple-600 mb-2 flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1.5 group-hover:scale-110 transition-transform duration-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          일정 제목 <span className="text-red-500 ml-0.5">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full border border-purple-200 rounded-xl px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all hover:border-purple-300 bg-white/50 backdrop-blur-sm"
          placeholder="일정 제목을 입력하세요"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <div className="space-y-2 relative group">
          <label
            htmlFor="startTime"
            className="block text-sm font-medium text-purple-600 mb-1.5 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1.5 group-hover:scale-110 transition-transform duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            시작 시간 <span className="text-red-500 ml-0.5">*</span>
          </label>
          <input
            type="datetime-local"
            id="startTime"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            required
            className="w-full border border-purple-200 rounded-xl px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all hover:border-purple-300 bg-white/50 backdrop-blur-sm"
          />
        </div>

        <div className="space-y-2 relative group">
          <label
            htmlFor="endTime"
            className="block text-sm font-medium text-purple-600 mb-1.5 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1.5 group-hover:scale-110 transition-transform duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            종료 시간 <span className="text-red-500 ml-0.5">*</span>
          </label>
          <input
            type="datetime-local"
            id="endTime"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            required
            className="w-full border border-purple-200 rounded-xl px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all hover:border-purple-300 bg-white/50 backdrop-blur-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <div className="space-y-2 relative group">
          <label
            htmlFor="scheduleType"
            className="block text-sm font-medium text-purple-600 mb-1.5 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1.5 group-hover:scale-110 transition-transform duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
              />
            </svg>
            일정 유형
          </label>
          <div className="relative">
            <select
              id="scheduleType"
              name="scheduleType"
              value={formData.scheduleType}
              onChange={handleTypeChange}
              className="w-full border border-purple-200 rounded-xl px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all bg-white/50 appearance-none cursor-pointer pr-10"
            >
              {Object.entries(scheduleTypeLabels).map(([type, label]) => (
                <option key={type} value={type}>
                  {label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
              <svg
                className="fill-current h-4 w-4 text-purple-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="space-y-2 relative group">
          <label
            htmlFor="scheduleStatus"
            className="block text-sm font-medium text-purple-600 mb-1.5 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1.5 group-hover:scale-110 transition-transform duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            일정 상태
          </label>
          <div className="relative">
            <select
              id="scheduleStatus"
              name="scheduleStatus"
              value={formData.scheduleStatus}
              onChange={handleChange}
              className="w-full border border-purple-200 rounded-xl px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all bg-white/50 appearance-none cursor-pointer pr-10"
            >
              {Object.entries(scheduleStatusLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
              <svg
                className="fill-current h-4 w-4 text-purple-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {formData.scheduleType === ScheduleType.DEPARTMENT && (
        <div className="mb-5 space-y-2 relative group animate-fade-in">
          <label
            htmlFor="departmentId"
            className="block text-sm font-medium text-purple-600 mb-1.5 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1.5 group-hover:scale-110 transition-transform duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            부서 <span className="text-red-500 ml-0.5">*</span>
          </label>
          <div className="relative">
            <select
              id="departmentId"
              name="departmentId"
              value={formData.departmentId || ""}
              onChange={handleChange}
              required={formData.scheduleType === ScheduleType.DEPARTMENT}
              className="w-full border border-purple-200 rounded-xl px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all bg-white/50 cursor-pointer appearance-none pr-10"
            >
              <option value="">부서를 선택하세요</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.departmentName}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
              <svg
                className="fill-current h-4 w-4 text-purple-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>
      )}

      <div className="mb-5 space-y-2 relative group">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-purple-600 mb-1.5 flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1.5 group-hover:scale-110 transition-transform duration-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          일정 설명
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full border border-purple-200 rounded-xl px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all bg-white/50 backdrop-blur-sm resize-none"
          placeholder="일정에 대한 설명을 입력하세요"
        />
      </div>

      <div className="mb-6 space-y-2 relative group">
        <label
          htmlFor="memo"
          className="block text-sm font-medium text-purple-600 mb-1.5 flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1.5 group-hover:scale-110 transition-transform duration-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          메모
        </label>
        <textarea
          id="memo"
          name="memo"
          value={formData.memo}
          onChange={handleChange}
          rows={3}
          className="w-full border border-purple-200 rounded-xl px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all bg-white/50 backdrop-blur-sm resize-none"
          placeholder="추가 메모사항을 입력하세요"
        />
      </div>

      <div className="flex flex-wrap sm:flex-nowrap justify-end space-x-0 sm:space-x-3 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={onClose || (() => router.push("/schedule"))}
          className="w-full sm:w-auto mb-2 sm:mb-0 px-5 py-2.5 text-sm font-medium border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 hover:shadow-md transition-all duration-200 flex items-center justify-center"
          disabled={loading}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          취소
        </button>
        <button
          type="submit"
          className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium bg-purple-600 text-white rounded-xl hover:bg-purple-700 focus:ring-4 focus:ring-purple-200 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center disabled:opacity-50"
          disabled={loading}
        >
          {loading ? (
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
              {isEditing ? "수정 중..." : "등록 중..."}
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {isEditing ? "수정하기" : "등록하기"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
