"use client";

import { apiClient } from "@/lib/api/apiClient";
import { useRouter } from "next/navigation";
import type { DmChatRoomResponse } from "@/features/chat/dm/types/DmChatRoomResponse";

export function useCreateDmRoom() {
  const router = useRouter();

  const createRoomAndEnter = async (receiverId: number) => {
    const room = await apiClient<DmChatRoomResponse>("/dm-chat/room", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ receiverId }),
    });

    router.push(`/dm/${room.id}`);
  };

  return { createRoomAndEnter };
}
