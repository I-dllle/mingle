// app/(admin)/room/page.tsx
import React from "react";
import RoomAdminPage from "@/features/room/components/admin/RoomAdminPage";

export const metadata = { title: "회의실/연습실 관리" };

export default function RoomAdminRoute() {
  return <RoomAdminPage />;
}
