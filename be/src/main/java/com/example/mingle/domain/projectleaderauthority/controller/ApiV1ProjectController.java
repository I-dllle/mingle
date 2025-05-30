package com.example.mingle.domain.projectleaderauthority.controller;

import com.example.mingle.domain.projectleaderauthority.dto.ProjectCreateRequestDto;
import com.example.mingle.domain.projectleaderauthority.dto.ProjectResponseDto;
import com.example.mingle.domain.projectleaderauthority.service.ProjectLeaderAuthService;
import com.example.mingle.global.security.auth.SecurityUser;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/projects")
@Tag(name = "Project API", description = "프로젝트 채팅 관련 API")
public class ApiV1ProjectController {

    private final ProjectLeaderAuthService projectLeaderAuthService;

    @PostMapping
    public void createProject(@RequestBody ProjectCreateRequestDto request,
                              @AuthenticationPrincipal SecurityUser user) {
        projectLeaderAuthService.registerProjectLeader(request.getProjectName(), user.getId());
    }

    // [GET] /api/v1/projects
    @GetMapping
    @Operation(summary = "리더 권한이 있는 프로젝트 목록 조회")
    public List<ProjectResponseDto> getMyProjects(@AuthenticationPrincipal SecurityUser user) {
        return projectLeaderAuthService.getProjectsByLeader(user.getId());
    }
}
