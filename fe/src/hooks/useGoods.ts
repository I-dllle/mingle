import { useState, useCallback } from "react";
import type { Goods } from "../features/goods/types/Goods";
import { api } from "@/lib/api";

interface PageResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export function useGoods() {
  const [goods, setGoods] = useState<Goods[]>([]);

  const fetchGoodsList = useCallback(
    async (searchQuery = "", sortOption = "createdAt,desc") => {
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.append("search", searchQuery);
        if (sortOption) params.append("sort", sortOption);
        const response = await api.get<PageResponse<Goods>>(
          `/api/v1/goods?${params.toString()}`
        );
        setGoods(response.data.content);
      } catch (error) {
        console.error("Failed to fetch goods:", error);
      }
    },
    []
  );

  const createGoods = useCallback(
    async (data: Omit<Goods, "id" | "createdBy">, files?: File[]) => {
      try {
        const formData = new FormData();
        if (files && files.length > 0) {
          files.forEach((file) => {
            formData.append("imgFiles", file);
          });
        }
        formData.append("dto", JSON.stringify(data));

        const response = await api.post<Goods>("/api/v1/goods", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setGoods((prev) => [...prev, response.data]);
        return response.data;
      } catch (error) {
        console.error("Failed to create goods:", error);
        throw error;
      }
    },
    []
  );

  const updateGoods = useCallback(
    async (id: number, data: Partial<Goods>, files?: File[]) => {
      try {
        const formData = new FormData();
        if (files && files.length > 0) {
          files.forEach((file) => {
            formData.append("imgFiles", file);
          });
        }
        formData.append("dto", JSON.stringify(data));

        const response = await api.patch<Goods>(
          `/api/v1/goods/${id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setGoods((prev) =>
          prev.map((item) => (item.id === id ? response.data : item))
        );
        return response.data;
      } catch (error) {
        console.error("Failed to update goods:", error);
        throw error;
      }
    },
    []
  );

  const deleteGoods = useCallback(async (id: number) => {
    try {
      await api.delete(`/api/v1/goods/${id}`);
      setGoods((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Failed to delete goods:", error);
      throw error;
    }
  }, []);

  return {
    goods,
    fetchGoodsList,
    createGoods,
    updateGoods,
    deleteGoods,
  };
}
