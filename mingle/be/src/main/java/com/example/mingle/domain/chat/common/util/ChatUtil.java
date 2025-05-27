package com.example.mingle.domain.chat.common.util;

import java.util.Arrays;
import java.util.List;

public class ChatUtil {

    /**
     * 파일 이름에서 #태그를 추출합니다.
     * 예: "아이디어#기획안_최종#디자인.ppt" → ["기획안", "디자인"]
     */
    public static List<String> extractTagsFromFilename(String filename) {
        if (filename == null) return List.of();

        return Arrays.stream(filename.split("[_\\s\\-]+"))
                .filter(word -> word.startsWith("#"))
                .map(word -> word.substring(1))  // '#' 제거
                .filter(word -> !word.isBlank())
                .distinct()
                .toList();
    }



    public static Long extractArchiveIdFromContent(String content) {
        if (content == null || !content.startsWith("archive:")) {
            throw new IllegalArgumentException("Invalid archive message content: " + content);
        }
        return Long.parseLong(content.substring("archive:".length()));
    }
    // 추후 메시지 본문 파싱도 여기 추가할 수 있음
}