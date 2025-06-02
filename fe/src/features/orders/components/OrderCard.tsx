import { GoodsOrder } from "../types/Order";

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("ko-KR");
};

interface OrderCardProps {
  order: GoodsOrder;
  onCancel: (orderId: string) => void;
}

export default function OrderCard({ order, onCancel }: OrderCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* 상품 이미지 */}
        <div className="flex-shrink-0">
          <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
            {order.goods.imgUrl ? (
              <img src={order.goods.imgUrl} alt={order.goods.itemName} />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <svg>...</svg>
              </div>
            )}
          </div>
        </div>

        {/* 주문 정보 */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-gray-900">
              {order.goods.itemName}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
              <div>주문일: {formatDate(order.orderedAt)}</div>
              <div>수량: {order.purAmount}개</div>
              {/* 추가 주문 정보 */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
