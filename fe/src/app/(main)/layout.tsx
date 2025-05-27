"use client";

import React from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Root Layout을 그대로 사용하고, 추가 레이아웃은 적용하지 않음
  return <>{children}</>;
}
