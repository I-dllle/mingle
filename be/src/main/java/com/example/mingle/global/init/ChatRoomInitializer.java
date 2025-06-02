package com.example.mingle.global.init;

import com.example.mingle.domain.chat.common.enums.RoomType;
import com.example.mingle.domain.chat.group.entity.GroupChatRoom;
import com.example.mingle.domain.chat.common.enums.ChatScope;
import com.example.mingle.domain.chat.group.repository.GroupChatRoomRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Profile({"dev", "prod"})
@Component
@RequiredArgsConstructor
@Transactional
public class ChatRoomInitializer implements CommandLineRunner {

    private final GroupChatRoomRepository groupChatRoomRepository;

    @Override
    public void run(String... args) {
        createDepartmentRoomIfNotExists("Planning & A&R", 1L);
        createDepartmentRoomIfNotExists("Creative Studio", 2L);
        createDepartmentRoomIfNotExists("Finance & Legal", 3L);
        createDepartmentRoomIfNotExists("Marketing & PR", 4L);
        createDepartmentRoomIfNotExists("Artist & Manager", 5L);
        createDepartmentRoomIfNotExists("System Operations", 6L);
        // 필요한 부서 채팅방 계속 추가 가능
    }

    private void createDepartmentRoomIfNotExists(String departmentName, Long teamId) {
        String chatRoomName = departmentName + " 채팅방";
        String archiveRoomName = departmentName + " 자료방";

        if (!groupChatRoomRepository.existsByName(chatRoomName)) {
            GroupChatRoom chatRoom = GroupChatRoom.builder()
                    .name(chatRoomName)
                    .scope(ChatScope.DEPARTMENT)
                    .roomType(RoomType.NORMAL)
                    .teamId(teamId)
                    .build();
            groupChatRoomRepository.save(chatRoom);
            log.info("[ChatRoomInitializer] '{}' 생성 완료", chatRoomName);
        }

        if (!groupChatRoomRepository.existsByName(archiveRoomName)) {
            GroupChatRoom archiveRoom = GroupChatRoom.builder()
                    .name(archiveRoomName)
                    .scope(ChatScope.DEPARTMENT)
                    .roomType(RoomType.ARCHIVE)
                    .teamId(teamId)
                    .build();
            groupChatRoomRepository.save(archiveRoom);
            log.info("[ChatRoomInitializer] '{}' 생성 완료", archiveRoomName);
        }
    }
}