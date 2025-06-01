"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { reservationService } from "@/features/reservation/services/reservationService";
import { ReservationDetail } from "@/features/reservation/components/ReservationDetail";
import { Reservation } from "@/features/reservation/types/Reservation";
// Modal 컴포넌트를 직접 사용하는 대신 인라인으로 모달 레이아웃 구현

export default function ReservationDetailPage({
  params,
}: {
  params: { reservationId: string };
}) {
  const router = useRouter();
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 현재 사용자 ID (실제로는 인증에서 가져와야 함)
  const currentUserId = 1; // 임시 ID

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

  const handleClose = () => {
    router.back();
  };

  const handleEdit = () => {
    router.push(`/reservation/${params.reservationId}/edit`);
  };

  const handleCancel = async () => {
    if (!reservation) return;

    try {
      await reservationService.cancel(reservation.id);
      router.refresh(); // 데이터 새로고침
      router.back(); // 모달 닫기
    } catch (err) {
      console.error("예약 취소 실패:", err);
      setError("예약 취소에 실패했습니다.");
    }
  };
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="p-4 text-red-500">{error}</div>
        ) : reservation ? (
          <ReservationDetail
            reservation={reservation}
            isMine={reservation.userId === currentUserId}
            onClose={handleClose}
            onEdit={handleEdit}
            onCancel={handleCancel}
          />
        ) : (
          <div className="p-4">예약 정보를 찾을 수 없습니다.</div>
        )}
      </div>
    </div>
  );
}
