package com.example.mingle.domain.user.user.repository;

import com.example.mingle.domain.user.user.entity.PositionCode;
import com.example.mingle.domain.user.user.entity.UserPosition;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserPositionRepository extends JpaRepository<UserPosition, Long> {
    Optional<UserPosition> findByCode(PositionCode code);
}
