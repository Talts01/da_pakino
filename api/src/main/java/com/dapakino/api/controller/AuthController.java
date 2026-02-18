package com.dapakino.api.controller;

import com.dapakino.api.model.User;
import com.dapakino.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")

public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if(userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email già registrata!");
        }
        // In un caso reale qui useremmo BCrypt per criptare la password
        return ResponseEntity.ok(userRepository.save(user));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginData) {
        Optional<User> user = userRepository.findByEmail(loginData.getEmail());

        if(user.isPresent() && user.get().getPassword().equals(loginData.getPassword())) {
            return ResponseEntity.ok(user.get());
        }
        return ResponseEntity.status(401).body("Credenziali non valide");
    }

    @PutMapping("/update-profile/{id}")
    public ResponseEntity<?> updateProfile(@PathVariable Long id, @RequestBody User userData) {
        return userRepository.findById(id).map(user -> {
            // Aggiorna i campi
            user.setFirstName(userData.getFirstName());
            user.setLastName(userData.getLastName()); // Questo è il nostro "Citofono"
            user.setAddress(userData.getAddress());
            user.setPhone(userData.getPhone());

            // SALVA NEL DATABASE (fondamentale!)
            User updatedUser = userRepository.save(user);

            // Restituisci l'utente appena salvato
            return ResponseEntity.ok(updatedUser);
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User userData) {
        return userRepository.findById(id).map(user -> {
            user.setFirstName(userData.getFirstName());
            user.setLastName(userData.getLastName());
            user.setAddress(userData.getAddress());
            user.setCity(userData.getCity());
            user.setPhone(userData.getPhone());
            // Non aggiorniamo password qui per sicurezza
            User updated = userRepository.save(user);
            return ResponseEntity.ok(updated);
        }).orElse(ResponseEntity.notFound().build());
    }
}