import { GoodsOrder } from "../types/Order";

export class OrderService {
  private baseUrl = "/api/v1/goodsOrder";

  async getOrders(): Promise<GoodsOrder[]> {
    const response = await fetch(`${this.baseUrl}/orders`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("주문내역을 불러오는데 실패했습니다.");
    }

    return response.json();
  }

  async cancelOrder(orderId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/orders/${orderId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "주문 취소에 실패했습니다.");
    }
  }
}

export const orderService = new OrderService();
