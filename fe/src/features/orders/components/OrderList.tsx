import { GoodsOrder } from "../types/Order";
import OrderCard from "./OrderCard";

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
  // 로딩 상태 표시
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // 에러 상태 표시
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800 mb-4">{error}</p>
          <button onClick={onClearError}>다시 시도</button>
        </div>
      </div>
    );
  }

  // 주문내역이 없는 경우
  if (orders.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="mt-4 text-lg font-medium text-gray-900">
          주문내역이 없습니다
        </h3>
        <p className="mt-2 text-gray-500">
          아직 주문한 상품이 없습니다. 상품을 둘러보세요!
        </p>
      </div>
    );
  }

  // 주문내역 표시
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="space-y-6">
        {orders.map((order) => (
          <OrderCard key={order.orderId} order={order} onCancel={onCancel} />
        ))}
      </div>
    </div>
  );
}
