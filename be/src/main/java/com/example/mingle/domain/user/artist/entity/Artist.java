package com.example.mingle.domain.user.artist.entity;

import com.example.mingle.domain.user.team.entity.ArtistTeam;
import com.example.mingle.domain.user.user.entity.User;
import com.example.mingle.global.jpa.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@ToString
@Table(name = "artist")
public class Artist extends BaseEntity {
    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToMany
    @JoinTable(
            name = "artist_team",
            joinColumns = @JoinColumn(name = "artist_id"),
            inverseJoinColumns = @JoinColumn(name = "team_id")
    )
    @Builder.Default
    private Set<ArtistTeam> teams = new HashSet<>();

    @Column(name = "stage_name")
    private String stageName;

    @Column(name = "bio")
    private String bio;

    @Builder.Default
    private boolean isDeleted = false;
}
