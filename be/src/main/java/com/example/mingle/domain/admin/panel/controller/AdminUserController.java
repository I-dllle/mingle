//package com.example.mingle.domain.admin.panel.controller;
//
//import com.example.mingle.domain.user.user.dto.UserResponseDto;
//import com.example.mingle.domain.user.user.service.UserService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.access.prepost.PreAuthorize;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/v1/admin/users")
//@RequiredArgsConstructor
//@PreAuthorize("hasRole('ADMIN')")
//public class AdminUserController {
//
//    private final UserService userService;
//
//    @GetMapping
//    public ResponseEntity<List<UserResponseDto>> findAllUsers() {
//        return ResponseEntity.ok(userService.findAll());
//    }
//
//    @GetMapping("/{id}")
//    public ResponseEntity<UserResponseDto> findById(@PathVariable Long id) {
//        return ResponseEntity.ok(userService.findById(id));
//    }
//
//    @PatchMapping("/{id}/role")
//    public ResponseEntity<Void> updateRole(@PathVariable Long id, @RequestBody UpdateUserRoleRequest request) {
//        userService.updateUserRole(id, request);
//        return ResponseEntity.ok().build();
//    }
//}
