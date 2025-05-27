package com.example.mingle.domain.user.team.entity;

import com.example.mingle.global.jpa.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@ToString
@Table(name = "artist_team")
public class ArtistTeam extends BaseEntity {
    @Column(name = "name", length = 50)
    private String name;

    @Column(name = "debut_date")
    private LocalDateTime debutDate;

}
