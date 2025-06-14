"use client";

import React from "react";
import OvertimeReportForm from "@/features/attendance/components/request/OvertimeReportForm";

export default function OvertimePage() {
  return (
    <div className="container mx-auto py-8">
      <div className="bg-white rounded-lg shadow-sm">
        <OvertimeReportForm />
      </div>
    </div>
  );
}
