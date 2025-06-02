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
    console.log("🔍 검색 버튼 클릭됨, 검색어:", query);
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
      await updateGoods(selectedGoods.id, formData, files);
    } else {
      await createGoods(formData, files);
    }
    setIsFormOpen(false);
    fetchGoodsList();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => (window.location.href = "/goods/orders")}
          className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors shadow-sm"
          title="주문내역"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
          <span className="hidden sm:inline">주문내역</span>
        </button>
      </div>

      <GoodsBanner goods={goods[0]} />

      <div className="mt-4 flex justify-between items-center gap-4">
        <GoodsSearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onSearch={handleSearch}
        />
        <div className="flex items-center gap-2">
          <GoodsSortBar value={sortOption} onChange={handleSort} />
          {isAdmin && (
            <button
              onClick={handleCreate}
              className="bg-purple-500 text-white px-3 py-1.5 text-sm rounded-md hover:bg-purple-600"
            >
              상품 등록
            </button>
          )}
        </div>
      </div>

      <div className="mt-8">
        <GoodsGrid
          goods={goods}
          isAdmin={isAdmin}
          onEdit={handleEdit}
          onDelete={handleDelete}
          searchQuery={searchQuery}
          isSearching={!!searchQuery}
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
