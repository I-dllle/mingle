import { useState, useEffect } from "react";
import { GoodsOrder } from "../types/Order";
import { orderService } from "../services/orderService";

export function useOrders() {
  const [orders, setOrders] = useState<GoodsOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await orderService.getOrders();
      setOrders(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId: string) => {
    try {
      await orderService.cancelOrder(orderId);
      // 주문 취소 후 목록 새로고침
      await fetchOrders();
      return true;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "주문 취소에 실패했습니다."
      );
      return false;
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
}
