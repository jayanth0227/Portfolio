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
                    "Andhra Pradesh, India");
            portfolioRepository.save(defaultDetails);
            System.out.println("Initial portfolio details seeded in database.");
        }
        // 3. No default experiences are seeded here (managed manually via dashboard)

        // 4. Seed Default Projects if empty
        if (projectRepository.count() == 0) {
            projectRepository.save(new Project(
                    "Smart Office Management System",
                    "A secure enterprise platform streamlining workflow processes with employee profiles, attendance tracking, workspace allocations, and REST API integration.",
                    "fullstack",
                    "Enterprise / Workflow",
                    "2025",
                    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
                    "Java, Spring Boot, Spring Security, JPA, MySQL, Bootstrap",
                    "https://github.com/jayanth0227",
                    1
            ));
            projectRepository.save(new Project(
                    "Multi-Tenant SaaS CRM Platform",
                    "A scalable Customer Relationship Management application supporting multiple tenants. Implements tenant-specific workflows, role-based access, and secure JWT verification.",
                    "fullstack",
                    "SaaS / CRM",
                    "2025",
                    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
                    "Spring Boot, JWT, Hibernate, MySQL, Bootstrap, Git",
                    "https://github.com/jayanth0227",
                    2
            ));
            projectRepository.save(new Project(
                    "Secure Research Content Sharing via QR",
                    "A document sharing framework for sensitive government research documents. Implements robust AES encryption and restricted QR-code verification checks.",
                    "backend",
                    "Security / Cryptography",
                    "2024",
                    "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
                    "Django, Python, AES Encryption, QR Code API, HTML/CSS",
                    "https://github.com/jayanth0227",
                    3
            ));
            projectRepository.save(new Project(
                    "Developer Portfolio Website",
                    "A premium developer portfolio website showcasing a modern glassmorphic layout, dynamic cursor glow tracking, typing effects, and a theme switcher.",
                    "fullstack",
                    "Personal / Frontend",
                    "2026",
                    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
                    "HTML5, CSS3, Vanilla JS, Lucide Icons, Netlify",
                    "https://github.com/jayanth0227",
                    4
            ));
            System.out.println("Initial portfolio projects seeded in database.");
        }

        // 5. Seed Default Skills if empty
        if (skillRepository.count() == 0) {
            // Category: Backend & Databases
            skillRepository.save(new Skill("Java", "Backend & Databases", "coffee", "text-orange", 1));
            skillRepository.save(new Skill("Spring Boot", "Backend & Databases", "cpu", "text-blue", 2));
            skillRepository.save(new Skill("Spring Security & JWT", "Backend & Databases", "shield", "text-yellow", 3));
            skillRepository.save(new Skill("Hibernate / JPA", "Backend & Databases", "database", "text-cyan", 4));
            skillRepository.save(new Skill("REST APIs", "Backend & Databases", "server", "text-purple", 5));
            skillRepository.save(new Skill("MySQL & SQL", "Backend & Databases", "database", "text-pink", 6));

            // Category: Frontend & UI/UX
            skillRepository.save(new Skill("HTML5 & CSS3", "Frontend & UI/UX", "file-code", "text-orange", 7));
            skillRepository.save(new Skill("JavaScript", "Frontend & UI/UX", "code", "text-yellow", 8));
            skillRepository.save(new Skill("Bootstrap", "Frontend & UI/UX", "layout", "text-purple", 9));
            skillRepository.save(new Skill("Responsive Design", "Frontend & UI/UX", "smartphone", "text-cyan", 10));
            skillRepository.save(new Skill("Figma / Wireframing", "Frontend & UI/UX", "figma", "text-pink", 11));

            // Category: DevOps & Tools
            skillRepository.save(new Skill("Git & GitHub", "DevOps & Tools", "git-branch", "text-red", 12));
            skillRepository.save(new Skill("Jenkins", "DevOps & Tools", "activity", "text-blue", 13));
            skillRepository.save(new Skill("AWS EC2 (Basics)", "DevOps & Tools", "cloud", "text-yellow", 14));
            skillRepository.save(new Skill("Maven", "DevOps & Tools", "box", "text-cyan", 15));
            skillRepository.save(new Skill("Docker (Basics)", "DevOps & Tools", "package", "text-pink", 16));

            System.out.println("Initial skillset seeded in database.");
        }
    }
}
