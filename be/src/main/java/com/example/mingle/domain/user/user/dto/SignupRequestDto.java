package com.example.mingle.domain.user.user.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignupRequestDto {
    @NotBlank(message = "아이디는 필수 입력값입니다. 이메일도 가능합니다.")
    private String loginId;

    @NotBlank(message = "비밀번호는 필수 입력값입니다.")
    private String password;

    private String nickname;
    private String email;
    private String phoneNum;
    private String imageUrl;
    private String role;        // ARTIST, STAFF 등
    private Long departmentId;  // 부서 ID
}
