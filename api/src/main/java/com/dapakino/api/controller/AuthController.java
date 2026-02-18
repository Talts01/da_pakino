package com.dapakino.api.controller;

import com.dapakino.api.model.User;
import com.dapakino.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import java.util.Collections;
import java.util.Map;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")

public class AuthController {

    private static final String GOOGLE_CLIENT_ID = "140754229284-3rkmo3sajoug1tg21mptbvnivj7to435.apps.googleusercontent.com";

    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> body) {
        String token = body.get("token");

        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                    .setAudience(Collections.singletonList(GOOGLE_CLIENT_ID))
                    .build();

            GoogleIdToken idToken = verifier.verify(token);
            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();

                String email = payload.getEmail();
                String firstName = (String) payload.get("given_name");
                String lastName = (String) payload.get("family_name");

                // Cerca se l'utente esiste già
                Optional<User> existingUser = userRepository.findByEmail(email);

                if (existingUser.isPresent()) {
                    // LOGIN: Utente trovato, lo restituiamo
                    return ResponseEntity.ok(existingUser.get());
                } else {
                    // REGISTRAZIONE AUTOMATICA
                    User newUser = new User();
                    newUser.setEmail(email);
                    newUser.setFirstName(firstName);
                    newUser.setLastName(lastName);
                    newUser.setPassword("GOOGLE_AUTH"); // Password fittizia interna
                    newUser.setAddress(""); // Da compilare poi nel profilo
                    newUser.setPhone("");

                    userRepository.save(newUser);
                    return ResponseEntity.ok(newUser);
                }
            } else {
                return ResponseEntity.status(401).body("Token Google non valido");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Errore interno Google Auth");
        }
    }
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