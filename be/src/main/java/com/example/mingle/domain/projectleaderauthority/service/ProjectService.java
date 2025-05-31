package com.example.mingle.domain.projectleaderauthority.service;

import com.example.mingle.domain.projectleaderauthority.dto.ProjectResponseDto;
import com.example.mingle.domain.projectleaderauthority.entity.Project;
import com.example.mingle.domain.projectleaderauthority.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;

    public Project create(String name, LocalDate endDate) {
        return projectRepository.save(Project.builder()
                .name(name)
                .endDate(endDate)
                .build());
    }

    public List<ProjectResponseDto> findAll() {
        return projectRepository.findAll().stream()
                .map(ProjectResponseDto::from)
                .collect(Collectors.toList());
    }

    public Project findByIdOrThrow(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 ID의 프로젝트가 존재하지 않습니다."));
    }
}

