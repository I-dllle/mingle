import React from "react";
import {
  GoodsOrder,
  statusLabels,
  statusColors,
  deliveryStatusLabels,
} from "../types/Order";

interface OrderCardProps {
  order: GoodsOrder;
  onCancel: (orderId: string) => void;
}

export default function OrderCard({ order, onCancel }: OrderCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR").format(price);
  };

  const handleCancel = () => {
    if (confirm("정말로 이 주문을 취소하시겠습니까?")) {
      onCancel(order.orderId);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* 상품 이미지 */}
        <div className="flex-shrink-0">
          <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
            {order.goods.imgUrl ? (
              <img
                src={order.goods.imgUrl}
                alt={order.goods.itemName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* 주문 정보 */}
        <div className="flex-1">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-gray-900">
                {order.goods.itemName}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V19a2 2 0 002 2h4a2 2 0 002-2V7m-6 0h6"
                    />
                  </svg>
                  주문일: {formatDate(order.orderedAt)}
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  수량: {order.purAmount}개
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  결제금액: {formatPrice(order.amount)}원
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  주문상태: {statusLabels[order.purStatus]}
                </div>
                {order.paidAt && (
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    결제일: {formatDate(order.paidAt)}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                    />
                  </svg>
                  배송상태: {deliveryStatusLabels[order.purDeliveryStatus]}
                </div>
              </div>
            </div>
            {order.purStatus === "PAID" &&
              order.purDeliveryStatus === "PREPARING" && (
                <button
                  onClick={handleCancel}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                >
                  주문 취소
                </button>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
