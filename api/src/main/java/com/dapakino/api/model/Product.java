package com.dapakino.api.model;

import com.fasterxml.jackson.annotation.JsonProperty; // <--- AGGIUNGI QUESTO IMPORT
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(nullable = false)
    private BigDecimal price;

    private String imageUrl;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    private boolean available;

    // --- CORREZIONE QUI ---
    // Forziamo il nome del campo JSON per evitare errori di mapping
    @JsonProperty("isMonthlySpecial")
    @Column(name = "is_monthly_special") // Mappiamo correttamente sul DB
    private boolean isMonthlySpecial;


}