package com.example.mingle.domain.user.user.controller;

import com.example.mingle.domain.user.user.dto.SignupRequestDto;
import com.example.mingle.domain.user.user.dto.TokenResponseDto;
import com.example.mingle.domain.user.user.dto.LoginRequestDto;
import com.example.mingle.domain.user.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class ApiV1AuthController {

    private final UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody SignupRequestDto request) {
        userService.signup(request);
        return ResponseEntity.status(HttpStatus.CREATED).body("회원가입 성공");
    }

    // loginId 또는 email을 받아서 토큰 응답
    @PostMapping("/login")
    public ResponseEntity<TokenResponseDto> login(@RequestBody LoginRequestDto request) {
        return ResponseEntity.ok(userService.login(request));
    }
}
