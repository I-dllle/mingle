import React from "react";
import { GoodsOrder } from "../types/Order";
import OrderCard from "./OrderCard";
import { useRouter } from "next/navigation";

interface OrdersListProps {
  orders: GoodsOrder[];
  loading: boolean;
  error: string | null;
  onCancel: (orderId: string) => void;
  onClearError: () => void;
}

export default function OrdersList({
  orders,
  loading,
  error,
  onCancel,
  onClearError,
}: OrdersListProps) {
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800 mb-4">{error}</p>
          <button
            onClick={onClearError}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <svg
            className="w-8 h-8 text-purple-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6"
            />
          </svg>
          <h1 className="text-3xl font-bold text-gray-900">주문내역</h1>
        </div>
        <button
          onClick={() => router.push("/goods")}
          className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition-colors"
        >
          쇼핑 계속하기
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <svg
            className="mx-auto h-24 w-24 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            주문내역이 없습니다
          </h3>
          <p className="mt-2 text-gray-500">
            아직 주문한 상품이 없습니다. 상품을 둘러보세요!
          </p>
          <button
            onClick={() => router.push("/goods")}
            className="mt-6 bg-purple-500 text-white px-6 py-2 rounded-md hover:bg-purple-600 transition-colors"
          >
            상품 보러가기
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} onCancel={onCancel} />
          ))}
        </div>
      )}
    </div>
  );
}
