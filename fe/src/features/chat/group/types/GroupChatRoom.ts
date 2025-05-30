export interface GroupChatRoom {
  roomId: number;
  name: string;
  roomType: 'NORMAL' | 'ARCHIVE'; // 또는 enum RoomType
  teamId: number;
  scope: 'DEPARTMENT' | 'PROJECT'; // 또는 enum ChatScope
  createdBy: number;
  projectEndDate?: string; // null 가능
}
