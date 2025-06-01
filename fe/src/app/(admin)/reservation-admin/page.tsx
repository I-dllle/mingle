// app/(admin)/room/page.tsx
import React from "react";
import ReservationAdminPage from "@/features/reservation/components/ReservationAdminPage";

export const metadata = { title: "룸 예약 관리" };

export default function ReservationAdminRoute() {
  return <ReservationAdminPage />;
}
