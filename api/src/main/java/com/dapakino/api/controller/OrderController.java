package com.dapakino.api.controller;

import com.dapakino.api.model.Order;
import com.dapakino.api.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

@RestController
@RequestMapping("/api/orders")

public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    // Configurazione: Massimo 5 ordini ogni 15 minuti
    private static final int MAX_ORDERS_PER_SLOT = 5;

    @GetMapping("/user/{userId}")
    public List<Order> getUserOrders(@PathVariable Long userId) {
        return orderRepository.findByUserIdOrderByOrderDateDesc(userId);
    }

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        if (order.getStatus() == null) {
            order.setStatus("INVIATO");
        }
        // Assicuriamoci che orderDate sia settato
        if (order.getOrderDate() == null) {
            order.setOrderDate(LocalDateTime.now());
        }
        Order savedOrder = orderRepository.save(order);
        return ResponseEntity.ok(savedOrder);
    }

    @GetMapping("/kitchen")
    public List<Order> getKitchenOrders() {
        return orderRepository.findByStatusInOrderByOrderDateAsc(
                Arrays.asList("INVIATO", "IN_PREPARAZIONE","IN_CONSEGNA")
        );
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Order> updateStatus(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        String newStatus = (String) body.get("status");
        String newTime = (String) body.get("deliveryTime"); // Leggiamo il nuovo orario se c'è

        return orderRepository.findById(id).map(order -> {
            if (newStatus != null) order.setStatus(newStatus);
            if (newTime != null) order.setDeliveryTime(newTime); // Aggiorna l'orario
            return ResponseEntity.ok(orderRepository.save(order));
        }).orElse(ResponseEntity.notFound().build());
    }

    // --- NUOVO: GESTIONE SLOT ---

    @GetMapping("/slots")
    public List<String> getAvailableSlots() {
        List<String> allSlots = generateSlots("18:30", "22:30", 15);
        List<String> availableSlots = new ArrayList<>();

        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(LocalTime.MAX);

        for (String slot : allSlots) {
            int currentOrders = orderRepository.countOrdersByTime(slot, startOfDay, endOfDay);
            if (currentOrders < MAX_ORDERS_PER_SLOT) {
                availableSlots.add(slot);
            }
        }
        return availableSlots;
    }

    // Helper per generare orari (es. 18:30, 18:45, 19:00...)
    private List<String> generateSlots(String start, String end, int stepMinutes) {
        List<String> slots = new ArrayList<>();
        LocalTime startTime = LocalTime.parse(start);
        LocalTime endTime = LocalTime.parse(end);

        while (!startTime.isAfter(endTime)) {
            slots.add(startTime.toString());
            startTime = startTime.plusMinutes(stepMinutes);
        }
        return slots;
    }
}