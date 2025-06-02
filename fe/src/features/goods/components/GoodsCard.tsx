import React, { useState } from "react";
import { Goods, PaymentMethod } from "../types/Goods";
import { api } from "@/lib/api";

interface GoodsCardProps {
  goods: Goods;
  isAdmin?: boolean;
  isNew?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

const createOrder = async ({
  goods,
  purAmount,
  amount,
  purMethod,
}: {
  goods: Goods;
  purAmount: number;
  amount: number;
  purMethod: PaymentMethod;
}) => {
  try {
    const response = await api.post("/api/v1/goodsOrder/api/orders", {
      goods: {
        id: goods.id,
        // ,
        // itemName: goods.itemName,
        // itemPrice: goods.itemPrice,
        // imgUrl: goods.imgUrl,
        // description: goods.description,
        // isActive: goods.isActive,
      },
      purAmount,
      amount,
      purMethod,
      orderId: crypto.randomUUID(),
    });
    return response.data;
  } catch (error) {
    console.error("주문 생성 실패:", error);
    throw error;
  }
};

const GoodsCard: React.FC<GoodsCardProps> = ({
  goods,
  isAdmin,
  isNew,
  onEdit,
  onDelete,
}) => {
  const [paymentInfo, setPaymentInfo] = useState<null | {
    orderId: string;
    amount: number;
    itemName: string;
  }>(null);

  const originalPrice = Math.round(goods.itemPrice / 0.6);

  const handlePurchase = async () => {
    try {
      const orderRes = await createOrder({
        goods,
        purAmount: 1, // 기본 1개
        amount: goods.itemPrice,
        purMethod: PaymentMethod.TOSS,
      });
      // 결제창을 팝업으로 띄움!
      window.open(
        `http://localhost:8080/api/v1/goodsOrder/payment/${goods.id}?orderId=${orderRes.orderId}`,
        "_blank",
        "width=500,height=700"
      );
    } catch (error) {
      alert("주문 생성에 실패했습니다.");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center relative">
      {goods.imgUrl && goods.imgUrl.length > 0 ? (
        <img
          src={goods.imgUrl[0]}
          alt={goods.itemName}
          className="w-40 h-40 object-cover rounded-lg mb-3"
          onError={(e) => {
            console.error("이미지 로드 실패:", goods.imgUrl[0]);
            e.currentTarget.style.display = "none";
            // 대체 플레이스홀더 표시
            const fallback = document.getElementById(`fallback-${goods.id}`);
            if (fallback) fallback.style.display = "flex";
          }}
        />
      ) : (
        <div className="w-40 h-40 bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
          <span className="text-gray-400 text-sm">이미지 없음</span>
        </div>
      )}

      {/* 이미지 로드 실패 시 표시될 플레이스홀더 */}
      {goods.imgUrl && goods.imgUrl.length > 0 && (
        <div
          className="w-40 h-40 bg-gray-200 rounded-lg mb-3 flex items-center justify-center"
          style={{ display: "none" }}
          id={`fallback-${goods.id}`}
        >
          <span className="text-gray-400 text-sm">이미지 로드 실패</span>
        </div>
      )}
      <div className="w-full flex flex-col items-center">
        <h3 className="font-semibold text-base mb-1 text-center line-clamp-1">
          {goods.itemName}
        </h3>
        <div className="flex flex-col items-center gap-0.5 mb-1">
          <span className="text-gray-400 line-through text-xs">
            {originalPrice.toLocaleString()}원 (정가)
          </span>
          <span className="text-base font-bold text-pink-600">
            {goods.itemPrice.toLocaleString()}원
          </span>
        </div>
        <button
          onClick={handlePurchase}
          className="mt-2 px-4 py-1 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 text-sm"
        >
          구매
        </button>
      </div>
      {isAdmin && (
        <div className="absolute top-2 right-2 flex gap-1">
          <button
            onClick={onEdit}
            className="text-xs px-2 py-1 bg-yellow-200 rounded"
          >
            수정
          </button>
          <button
            onClick={onDelete}
            className="text-xs px-2 py-1 bg-red-200 rounded"
          >
            삭제
          </button>
        </div>
      )}
      {isNew && (
        <span className="absolute top-2 left-2 bg-purple-500 text-white text-xs px-2 py-1 rounded">
          NEW
        </span>
      )}
      {!goods.isActive && (
        <span className="absolute bottom-2 left-2 bg-gray-300 text-gray-700 text-xs px-2 py-1 rounded">
          품절
        </span>
      )}
    </div>
  );
};

export default GoodsCard;
