import React from "react";
import type { Goods } from "../types/Goods";
import GoodsCard from "./GoodsCard";

interface GoodsGridProps {
  goods: Goods[];
  isAdmin?: boolean;
  onEdit?: (goods: Goods) => void;
  onDelete?: (goods: Goods) => void;
  searchQuery?: string;
  isSearching?: boolean;
}

const GoodsGrid: React.FC<GoodsGridProps> = ({
  goods,
  isAdmin,
  onEdit,
  onDelete,
  searchQuery = "",
  isSearching = false,
}) => {
  if (isSearching || searchQuery) {
    if (goods.length === 0) {
      return (
        <div className="text-center text-gray-400 py-12">
          <div className="text-lg mb-2">검색 결과가 없습니다</div>
          <div className="text-sm">
            '{searchQuery}' 와 일치하는 상품을 찾을 수 없습니다.
          </div>
        </div>
      );
    }

    return (
      <div className="w-full">
        <section>
          <h2 className="text-lg font-bold mb-4">
            검색 결과 ({goods.length}개)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {goods.map((g) => (
              <GoodsCard
                key={g.id}
                goods={g}
                isAdmin={isAdmin}
                onEdit={() => onEdit?.(g)}
                onDelete={() => onDelete?.(g)}
              />
            ))}
          </div>
        </section>
      </div>
    );
  }

  const latestGoods = goods.slice(0, 4);

  if (goods.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">
        등록된 상품이 없습니다.
      </div>
    );
  }

  return (
    <div className="w-full">
      <section className="mb-8">
        <h2 className="text-lg font-bold mb-4">신규 출시 굿즈</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {latestGoods.map((g) => (
            <GoodsCard
              key={g.id}
              goods={g}
              isNew={true}
              isAdmin={isAdmin}
              onEdit={() => onEdit?.(g)}
              onDelete={() => onDelete?.(g)}
            />
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-lg font-bold mb-4">전체 상품</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {goods.map((g) => (
            <GoodsCard
              key={g.id}
              goods={g}
              isAdmin={isAdmin}
              onEdit={() => onEdit?.(g)}
              onDelete={() => onDelete?.(g)}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default GoodsGrid;
