import { useState, useEffect } from "react";
import { GoodsOrder } from "@/features/goods/types/Order";
import { orderService } from "@/features/goods/services/orderService";

export const useOrders = () => {
  const [orders, setOrders] = useState<GoodsOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await orderService.getOrders();
      console.log("주문 내역 데이터:", data);
      setOrders(data);
    } catch (err) {
      console.error("주문 내역 조회 실패:", err);
      setError("주문 내역을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId: string) => {
    try {
      await orderService.cancelOrder(orderId);
      await fetchOrders();
    } catch (err) {
      console.error("주문 취소 실패:", err);
      setError("주문 취소에 실패했습니다.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    orders,
    loading,
    error,
    fetchOrders,
    cancelOrder,
    clearError: () => setError(null),
  };
};
