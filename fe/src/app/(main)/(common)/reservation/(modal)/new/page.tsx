"use client";

import { useRouter } from "next/navigation";
import { ReservationForm } from "@/features/reservation/components/ReservationForm";
import { reservationService } from "@/features/reservation/services/reservationService";

export default function NewReservationPage() {
  const router = useRouter();

  const handleCancel = () => {
    router.back();
  };

  const handleSubmit = async (formData: any) => {
    try {
      await reservationService.create(formData);
      router.refresh(); // 데이터 새로고침
      router.back(); // 모달 닫기
    } catch (err) {
      console.error("예약 생성 실패:", err);
      alert("예약 등록에 실패했습니다.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium">새 예약 등록</h2>
        </div>
        <ReservationForm
          initial={{}}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
