package com.dapakino.api.config;

import com.dapakino.api.model.Category;
import com.dapakino.api.model.Product;
import com.dapakino.api.repository.CategoryRepository;
import com.dapakino.api.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;

@Component
public class DataSeeder implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public DataSeeder(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    public void run(String... args) throws Exception {
         // Controlla se il DB è già pieno, se sì non fa nulla
       if (categoryRepository.count() > 0) {
            return;
        }

        // 1. Crea le Categorie
        Category rosse = Category.builder().name("Pizze Rosse").build();
        Category bianche = Category.builder().name("Pizze Bianche").build();
        Category bibite = Category.builder().name("Bibite").build();

        categoryRepository.saveAll(Arrays.asList(rosse, bianche, bibite));

        // 2. Crea i Prodotti
        Product margherita = Product.builder()
                .name("Margherita")
                .description("Pomodoro San Marzano, Mozzarella fior di latte, Basilico")
                .price(new BigDecimal("6.00"))
                .category(rosse)
                .available(true)
                .imageUrl("https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=500&q=60")
                .build();

        Product diavola = Product.builder()
                .name("Diavola")
                .description("Pomodoro, Mozzarella, Salame piccante")
                .price(new BigDecimal("7.50"))
                .category(rosse)
                .available(true)
                .imageUrl("https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=500&q=60")
                .build();

        Product quattroFormaggi = Product.builder()
                .name("4 Formaggi")
                .description("Mozzarella, Gorgonzola, Fontina, Parmigiano")
                .price(new BigDecimal("8.00"))
                .category(bianche)
                .available(true)
                .imageUrl("https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=60")
                .build();

        Product cocaCola = Product.builder()
                .name("Coca Cola 33cl")
                .description("Lattina")
                .price(new BigDecimal("2.50"))
                .category(bibite)
                .available(true)
                .build();

        productRepository.saveAll(Arrays.asList(margherita, diavola, quattroFormaggi, cocaCola));

        System.out.println("✅ DATI DI PROVA INSERITI CORRETTAMENTE NEL DB!");
    }
}