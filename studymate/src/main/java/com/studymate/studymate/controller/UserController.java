package com.studymate.studymate.controller;

import com.studymate.studymate.entity.User;
import com.studymate.studymate.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // =========================
    // REGISTER
    // =========================

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(
            @RequestBody User user) {

        // Check whether email already exists
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {

            Map<String, String> response = new HashMap<>();

            response.put(
                    "message",
                    "Email already registered"
            );

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(response);
        }

        // Hash password before storing
        String hashedPassword =
                passwordEncoder.encode(user.getPassword());

        user.setPassword(hashedPassword);

        User savedUser =
                userRepository.save(user);

        // Never send the hashed password to frontend
        Map<String, Object> response =
                new HashMap<>();

        response.put(
                "userId",
                savedUser.getUserId()
        );

        response.put(
                "name",
                savedUser.getName()
        );

        response.put(
                "email",
                savedUser.getEmail()
        );

        response.put(
                "message",
                "Registration successful"
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }


    // =========================
    // LOGIN
    // =========================

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(
            @RequestBody User user) {

        User existingUser =
                userRepository.findByEmail(
                        user.getEmail()
                ).orElse(null);

        // Email doesn't exist
        if (existingUser == null) {

            Map<String, String> response =
                    new HashMap<>();

            response.put(
                    "message",
                    "Invalid email or password"
            );

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(response);
        }

        // Check password
        boolean passwordMatches =
                passwordEncoder.matches(
                        user.getPassword(),
                        existingUser.getPassword()
                );

        if (!passwordMatches) {

            Map<String, String> response =
                    new HashMap<>();

            response.put(
                    "message",
                    "Invalid email or password"
            );

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(response);
        }

        // Successful login
        Map<String, Object> response =
                new HashMap<>();

        response.put(
                "userId",
                existingUser.getUserId()
        );

        response.put(
                "name",
                existingUser.getName()
        );

        response.put(
                "email",
                existingUser.getEmail()
        );

        response.put(
                "message",
                "Login successful"
        );

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(response);
    }
}