export interface GoodsOrder {
  id: number;
  orderId: string;
  paymentKey: string;
  purAmount: number;
  amount: number;
  purStatus: "PENDING" | "PAID" | "FAILED" | "CANCELED";
  purDeliveryStatus: "PREPARING" | "SHIPPED" | "DELIVERED";
  orderedAt: string;
  paidAt?: string;
  goods: {
    id: number;
    itemName: string;
    itemPrice: number;
    imgUrl?: string;
  };
}

export const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PAID: "bg-green-100 text-green-800",
  FAILED: "bg-red-100 text-red-800",
  CANCELED: "bg-gray-100 text-gray-800",
} as const;

export const statusLabels = {
  PENDING: "결제 대기",
  PAID: "결제 완료",
  FAILED: "결제 실패",
  CANCELED: "주문 취소",
} as const;

export const deliveryStatusLabels = {
  PREPARING: "배송 준비중",
  SHIPPED: "배송중",
  DELIVERED: "배송 완료",
} as const;
