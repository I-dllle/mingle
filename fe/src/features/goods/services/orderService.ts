import { GoodsOrder } from "../types/Order";
import { api } from "@/lib/api";

export class OrderService {
  async getOrders(): Promise<GoodsOrder[]> {
    try {
      console.log("주문내역 조회 API 호출");
      const response = await api.get("/api/v1/goodsOrder/orders");
      console.log("주문내역 조회 결과:", response.data);
      return response.data;
    } catch (error) {
      console.error("주문내역 조회 실패:", error);
      throw error;
    }
  }

  async cancelOrder(orderId: string): Promise<void> {
    try {
      console.log("주문 취소 API 호출:", orderId);
      const response = await api.delete(`/api/v1/goodsOrder/orders/${orderId}`);
      console.log("주문 취소 결과:", response.data);
      return response.data;
    } catch (error) {
      console.error("주문 취소 실패:", error);
      throw error;
    }
  }
}

export const orderService = new OrderService();
