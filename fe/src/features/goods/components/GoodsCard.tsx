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

  const handlePurchase = () => {
    window.location.href = `/api/v1/goodsOrder/payment/${goods.id}`;
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center relative">
      <img
        src={goods.imgUrl[0]}
        alt={goods.itemName}
        className="w-40 h-40 object-cover rounded-lg mb-3"
      />
      <div className="w-full flex flex-col items-center">
        <h3 className="font-semibold text-base mb-1 text-center line-clamp-1">
          {goods.itemName}
        </h3>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-gray-400 line-through text-sm">
            {originalPrice.toLocaleString()}원
          </span>
          <span className="text-lg font-bold text-pink-600">
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
