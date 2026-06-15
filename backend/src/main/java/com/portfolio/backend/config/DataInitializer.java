package com.portfolio.backend.config;

import com.portfolio.backend.model.PortfolioDetails;
import com.portfolio.backend.model.User;
import com.portfolio.backend.repository.PortfolioRepository;
import com.portfolio.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PortfolioRepository portfolioRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public DataInitializer(UserRepository userRepository,
                           PortfolioRepository portfolioRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.portfolioRepository = portfolioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // 1. Seed Default Admin User if no users exist
        if (userRepository.count() == 0) {
            String defaultUsername = "admin";
            String defaultPassword = "password123";
            String hashedPassword = passwordEncoder.encode(defaultPassword);
            
            User admin = new User(defaultUsername, hashedPassword, "ADMIN");
            userRepository.save(admin);
            
            System.out.println("=================================================");
            System.out.println("DATABASE SEEDED SUCCESSFULLY");
            System.out.println("Default admin user created:");
            System.out.println("Username: " + defaultUsername);
            System.out.println("Password: " + defaultPassword);
            System.out.println("=================================================");
        }

        // 2. Seed Default Portfolio Details if empty
        if (portfolioRepository.count() == 0) {
            PortfolioDetails defaultDetails = new PortfolioDetails(
                    "Jayanth Sai Chikkala",
                    "Building Scalable Full Stack Solutions",
                    "Hi, I'm Jayanth Sai Chikkala. A Java Full Stack Developer specialized in building robust backend services with Spring Boot and crafting responsive, intuitive user interfaces.",
                    "I am a Java Full Stack Developer with 1 year of professional experience developing enterprise web applications, workflow automation tools, and SaaS products. I specialize in designing and developing secure RESTful APIs, role-based access control configurations, and scalable backend modules.\n\nDriven by clean code principles and database optimization techniques, I strive to build applications that deliver smooth user experiences, reduce page load and API response times, and resolve real-world business issues.",
                    "developer_avatar.png", // Initial fallback to local photo
                    "1+",
                    "3+",
                    "Top 10%",
                    "https://github.com/jayanth0227",
                    "https://linkedin.com/in/jayanth-sai-chikkala",
                    "jayanthyeswanth9@gmail.com",
                    "+91 9010253076",
                    "Andhra Pradesh, India"
            );
            portfolioRepository.save(defaultDetails);
            System.out.println("Initial portfolio details seeded in database.");
        }
    }
}
