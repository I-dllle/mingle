// features/schedule/ui/FooterCard.tsx
"use client";

import React from "react";

export interface FooterCardProps {
  title: string;
  count: number;
  className?: string;
}

export function FooterCard({ title, count, className = "" }: FooterCardProps) {
  return (
    <div className={`border rounded-lg p-4 bg-white shadow ` + className}>
      <div className="font-medium text-gray-500 mb-2">{title}</div>
      <div className="text-3xl font-bold">{count}개</div>
    </div>
  );
}
