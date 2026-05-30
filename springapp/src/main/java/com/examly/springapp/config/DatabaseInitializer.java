package com.examly.springapp.config;

import com.examly.springapp.model.User;
import com.examly.springapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${app.security.username:bankuser}")
    private String defaultUsername;

    @Value("${app.security.password:bankpass}")
    private String defaultPassword;

    @Override
    public void run(String... args) throws Exception {
        if (!userRepository.existsByUsername(defaultUsername)) {
            User defaultUser = new User();
            defaultUser.setUsername(defaultUsername);
            defaultUser.setPassword(passwordEncoder.encode(defaultPassword));
            defaultUser.setEmail("admin@securebank.com");
            defaultUser.setFullName("Default System Administrator");
            defaultUser.setRole("USER");
            userRepository.save(defaultUser);
            System.out.println("Default user created in database: " + defaultUsername);
        }
    }
}
