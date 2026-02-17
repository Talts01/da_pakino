package com.dapakino.api.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "categories")
@Getter // <--- METTI QUESTO AL POSTO DI @Data
@Setter // <--- METTI QUESTO AL POSTO DI @Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore // Serve sempre per il JSON
    // Non servono più Exclude perché non c'è più @Data che genera il codice dannoso
    private List<Product> products;
}