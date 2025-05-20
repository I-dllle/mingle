package com.example.mingle.domain.chat.dm.service;

import com.example.mingle.domain.chat.dm.entity.DmChatRoom;

public interface DmChatRoomService {
    DmChatRoom findOrCreateRoom(Long senderId, Long receiverId);
}
