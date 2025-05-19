package com.example.mingle.global.security.auth;

import com.example.mingle.domain.user.user.entity.UserRole;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;

// login 처리할 때 필요한 정보들
@Getter
@AllArgsConstructor
public class SecurityUser implements UserDetails {

    private final Long id;
    private final String email;
    private final String password;
    private final String nickname;
    private final UserRole role;
    private final Long departmentId;
    private final Collection<? extends GrantedAuthority> authorities;

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    public UserRole getRole() {
        return role;
    }
}
