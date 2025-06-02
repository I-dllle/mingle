"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/features/user/auth/hooks/useAuth";
import { useGoods } from "@/hooks/useGoods";
import type { Goods } from "@/features/goods/types/Goods";
import GoodsBanner from "@/features/goods/components/GoodsBanner";
import GoodsSearchBar from "@/features/goods/components/GoodsSearchBar";
import GoodsSortBar from "@/features/goods/components/GoodsSortBar";
import GoodsGrid from "@/features/goods/components/GoodsList";
import GoodsForm from "@/features/goods/components/GoodsForm";

export default function GoodsPage() {
  const { user } = useAuth();
  const { goods, fetchGoodsList, createGoods, updateGoods, deleteGoods } =
    useGoods();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedGoods, setSelectedGoods] = useState<Goods | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("createdAt,desc");

  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    fetchGoodsList(searchQuery, sortOption);
  }, [fetchGoodsList, searchQuery, sortOption]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    fetchGoodsList(query, sortOption);
  };

  const handleSort = (option: string) => {
    setSortOption(option);
    fetchGoodsList(searchQuery, option);
  };

  const handleCreate = () => {
    setSelectedGoods(null);
    setIsFormOpen(true);
  };

  const handleEdit = (goods: Goods) => {
    setSelectedGoods(goods);
    setIsFormOpen(true);
  };

  const handleDelete = async (goods: Goods) => {
    if (window.confirm("정말로 이 상품을 삭제하시겠습니까?")) {
      await deleteGoods(goods.id);
      fetchGoodsList();
    }
  };

  const handleSubmit = async (
    formData: Omit<Goods, "id" | "createdBy">,
    files: File[]
  ) => {
    if (selectedGoods) {
      await updateGoods(selectedGoods.id, formData);
    } else {
      await createGoods(formData);
    }
    setIsFormOpen(false);
    fetchGoodsList();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-start">
        <GoodsSearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onSearch={handleSearch}
        />
      </div>

      <GoodsBanner goods={goods[0]} />

      <div className="mt-4 flex justify-end items-center gap-2">
        <GoodsSortBar value={sortOption} onChange={handleSort} />
        {isAdmin && (
          <button
            onClick={handleCreate}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            상품 등록
          </button>
        )}
      </div>

      <div className="mt-8">
        <GoodsGrid
          goods={goods}
          isAdmin={isAdmin}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {isFormOpen && (
        <GoodsForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleSubmit}
          initialData={selectedGoods || undefined}
          isEdit={!!selectedGoods}
        />
      )}
    </div>
  );
}
