"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { scheduleService } from "../services/scheduleService";
import { ScheduleType, ScheduleStatus } from "../types/Enums";
import { scheduleStatusLabels } from "../constants/scheduleLabels";
import { Schedule, ScheduleFormData } from "../types/Schedule";

interface ScheduleFormProps {
  initialData?: Schedule;
  isEditing?: boolean;
}

export default function ScheduleForm({
  initialData,
  isEditing = false,
}: ScheduleFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [departments, setDepartments] = useState<
    { id: number; departmentName: string }[]
  >([]);
  const [formData, setFormData] = useState<ScheduleFormData>({
    title: "",
    description: "",
    startTime: new Date().toISOString().slice(0, 16), // 현재 시간으로 초기화
    endTime: new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16), // 1시간 후로 초기화
    memo: "",
    scheduleType: ScheduleType.PERSONAL,
    scheduleStatus: ScheduleStatus.IMPORTANT_MEETING,
    postId: null,
    departmentId: null,
  });
  // 부서 목록 가져오기
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const departmentsData = await scheduleService.getDepartments();
        setDepartments(departmentsData);
      } catch (error) {
        console.error("부서 목록을 불러오는데 실패했습니다", error);
      }
    };

    fetchDepartments();
  }, []);

  // 초기 데이터 설정
  useEffect(() => {
    if (initialData) {
      // ISO 문자열을 입력 필드에 맞는 형식으로 변환
      const startTime = initialData.startTime.slice(0, 16);
      const endTime = initialData.endTime.slice(0, 16);

      setFormData({
        ...initialData,
        startTime,
        endTime,
      });
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditing && initialData) {
        // 일정 수정 - 일정 타입에 따라 다른 API 호출
        if (
          formData.scheduleType === ScheduleType.COMPANY ||
          formData.scheduleType === ScheduleType.DEPARTMENT
        ) {
          // 관리자가 회사/부서 일정 수정
          await scheduleService.updateScheduleAdmin(initialData.id, formData);
        } else {
          // 개인 일정 수정
          await scheduleService.updateSchedule(initialData.id, formData);
        }
      } else {
        // 일정 생성 - 일정 타입에 따라 다른 API 호출
        if (formData.scheduleType === ScheduleType.COMPANY) {
          await scheduleService.createCompanySchedule(formData);
        } else if (
          formData.scheduleType === ScheduleType.DEPARTMENT &&
          formData.departmentId
        ) {
          await scheduleService.createDepartmentSchedule(formData);
        } else {
          await scheduleService.createSchedule(formData);
        }
      }
      router.push("/schedule");
    } catch (error) {
      console.error("일정 저장 중 오류가 발생했습니다", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          제목
        </label>
        <input
          type="text"
          name="title"
          required
          value={formData.title}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          일정 유형
        </label>{" "}
        <select
          name="scheduleType"
          value={formData.scheduleType}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2"
        >
          <option value={ScheduleType.PERSONAL}>개인 일정</option>
          <option value={ScheduleType.DEPARTMENT}>부서 일정</option>
          <option value={ScheduleType.COMPANY}>회사 일정</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          일정 상태
        </label>{" "}
        <select
          name="scheduleStatus"
          value={formData.scheduleStatus}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2"
        >
          <option value={ScheduleStatus.IMPORTANT_MEETING}>중요회의</option>
          <option value={ScheduleStatus.BUSINESS_TRIP}>출장</option>
          <option value={ScheduleStatus.COMPLETED}>일정완료</option>
          <option value={ScheduleStatus.CANCELED}>일정취소</option>
          <option value={ScheduleStatus.VACATION}>휴가</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            시작 시간
          </label>
          <input
            type="datetime-local"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            종료 시간
          </label>
          <input
            type="datetime-local"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          설명
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full border border-gray-300 rounded-md p-2"
        ></textarea>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          메모
        </label>
        <textarea
          name="memo"
          value={formData.memo}
          onChange={handleChange}
          rows={4}
          className="w-full border border-gray-300 rounded-md p-2"
        ></textarea>
      </div>{" "}
      {formData.scheduleType === ScheduleType.DEPARTMENT && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            부서 선택
          </label>
          <select
            name="departmentId"
            value={formData.departmentId || ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          >
            <option value="">부서 선택</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.departmentName}
              </option>
            ))}
          </select>
        </div>
      )}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-sm border border-gray-300 rounded-md"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md disabled:bg-blue-300"
        >
          {loading ? "저장 중..." : isEditing ? "수정하기" : "등록하기"}
        </button>
      </div>
    </form>
  );
}
