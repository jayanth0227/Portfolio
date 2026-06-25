package com.portfolio.backend.config;

import com.portfolio.backend.model.Experience;
import com.portfolio.backend.model.PortfolioDetails;
import com.portfolio.backend.model.Project;
import com.portfolio.backend.model.Skill;
import com.portfolio.backend.model.User;
import com.portfolio.backend.repository.ExperienceRepository;
import com.portfolio.backend.repository.PortfolioRepository;
import com.portfolio.backend.repository.ProjectRepository;
import com.portfolio.backend.repository.SkillRepository;
import com.portfolio.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PortfolioRepository portfolioRepository;
    private final ExperienceRepository experienceRepository;
    private final ProjectRepository projectRepository;
    private final SkillRepository skillRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public DataInitializer(UserRepository userRepository,
            PortfolioRepository portfolioRepository,
            ExperienceRepository experienceRepository,
            ProjectRepository projectRepository,
            SkillRepository skillRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.portfolioRepository = portfolioRepository;
        this.experienceRepository = experienceRepository;
        this.projectRepository = projectRepository;
        this.skillRepository = skillRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // 1. Seed/Update Default Admin User
        String defaultUsername = "jayanthyeswanth9@gmail.com";
        String defaultPassword = "jayanth@2003";
        
        // Clean up the old default "admin" user if it exists in the database
        userRepository.findByUsername("admin").ifPresent(userRepository::delete);
        
        if (userRepository.findByUsername(defaultUsername).isEmpty()) {
            String hashedPassword = passwordEncoder.encode(defaultPassword);
            User admin = new User(defaultUsername, hashedPassword, "ADMIN");
            userRepository.save(admin);
            
            System.out.println("=================================================");
            System.out.println("DATABASE SEEDED/UPDATED SUCCESSFULLY");
            System.out.println("Default admin user created:");
            System.out.println("Username: " + defaultUsername);
            System.out.println("Password: " + defaultPassword);
            System.out.println("=================================================");
        }

        // Portfolio, experiences, projects, and skills seeding is removed to prevent overwriting cloud database values.
        // These can be fully customized and managed dynamically from the admin dashboard.
    }
}
