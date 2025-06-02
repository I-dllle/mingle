"use client";

import React from "react";
import { useOrders } from "@/features/goods/hooks/useOrders";
import OrdersList from "@/features/goods/components/OrdersList";

export default function OrdersPage() {
  const { orders, loading, error, cancelOrder, clearError } = useOrders();

  const handleCancelOrder = async (orderId: string) => {
    const success = await cancelOrder(orderId);
    if (success) {
      alert("주문이 취소되었습니다.");
    } else {
      alert("주문 취소에 실패했습니다.");
    }
  };

  const handleClearError = () => {
    clearError();
    window.location.reload(); // 페이지 새로고침으로 다시 시도
  };

  return (
    <OrdersList
      orders={orders}
      loading={loading}
      error={error}
      onCancel={handleCancelOrder}
      onClearError={handleClearError}
    />
  );
}
