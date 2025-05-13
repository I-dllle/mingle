package com.example.mingle.domain.user.user.controller;

import com.example.mingle.domain.user.user.dto.SignupRequestDto;
import com.example.mingle.domain.user.user.dto.TokenResponseDto;
import com.example.mingle.domain.user.user.dto.LoginRequestDto;
import com.example.mingle.domain.user.user.dto.UserResponseDto;
import com.example.mingle.domain.user.user.entity.User;
import com.example.mingle.domain.user.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// 인증 관련 API 컨트롤러
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class ApiV1AuthController {

    // service쪽에 태워서 가입시킴
    private final UserService userService;

    /**
     * 회원가입
     */
    @Operation(summary = "회원가입", description = "새로운 사용자를 등록합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "회원가입 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    @PostMapping("/signup")
    public ResponseEntity<UserResponseDto> signup(@Valid @RequestBody SignupRequestDto request) {
        User user = userService.signup(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(UserResponseDto.fromEntity(user));
    }



    /**
     * 로그인 → accessToken 발급
     */
    @Operation(summary = "로그인", description = "로그인 ID 또는 이메일과 비밀번호를 입력해 accessToken을 발급받습니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "로그인 성공"),
            @ApiResponse(responseCode = "401", description = "아이디 또는 비밀번호 불일치")
    })
    @PostMapping("/login")
    public ResponseEntity<TokenResponseDto> login(@Valid @RequestBody LoginRequestDto request) {
        return ResponseEntity.ok(userService.login(request));
    }



    /**
     * refreshToken을 이용해 accessToken 재발급
     */
    @Operation(summary = "AccessToken 재발급", description = "쿠키에 저장된 refreshToken을 이용해 새로운 accessToken을 발급합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "AccessToken 재발급 성공"),
            @ApiResponse(responseCode = "401", description = "유효하지 않은 refreshToken")
    })
    @PostMapping("/refresh")
    public ResponseEntity<TokenResponseDto> refresh(@CookieValue("refreshToken") String refreshToken) {
        TokenResponseDto response = userService.refreshToken(refreshToken);
        return ResponseEntity.ok(response);
    }



    /**
     * 로그아웃
     */
    @Operation(summary = "로그아웃", description = "로그아웃 처리를 합니다.")
    @ApiResponse(responseCode = "200", description = "로그아웃 성공")
    @GetMapping("/logout")
    public void logout() {
        System.out.println("logout");
    }



    /**
     * 내 정보 조회
     */
    @Operation(summary = "내 정보 조회", description = "현재 로그인한 사용자의 정보를 조회합니다.")
    @ApiResponse(responseCode = "200", description = "조회 성공")
    @GetMapping("/me")
    public void me() {
        System.out.println("me");
    }
}
