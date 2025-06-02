export interface DmChatRoomResponse {
  id: number; // 채팅방 ID
  userAId: number; // 첫 번째 사용자 ID
  userBId: number; // 두 번째 사용자 ID
  roomKey: string; // 고유 키 (예: "2_3")
}
