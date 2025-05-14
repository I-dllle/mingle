package com.example.mingle.domain.user.user.entity;

import jakarta.persistence.*;

import com.example.mingle.domain.user.team.entity.Department;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserPosition {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private PositionCode code;

    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    private Department department;
}
