package com.example.mingle.domain.admin.panel.controller;


import com.example.mingle.domain.admin.panel.dto.AdminRequestUser;
import com.example.mingle.domain.admin.panel.dto.AdminRoleUpdate;
import com.example.mingle.domain.admin.panel.dto.AdminUpdateUser;
import com.example.mingle.domain.admin.panel.service.AdminUserService;
import com.example.mingle.domain.user.user.entity.PositionCode;
import com.example.mingle.domain.user.user.entity.UserRole;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/users")
@RequiredArgsConstructor
//@PreAuthorize("hasRole('ADMIN')")
public class ApiV1AdminUserController {

    private final AdminUserService adminUserService;

    @GetMapping
    @Operation(summary = "부서와 포지션에 해당하는 유저 조회")
    public Page<AdminRequestUser> getUsers(@RequestParam(required = false) Long departmentId,
                                           @RequestParam(required = false) PositionCode positionCode,
                                           @PageableDefault(size = 20) Pageable pageable) {
        return adminUserService.getUsersFiltered(departmentId, positionCode, pageable);
    }

    @GetMapping("/{id}")
    @Operation(summary = "유저 상세 조회")
    public AdminRequestUser getUser(@PathVariable Long id) {
        return adminUserService.getUser(id);
    }

    @PutMapping("/{userId}")
    @Operation(summary = "유저 정보 변경(부서, 포지션, ...")
    public void updateUser(@PathVariable Long userId, @RequestBody AdminUpdateUser req) {
        adminUserService.updateUser(userId, req);
    }

    @PatchMapping("/{id}/role")
    @Operation(summary = "유저 권한 변경")
    public void updateRole(@PathVariable Long id, @RequestBody AdminRoleUpdate req) {
        adminUserService.updateRole(id, req.role());
    }

}
