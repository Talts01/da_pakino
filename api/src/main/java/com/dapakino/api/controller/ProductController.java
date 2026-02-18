package com.dapakino.api.controller;

import com.dapakino.api.model.Product;
import com.dapakino.api.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public List<Product> getAllProducts(@RequestParam(required = false, defaultValue = "false") boolean includeAll) {
        if (includeAll) {
            return productRepository.findAll();
        }
        return productRepository.findByAvailableTrue();
    }

    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        return productRepository.save(product);
    }

    // --- AGGIUNGI QUESTO METODO PUT PER L'AGGIORNAMENTO ---
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
        return productRepository.findById(id).map(product -> {
            product.setName(productDetails.getName());
            product.setDescription(productDetails.getDescription());
            product.setPrice(productDetails.getPrice());
            product.setCategory(productDetails.getCategory());
            product.setAvailable(productDetails.isAvailable());

            // IMPORTANTE: Aggiorniamo esplicitamente il campo speciale
            product.setMonthlySpecial(productDetails.isMonthlySpecial());

            if(productDetails.getImageUrl() != null) {
                product.setImageUrl(productDetails.getImageUrl());
            }

            return ResponseEntity.ok(productRepository.save(product));
        }).orElse(ResponseEntity.notFound().build());
    }

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