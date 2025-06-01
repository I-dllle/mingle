import React from "react";
import type { Goods } from "../types/Goods";
import GoodsCard from "./GoodsCard";

interface GoodsGridProps {
  goods: Goods[];
  isAdmin?: boolean;
  onEdit?: (goods: Goods) => void;
  onDelete?: (goods: Goods) => void;
}

const GoodsGrid: React.FC<GoodsGridProps> = ({
  goods,
  isAdmin,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {goods.map((item) => (
        <GoodsCard
          key={item.id}
          goods={item}
          isAdmin={isAdmin}
          onEdit={() => onEdit?.(item)}
          onDelete={() => onDelete?.(item)}
        />
      ))}
    </div>
  );
};

export default GoodsGrid;
