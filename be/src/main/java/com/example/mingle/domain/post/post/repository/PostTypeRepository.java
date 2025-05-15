package com.example.mingle.domain.post.post.repository;

import com.example.mingle.domain.post.post.entity.PostMenu;
import com.example.mingle.domain.post.post.entity.PostType;
import com.example.mingle.domain.user.team.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostTypeRepository extends JpaRepository<PostType, Long> {
    boolean existsByMenuAndDepartment(PostMenu menu, Department department);
}
