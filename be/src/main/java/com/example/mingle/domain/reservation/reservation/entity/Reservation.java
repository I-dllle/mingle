package com.example.mingle.domain.reservation.reservation.entity;

import com.example.mingle.domain.user.user.entity.User;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Getter@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reservation {

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;


}
