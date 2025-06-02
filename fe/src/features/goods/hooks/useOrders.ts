import { useState, useEffect } from "react";
import { GoodsOrder } from "../types/Order";
import { orderService } from "../services/orderService";

export function useOrders() {
  const [orders, setOrders] = useState<GoodsOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      console.log("주문내역 가져오기 시작");
      setLoading(true);
      setError(null);
      const data = await orderService.getOrders();
      console.log("API 응답 데이터:", data);

      // 데이터 형식 검증
      if (!Array.isArray(data)) {
        console.error("API 응답이 배열이 아닙니다:", data);
        throw new Error("주문내역 데이터 형식이 올바르지 않습니다.");
      }

      // 각 주문 데이터 검증
      data.forEach((order, index) => {
        console.log(`주문 ${index + 1} 데이터:`, order);
        if (!order.orderId || !order.goods) {
          console.error(`주문 ${index + 1} 데이터 누락:`, order);
        }
      });

      setOrders(data);
    } catch (err) {
      console.error("주문내역 가져오기 실패:", err);
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId: string) => {
    try {
      console.log("주문 취소 시작:", orderId);
      await orderService.cancelOrder(orderId);
      console.log("주문 취소 성공, 목록 새로고침");
      await fetchOrders();
      return true;
    } catch (err) {
      console.error("주문 취소 실패:", err);
      setError(
        err instanceof Error ? err.message : "주문 취소에 실패했습니다."
      );
      return false;
    }
  };

  useEffect(() => {
    console.log("useOrders 훅 마운트");
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
