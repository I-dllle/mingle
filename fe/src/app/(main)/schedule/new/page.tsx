"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ScheduleForm from "@/features/schedule/components/ScheduleForm";

export default function NewSchedulePage() {
  const searchParams = useSearchParams();
  const [initialDate, setInitialDate] = useState<string | null>(null);

  useEffect(() => {
    // URL에서 날짜 파라미터 가져오기
    const date = searchParams.get("date");
    if (date) {
      setInitialDate(date);
    }
  }, [searchParams]);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">새 일정 등록</h1>
        <ScheduleForm />
      </div>
    </div>
  );
}
