package com.dapakino.api.controller;

import com.dapakino.api.model.Product;
import com.dapakino.api.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
// Aggiungi CORS se necessario qui o globalmente come hai già fatto in WebConfig
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    // MODIFICA: Aggiungiamo un parametro per decidere se vedere tutto o solo i disponibili
    @GetMapping
    public List<Product> getAllProducts(@RequestParam(required = false, defaultValue = "false") boolean includeAll) {
        if (includeAll) {
            return productRepository.findAll(); // Per l'Admin
        }
        return productRepository.findByAvailableTrue(); // Per il Menu pubblico
    }

    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        return productRepository.save(product);
    }

    // NUOVO ENDPOINT: Per cambiare lo stato di disponibilità (Toggle)
    @PatchMapping("/{id}/toggle-availability")
    public ResponseEntity<Product> toggleAvailability(@PathVariable Long id) {
        return productRepository.findById(id).map(product -> {
            product.setAvailable(!product.isAvailable());
            return ResponseEntity.ok(productRepository.save(product));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id) {
        productRepository.deleteById(id);
    }
}