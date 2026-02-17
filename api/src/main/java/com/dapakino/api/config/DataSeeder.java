package com.dapakino.api.config;

import com.dapakino.api.model.Category;
import com.dapakino.api.model.Product;
import com.dapakino.api.repository.CategoryRepository;
import com.dapakino.api.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public DataSeeder(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    public void run(String... args) {
        if (categoryRepository.count() == 0) {
            // 1. CREAZIONE CATEGORIE
            Category pizze = categoryRepository.save(Category.builder().name("Le Pizze").build());
            Category focacce = categoryRepository.save(Category.builder().name("Le Focacce").build());
            Category farinate = categoryRepository.save(Category.builder().name("Le Farinate").build());
            Category bevande = categoryRepository.save(Category.builder().name("Le Bevande").build());

            // 2. CREAZIONE PRODOTTI
            List<Product> menu = Arrays.asList(
                    // --- LE PIZZE (Pagina 1) ---
                    Product.builder().name("Acquolina").description("Passata di pomodoro nostrano, provola affumicata, salsiccia, zucchine al forno").price(new BigDecimal("8.00")).category(pizze).available(true).build(),
                    Product.builder().name("Affumicata").description("Fior di latte, carciofi, pesto di noci, burratina affumicata, speck, Salsiccia di bra in cottura").price(new BigDecimal("10.00")).category(pizze).available(true).build(),
                    Product.builder().name("Alfa").description("Pomodori ciliegia gialli e rossi, fior di latte, crema di peperoni arrosto, gorgonzola dop, filetti di acciughe del mar Cantabrica").price(new BigDecimal("9.00")).category(pizze).available(true).build(),
                    Product.builder().name("Amatriciana").description("Passata di pomodoro nostrano, provola affumicata, cipolla rossa di Tropea, guanciale, ricotta salata").price(new BigDecimal("8.00")).category(pizze).available(true).build(),
                    Product.builder().name("Atena").description("Passata di pomodoro nostrano, prosciutto crudo piemontese stagionato trenta mesi, stracciatella di fior di latte (180gr circa), pomodorini gialli e rossi").price(new BigDecimal("12.00")).category(pizze).available(true).build(),
                    Product.builder().name("Best").description("Fior di latte, prosciutto cotto, cipolla rossa di Tropea caramellata, Castelmagno d.o.p., patate al forno").price(new BigDecimal("10.00")).category(pizze).available(true).build(),
                    Product.builder().name("Carbonara").description("Fior di latte, guanciale, carbocrema dopo cottura").price(new BigDecimal("8.00")).category(pizze).available(true).build(),
                    Product.builder().name("Champions League").description("Passata di pomodoro nostrano, fior di latte, cipolla rossa di Tropea, funghi champignon, olive di riviera, spianata calabrese piccante").price(new BigDecimal("9.00")).category(pizze).available(true).build(),
                    Product.builder().name("CosìComè").description("Passata di pomodori gialli, fior di latte, pancetta tradizionale, rosmarino, patate fresche al forno").price(new BigDecimal("8.00")).category(pizze).available(true).build(),
                    Product.builder().name("Curvy").description("Passata di pomodoro nostrano, fior di latte, patate fresche al forno, salsiccia").price(new BigDecimal("8.00")).category(pizze).available(true).build(),

                    // --- LE PIZZE (Pagina 2) ---
                    Product.builder().name("Esplosiva").description("Passata di pomodoro, fior di latte, pancetta, nduja, gorgonzola").price(new BigDecimal("8.00")).category(pizze).available(true).build(),
                    Product.builder().name("Europa league").description("Passata di pomodoro nostrano, fior di latte, prosciutto cotto, gorgonzola d.o.p., cipolla rossa di Tropea").price(new BigDecimal("8.50")).category(pizze).available(true).build(),
                    Product.builder().name("formaggi").description("Fior di latte, raschera d.o.p., toma piemontese, gorgonzola d.o.p.").price(new BigDecimal("10.00")).category(pizze).available(true).build(),
                    Product.builder().name("Fresca").description("Pomodori ciliegino gialli e rossi, mozzarella di bufala a km0, rucola, veli di Gran Kinara").price(new BigDecimal("9.00")).category(pizze).available(true).build(),
                    Product.builder().name("Iellov").description("Polpa finissima di pomodori gialli, salsiccia, funghi champignon, rosmarino, olio profumato all'aglio e grana padano in cottura, Friarielli saltati e speziati").price(new BigDecimal("10.00")).category(pizze).available(true).build(),
                    Product.builder().name("La Pakino").description("Fior di latte, pesto, pomodori datterino giallo e rosso, zucchine, salsiccia").price(new BigDecimal("10.00")).category(pizze).available(true).build(),
                    Product.builder().name("Margherita (più o più)").description("Passata di pomodoro nostrano, fior di latte misto bufala, pomodori ciliegino gialli e rossi, una spolverata di Gran Kinara").price(new BigDecimal("7.00")).category(pizze).available(true).build(),
                    Product.builder().name("Marinara").description("Passata di pomodoro nostrano, pomodori ciliegino gialli e rossi, olio extra vergine di oliva profumato all'aglio rosso, origano siciliano").price(new BigDecimal("7.00")).category(pizze).available(true).build(),
                    Product.builder().name("Napoletana").description("Passata di pomodoro nostrano, filetti di acciughe del mar Cantabrico, capperi").price(new BigDecimal("8.00")).category(pizze).available(true).build(),
                    Product.builder().name("Nina").description("Fior di latte, salsiccia di Bra in cottura, toma piemontese, nocciole tostate, lardo doppio").price(new BigDecimal("10.00")).category(pizze).available(true).build(),
                    Product.builder().name("Norma").description("Passata di pomodoro nostrano, fior di latte, melanzane impanate, ricotta salata").price(new BigDecimal("8.00")).category(pizze).available(true).build(),
                    Product.builder().name("Ortolana").description("Pomodori ciliegino gialli e rossi, fior di latte, zucchine al forno, melanzane impanate, friggitelli, funghi champignon").price(new BigDecimal("9.00")).category(pizze).available(true).build(),

                    // --- LE PIZZE (Pagina 3) ---
                    Product.builder().name("O sole mio").description("Passata di pomodori gialli, acciughe, cipolla, grana in cottura").price(new BigDecimal("9.00")).category(pizze).available(true).build(),
                    Product.builder().name("Piemontese").description("Fior di latte, funghi porcini, salsiccia di Bra in cottura, castelmagno d.o.p.").price(new BigDecimal("11.00")).category(pizze).available(true).build(),
                    Product.builder().name("Polpetta").description("Passata di pomodoro nostrano, polpette di vitello fassone e salsiccia, stracciatella di burrata (180gr circa)").price(new BigDecimal("9.00")).category(pizze).available(true).build(),
                    Product.builder().name("Provolona").description("Passata di pomodoro, provola affumicata, guanciale, patate, pepe nero").price(new BigDecimal("8.00")).category(pizze).available(true).build(),
                    Product.builder().name("Pulled Pizza 2.0").description("Focaccia, toma piemontese, pulled pork, salsa bbq, cipolla caramellata, cavolo rosso").price(new BigDecimal("12.00")).category(pizze).available(true).build(),
                    Product.builder().name("Reale").description("Fior di latte, salsiccia di Bra in cottura, speck del Trentino, Castelmagno DOP").price(new BigDecimal("9.00")).category(pizze).available(true).build(),
                    Product.builder().name("Rosina").description("Passata di pomodoro nostrano, gorgonzola d.o.p., pancetta tradizionale, salsiccia di Bra in cottura, cipolla di Tropea caramellata").price(new BigDecimal("10.00")).category(pizze).available(true).build(),
                    Product.builder().name("Salsiccia & Friarielli").description("Fior di latte, friarielli saltati con aglio e peperoncino, salsiccia").price(new BigDecimal("9.00")).category(pizze).available(true).build(),
                    Product.builder().name("Tre Porcellini").description("Passata di pomodoro, pancetta, salsiccia, spianata").price(new BigDecimal("9.00")).category(pizze).available(true).build(),
                    Product.builder().name("Yoko").description("Passata di pomodoro nostrano, fior di latte, cipolla rossa di Tropea, olive di riviera, peperoni, semi di sesamo").price(new BigDecimal("8.00")).category(pizze).available(true).build(),

                    // --- LE FOCACCE ---
                    Product.builder().name("Schietta").description("Pomodori ciliegino gialli e rossi, patate fresche al forno, cipolla rossa di Tropea, origano siciliano, peperoncino").price(new BigDecimal("7.00")).category(focacce).available(true).build(),
                    Product.builder().name("Estiva").description("Pomodoro datterino giallo e rosso, olive, bufala fuori cottura, origano").price(new BigDecimal("7.00")).category(focacce).available(true).build(),
                    Product.builder().name("Focaccia Lardo").description("Focaccia con lardo doppio e rosmarino").price(new BigDecimal("7.00")).category(focacce).available(true).build(),
                    Product.builder().name("Focaccia Crudo").description("Focaccia con prosciutto crudo piemontese stagionato trenta mesi").price(new BigDecimal("7.00")).category(focacce).available(true).build(),
                    Product.builder().name("Dolce").description("Focaccia con Nutella").price(new BigDecimal("6.00")).category(focacce).available(true).build(),

                    // --- LE FARINATE ---
                    Product.builder().name("Farinata Classic").description("Con farina di ceci della maremma macinata a pietra").price(new BigDecimal("3.00")).category(farinate).available(true).build(),
                    Product.builder().name("Farinata Farcita").description("Doppia farinata ripiena, 2 ingredienti a scelta").price(new BigDecimal("6.00")).category(farinate).available(true).build(),

                    // --- LE BEVANDE ---
                    Product.builder().name("Bibite Lattina").description("Aranciata, Limonata, Coca Cola, Coca Cola Zero").price(new BigDecimal("2.50")).category(bevande).available(true).build(),
                    Product.builder().name("Menabrea Bionda").description("Birra Menabrea 150° anniversario bionda (33cl)").price(new BigDecimal("3.00")).category(bevande).available(true).build(),
                    Product.builder().name("Menabrea Ambrata").description("Birra Menabrea 150° anniversario ambrata (33cl)").price(new BigDecimal("3.00")).category(bevande).available(true).build(),
                    Product.builder().name("Ichnusa").description("Birra Ichnusa non filtrata").price(new BigDecimal("3.00")).category(bevande).available(true).build(),
                    Product.builder().name("Poretti").description("Birra Poretti (66cl)").price(new BigDecimal("5.00")).category(bevande).available(true).build()
            );

            productRepository.saveAll(menu);
            System.out.println("✅ Menu Da Pakino popolato con successo!");
        }
    }
}