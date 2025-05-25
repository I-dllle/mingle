"use client";

import { Suspense } from "react";
import CalendarView from "@/features/schedule/components/CalendarView";

export default function SchedulePage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Suspense fallback={<div>Loading calendar...</div>}>
        <CalendarView />
      </Suspense>
    </div>
  );
}
