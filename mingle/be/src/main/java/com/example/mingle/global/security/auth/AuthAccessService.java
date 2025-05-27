package com.example.mingle.global.security.auth;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;


@Component("authAccessService")
public class AuthAccessService {

    public boolean isInDepartment(Authentication authentication, Long departmentId) {
        SecurityUser user = (SecurityUser) authentication.getPrincipal();
        return departmentId.equals(user.getDepartmentId());
    }
}
