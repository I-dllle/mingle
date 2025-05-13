package com.example.mingle.domain.user.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignupRequestDto {
    @NotBlank(message = "아이디는 필수 입력값입니다. 이메일도 가능합니다.")
    private String loginId;

    @NotBlank(message = "비밀번호는 필수 입력값입니다.")
    private String password;

    @NotBlank(message = "역할은 필수 입력값입니다. (예: ARTIST, STAFF)")
    private String role;

    @NotNull(message = "부서 ID는 필수 입력값입니다.")
    private Long departmentId;

    private String nickname;
    private String email;
    private String phoneNum;
    private String imageUrl;
}
