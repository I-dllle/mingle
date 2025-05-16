//package com.example.mingle.domain.admin.panel.controller;
//
//import com.example.mingle.domain.admin.panel.service.AdminPostService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.access.prepost.PreAuthorize;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/api/v1/admin/posts")
//@RequiredArgsConstructor
//@PreAuthorize("hasRole('ADMIN')")
//public class AdminPostController {
//    private final AdminPostService adminPostService;
//
//    @PostMapping
//    public ResponseEntity<Long> create(@RequestBody CreatePostRequest request) {
//        return ResponseEntity.ok(adminPostService.createPost(request));
//    }
//
//    @GetMapping
//    public ResponseEntity<List<PostResponse>> getAll(@RequestParam(required = false) Long teamId, @RequestParam(required = false) String tag) {
//        return ResponseEntity.ok(adminPostService.getPosts(teamId, tag));
//    }
//
//    @PutMapping("/{id}")
//    public ResponseEntity<Void> update(@PathVariable Long id, @RequestBody UpdatePostRequest request) {
//        adminPostService.updatePost(id, request);
//        return ResponseEntity.ok().build();
//    }
//
//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> delete(@PathVariable Long id) {
//        adminPostService.deletePost(id);
//        return ResponseEntity.ok().build();
//    }
//}
