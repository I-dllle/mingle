import { apiClient } from "@/lib/api/apiClient";
import { GroupChatRoomCreateRequest } from "../types/GroupChatRoomCreateRequest";
import { GroupChatRoom } from "../types/GroupChatRoom";

export async function createGroupChatRoom(
  data: GroupChatRoomCreateRequest
): Promise<GroupChatRoom> {
  return apiClient("/group-chats", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
