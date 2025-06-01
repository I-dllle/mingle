import { api } from "@/lib/api";
import type { Goods } from "../types/Goods";

export interface CreateOrderRequest {
  goods: Goods;
  purAmount: number;
  amount: number;
  purMethod: "TOSS";
}

export async function createOrder(req: CreateOrderRequest) {
  const response = await api.post("/api/v1/goodsOrder/api/orders", req);
  return response.data; // 주문 정보 반환
}

export async function confirmPayment(
  paymentKey: string,
  orderId: string,
  amount: number
) {
  const response = await api.post("/api/v1/goodsOrder/confirm", {
    paymentKey,
    orderId,
    amount,
  });
  return response.data;
}
