package com.example.mingle.domain.user.user.controller;

import com.example.mingle.domain.user.user.dto.UserSimpleDto;
import com.example.mingle.domain.user.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
public class ApiV1UserController {

    private final UserService userService;

    // [1] 닉네임 키워드로 유저 검색
    @GetMapping
    public List<UserSimpleDto> searchUsers(@RequestParam String keyword) {
        return userService.searchByNickname(keyword);
    }
}
