package com.example.mingle.domain.projectleaderauthority.repository;

import com.example.mingle.domain.projectleaderauthority.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
}
