// features/schedule/components/calendar/ActivitySummary.tsx
"use client";

import React, { useEffect, useState } from "react";
import { scheduleService } from "@/features/schedule/services/scheduleService";
import { ScheduleType, ScheduleStatus } from "@/features/schedule/types/Enums";
import { scheduleStatusLabels } from "@/features/schedule/constants/scheduleLabels";
import { FooterCard } from "@/features/schedule/components/ui/FooterCard";

type Counts = Record<ScheduleStatus, number>;

interface Props {
  view?: "monthly" | "weekly" | "daily";
  scheduleType?: ScheduleType | "all";
  date?: Date; // 추가!
}

export default function ActivitySummary({
  view = "monthly",
  scheduleType = "all",
  date, // 받아온 date
}: Props) {
  const [counts, setCounts] = useState<Counts>({} as Counts);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const base = date ?? new Date(); // 오늘 대신 넘겨받은 date 사용
        const queryDate =
          view === "monthly"
            ? new Date(base.getFullYear(), base.getMonth(), 1)
            : base;
        const typeArg = scheduleType === "all" ? undefined : scheduleType;

        const events =
          view === "monthly"
            ? await scheduleService.getMonthlySchedules(queryDate, typeArg)
            : view === "weekly"
            ? await scheduleService.getWeeklyView(queryDate, typeArg)
            : await scheduleService.getDailyView(queryDate, typeArg);

        const c: Counts = {} as Counts;
        Object.values(ScheduleStatus).forEach((s) => (c[s] = 0));
        events.forEach((e) => {
          const s = e.scheduleStatus as ScheduleStatus;
          c[s] = (c[s] || 0) + 1;
        });
        setCounts(c);
      } catch (e) {
        console.error("활동기록 불러오기 실패", e);
        setError("활동기록을 가져오지 못했습니다.");
      }
    }
    load();
  }, [view, scheduleType, date]);

  const statuses = Object.values(ScheduleStatus);
  const title = `활동 기록 (${view})`;

  if (error) {
    return (
      <FooterCard
        title={title}
        count={0}
        className="bg-red-50 border-red-200"
      />
    );
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {statuses.map((status) => (
        <FooterCard
          key={status}
          title={scheduleStatusLabels[status]}
          count={counts[status] ?? 0}
        />
      ))}
    </div>
  );
}
