"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";
import { scheduleService } from "@/features/schedule/services/scheduleService";
import { userService } from "@/features/auth/services/userService";
import { ScheduleType, ScheduleStatus } from "@/features/schedule/types/Enums";
import { scheduleStatusLabels } from "@/features/schedule/constants/scheduleLabels";
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
          startTime: startDate.toISOString().slice(0, 16),
          endTime: endDate.toISOString().slice(0, 16),
          scheduleType: ScheduleType.PERSONAL, // 기본값은 개인 일정
          scheduleStatus: ScheduleStatus.NONE, // 기본값을 없음으로 변경
          departmentId: undefined,
          postId: undefined,
        };
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // 부서 목록 로드
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const data = await scheduleService.getDepartments();
        setDepartments(data);
      } catch (error) {
        console.error("부서 목록을 불러오는데 실패했습니다", error);
      }
    };

    fetchDepartments();
  }, []);

  // 폼 입력값 변경 처리
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    // 부서ID는 숫자로 변환
    if (name === "departmentId") {
      setFormData({
        ...formData,
        departmentId: value ? parseInt(value) : undefined,
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
    setSuccess(null);

    // 일정 시간 유효성 검증
    const startTime = new Date(formData.startTime);
    const endTime = new Date(formData.endTime);

    if (endTime <= startTime) {
      setError("종료 시간은 시작 시간보다 이후여야 합니다.");
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
    <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6">
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded">
          {success}
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
          일정 제목 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="일정 제목을 입력하세요"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label
            htmlFor="startTime"
            className="block text-gray-700 font-medium mb-2"
          >
            시작 시간 <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            id="startTime"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            required
            className="w-full border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="endTime"
            className="block text-gray-700 font-medium mb-2"
          >
            종료 시간 <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            id="endTime"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            required
            className="w-full border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label
            htmlFor="scheduleType"
            className="block text-gray-700 font-medium mb-2"
          >
            일정 유형
          </label>
          <select
            id="scheduleType"
            name="scheduleType"
            value={formData.scheduleType}
            onChange={handleTypeChange}
            className="w-full border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={ScheduleType.PERSONAL}>개인 일정</option>
            <option value={ScheduleType.DEPARTMENT}>부서 일정</option>
            <option value={ScheduleType.COMPANY}>회사 일정</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="scheduleStatus"
            className="block text-gray-700 font-medium mb-2"
          >
            일정 상태
          </label>
          <select
            id="scheduleStatus"
            name="scheduleStatus"
            value={formData.scheduleStatus}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {Object.entries(scheduleStatusLabels).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {formData.scheduleType === ScheduleType.DEPARTMENT && (
        <div className="mb-4">
          <label
            htmlFor="departmentId"
            className="block text-gray-700 font-medium mb-2"
          >
            부서 <span className="text-red-500">*</span>
          </label>
          <select
            id="departmentId"
            name="departmentId"
            value={formData.departmentId || ""}
            onChange={handleChange}
            required={formData.scheduleType === ScheduleType.DEPARTMENT}
            className="w-full border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">부서를 선택하세요</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.departmentName}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="mb-4">
        <label
          htmlFor="description"
          className="block text-gray-700 font-medium mb-2"
        >
          일정 설명
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="일정에 대한 설명을 입력하세요"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="memo" className="block text-gray-700 font-medium mb-2">
          메모
        </label>
        <textarea
          id="memo"
          name="memo"
          value={formData.memo}
          onChange={handleChange}
          rows={3}
          className="w-full border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="추가 메모사항을 입력하세요"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose || (() => router.push("/schedule"))}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          disabled={loading}
        >
          취소
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center">
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
              처리중...
            </span>
          ) : isEditing ? (
            "수정하기"
          ) : (
            "등록하기"
          )}
        </button>
      </div>
    </form>
  );
}
