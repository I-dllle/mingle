import React from "react";
import type { Goods } from "../types/Goods";

interface GoodsBannerProps {
  goods?: Goods;
}

const GoodsBanner: React.FC<GoodsBannerProps> = ({ goods }) => {
  return (
    <div className="w-full h-36 bg-gray-100 rounded-xl flex items-end overflow-hidden mb-8 relative">
      {/* 흰색 네모칸 */}
      <div className="w-full h-full bg-white rounded-xl" />
      {/* 고정 문구 */}
      <div className="absolute left-8 bottom-6 text-left">
        <div className="text-2xl font-bold text-gray-900 mb-1">
          직원 전용 할인 굿즈샵
        </div>
        <div className="text-sm text-gray-700">
          소속 아티스트 공식 굿즈를 특별 할인가로 만나보세요
        </div>
      </div>
    </div>
  );
};

export default GoodsBanner;
