package com.example.mingle.domain.user.user.entity;

import com.example.mingle.domain.user.team.entity.Department;
import com.example.mingle.global.jpa.BaseEntity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collection;
import java.util.List;

@Entity
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Table(name = "user")
public class User extends BaseEntity {

    @Column(name = "login_id", nullable = false, unique = true, length = 50)
    private String loginId;

    @JsonIgnore
    @Column(name = "password", nullable = false, length = 100)
    private String password;

    @Column(name = "name")
    private String name;

    @Column(name = "nickname", nullable = false, length = 50)
    private String nickname;

    @Column(name = "email", length = 100)
    private String email;

    // 어떤 권한 갖고 있는지
    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private UserRole role;

    // 어느 팀 소속인지
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    // 어떤 직책 맡고 있는지
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "position_id")
    private UserPosition position;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private UserStatus status = UserStatus.ACTIVE; // 기본값

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private PresenceStatus presence = PresenceStatus.OFFLINE; // 기본값

    @Column(name = "phone_num", length = 20)
    private String phoneNum;

    @Column(name = "image_url", length = 255)
    private String imageUrl;

    @Column(name = "refresh_token", length = 255)
    private String refreshToken;

    // 권한 반환
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + this.role.name()));
    }

    public String getRefreshToken() {
        return this.refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }
}
