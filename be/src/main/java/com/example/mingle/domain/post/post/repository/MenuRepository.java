package com.example.mingle.domain.post.post.repository;

import com.example.mingle.domain.post.post.entity.PostMenu;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MenuRepository extends JpaRepository<PostMenu, Long> {
    Optional<PostMenu> findByCode(String code);
}
