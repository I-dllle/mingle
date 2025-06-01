"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { reservationService } from "@/features/reservation/services/reservationService";
import { ReservationForm } from "@/features/reservation/components/ReservationForm";
import { Reservation } from "@/features/reservation/types/reservation";

export default function EditReservationPage({
  params,
}: {
  params: { reservationId: string };
}) {
  const router = useRouter();
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const data = await reservationService.getById(
          parseInt(params.reservationId)
        );
        setReservation(data);
      } catch (err) {
        setError("예약 정보를 불러오는데 실패했습니다.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservation();
  }, [params.reservationId]);

  const handleCancel = () => {
    router.back();
  };

  const handleSubmit = async (formData: any) => {
    if (!reservation) return;

    try {
      await reservationService.update(reservation.id, formData);
      router.refresh(); // 데이터 새로고침
      router.back(); // 모달 닫기
    } catch (err) {
      console.error("예약 수정 실패:", err);
      setError("예약 수정에 실패했습니다.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium">예약 수정</h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="p-4 text-red-500">{error}</div>
        ) : reservation ? (
          <ReservationForm
            initial={reservation}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        ) : (
          <div className="p-4">예약 정보를 찾을 수 없습니다.</div>
        )}
      </div>
    </div>
  );
}
