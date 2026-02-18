package com.dapakino.api.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private LocalDateTime orderDate;

    private String deliveryTime; // Orario richiesto (es. 19:30)

    private Double totalAmount;

    @Column(columnDefinition = "TEXT")
    private String orderDetails;

    private String status;
}