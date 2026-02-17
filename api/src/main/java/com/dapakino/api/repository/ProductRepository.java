package com.dapakino.api.repository;

import com.dapakino.api.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    // Spring crea automaticamente la query grazie al nome del metodo!
    List<Product> findByAvailableTrue();
}