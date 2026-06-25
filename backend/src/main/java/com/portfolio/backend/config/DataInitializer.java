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

        // 2. Seed/Update Default Portfolio Details
        portfolioRepository.deleteAll();
        PortfolioDetails defaultDetails = new PortfolioDetails(
                "Jayanth Sai Chikkala",
                "Building Scalable Full Stack Solutions",
                "Hi, I'm Jayanth Sai Chikkala. A Java Full Stack Developer specialized in building robust backend services with Spring Boot and crafting responsive, intuitive user interfaces.",
                "Java Full Stack Developer with 1 year of experience developing enterprise web applications using Java, Spring Boot, REST APIs, MySQL, JavaScript, HTML, and CSS. Experienced in building SaaS platforms, workflow automation systems, responsive user interfaces, and scalable backend services.\n\nStrong understanding of OOP, Microservices, SDLC, Agile methodologies, API integration, database optimization, and deployment workflows. Passionate about solving real-world problems through clean, maintainable, and high-performance software solutions.",
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
        System.out.println("Portfolio details updated in database.");

        // 3. Seed Default Experiences
        experienceRepository.deleteAll();
        experienceRepository.save(new Experience(
                "Associate Software Engineer",
                "Jul 2025 – Present",
                "Speshway Solutions Pvt. Ltd. | Hyderabad, India\n\n• Developed and maintained enterprise-level Java Full Stack applications using Java, Spring Boot, JavaScript, HTML, CSS, REST APIs, and MySQL.\n• Contributed to the development of a Smart Office Management System that streamlined internal workflow processes and improved operational efficiency.\n• Worked on a Multi-Tenant SaaS-based CRM platform with role-based access, tenant-specific configurations, and scalable backend architecture.\n• Designed and integrated RESTful APIs for seamless frontend-backend communication and third-party integrations.\n• Implemented authentication and authorization using Spring Security and JWT-based security mechanisms.\n• Developed data access layer using Spring Data JPA and Hibernate for efficient database operations.\n• Collaborated with cross-functional teams in Agile sprints to deliver production-ready features on schedule.\n• Improved application responsiveness and optimized database queries, reducing page load and API response times.\n• Used Git and GitHub for version control, code collaboration, and branch management.\n• Participated in deployment and CI/CD support activities using Jenkins and cloud deployment workflows.\n• Contributed to debugging, issue resolution, performance tuning, and application enhancement tasks.",
                1
        ));
        experienceRepository.save(new Experience(
                "Java Full Stack Developer – Training",
                "2024 – 2025",
                "Pentagon Space Pvt. Ltd. | Bengaluru, India\n\n• Built responsive full stack applications using Java, Spring Boot, HTML, CSS, JavaScript, and MySQL.\n• Worked on backend integration, REST API development, and frontend UI implementation.\n• Strengthened understanding of full stack architecture, debugging, and clean coding practices.",
                2
        ));
        System.out.println("Experiences seeded in database.");

        // 4. Seed Default Projects
        projectRepository.deleteAll();
        projectRepository.save(new Project(
                "Smart Office Management System",
                "Developed modules for employee management, workspace allocation, attendance tracking, and internal workflow monitoring. Implemented responsive UI screens and backend functionalities for secure and efficient office operations. Integrated REST APIs and optimized database queries for improved performance and smooth user experience.",
                "fullstack",
                "Enterprise / Workflow",
                "2025",
                "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
                "Java, Spring Boot, Spring Security, JWT, JPA, Hibernate, REST APIs, MySQL, Bootstrap, Git",
                "https://github.com/jayanth0227",
                1
        ));
        projectRepository.save(new Project(
                "Multi-Tenant SaaS CRM Platform",
                "Contributed to the development of a scalable SaaS-based CRM application supporting multiple tenants. Worked on tenant-specific configurations, authentication workflows, and customer management modules. Developed backend APIs and integrated frontend components for seamless data management. Participated in debugging, feature enhancement, and deployment support activities.",
                "fullstack",
                "SaaS / CRM",
                "2025",
                "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
                "Java, Spring Boot, Spring Security, JWT, JPA, Hibernate, REST APIs, MySQL, Bootstrap, Git",
                "https://github.com/jayanth0227",
                2
        ));
        projectRepository.save(new Project(
                "Secure Government Research Content Sharing via AES Encrypted QR Code",
                "Developed a secure document-sharing platform with encrypted QR-based access control. Implemented AES encryption for secure handling of sensitive government research documents. Improved secure data sharing and restricted unauthorized access effectively. Enhanced practical understanding of frontend development and user experience design.",
                "backend",
                "Security / Cryptography",
                "2024",
                "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
                "Django, AES Encryption, QR Code Integration",
                "https://github.com/jayanth0227",
                3
        ));
        System.out.println("Projects seeded in database.");

        // 5. Seed Default Skills
        skillRepository.deleteAll();
        
        int order = 1;
        // Category: Languages
        skillRepository.save(new Skill("Java", "Languages", "coffee", "text-orange", order++));
        skillRepository.save(new Skill("JavaScript", "Languages", "code", "text-yellow", order++));
        skillRepository.save(new Skill("SQL", "Languages", "database", "text-cyan", order++));

        // Category: Backend
        skillRepository.save(new Skill("Java", "Backend", "coffee", "text-orange", order++));
        skillRepository.save(new Skill("Spring Boot", "Backend", "cpu", "text-blue", order++));
        skillRepository.save(new Skill("Spring Security", "Backend", "shield", "text-yellow", order++));
        skillRepository.save(new Skill("Spring Data JPA", "Backend", "database", "text-cyan", order++));
        skillRepository.save(new Skill("Hibernate", "Backend", "database", "text-pink", order++));
        skillRepository.save(new Skill("REST APIs", "Backend", "server", "text-purple", order++));
        skillRepository.save(new Skill("Microservices", "Backend", "network", "text-blue", order++));
        skillRepository.save(new Skill("MVC Architecture", "Backend", "layers", "text-cyan", order++));
        skillRepository.save(new Skill("JWT Authentication", "Backend", "key", "text-yellow", order++));
        skillRepository.save(new Skill("Authentication & Authorization", "Backend", "lock", "text-red", order++));

        // Category: Frontend
        skillRepository.save(new Skill("HTML5", "Frontend", "file-code", "text-orange", order++));
        skillRepository.save(new Skill("CSS3", "Frontend", "file-code", "text-blue", order++));
        skillRepository.save(new Skill("JavaScript", "Frontend", "code", "text-yellow", order++));
        skillRepository.save(new Skill("Bootstrap", "Frontend", "layout", "text-purple", order++));
        skillRepository.save(new Skill("Responsive Web Design", "Frontend", "smartphone", "text-cyan", order++));
        skillRepository.save(new Skill("DOM Manipulation", "Frontend", "activity", "text-pink", order++));
        skillRepository.save(new Skill("Cross-Browser Compatibility", "Frontend", "chrome", "text-blue", order++));
        skillRepository.save(new Skill("UI Component Development", "Frontend", "component", "text-orange", order++));

        // Category: Databases
        skillRepository.save(new Skill("MySQL", "Databases", "database", "text-pink", order++));
        skillRepository.save(new Skill("Oracle SQL", "Databases", "database", "text-blue", order++));
        skillRepository.save(new Skill("Database Query Optimization", "Databases", "zap", "text-yellow", order++));

        // Category: DevOps & Tools
        skillRepository.save(new Skill("Git & GitHub", "DevOps & Tools", "git-branch", "text-red", order++));
        skillRepository.save(new Skill("Jenkins", "DevOps & Tools", "activity", "text-blue", order++));
        skillRepository.save(new Skill("AWS (EC2 Basics)", "DevOps & Tools", "cloud", "text-yellow", order++));
        skillRepository.save(new Skill("Maven", "DevOps & Tools", "box", "text-cyan", order++));
        skillRepository.save(new Skill("Postman", "DevOps & Tools", "mail", "text-orange", order++));
        skillRepository.save(new Skill("Swagger/OpenAPI", "DevOps & Tools", "file-text", "text-green", order++));
        skillRepository.save(new Skill("Docker (Basics)", "DevOps & Tools", "package", "text-pink", order++));
        skillRepository.save(new Skill("Eclipse IDE", "DevOps & Tools", "code-2", "text-blue", order++));
        skillRepository.save(new Skill("VS Code", "DevOps & Tools", "code", "text-cyan", order++));
        skillRepository.save(new Skill("XAMPP", "DevOps & Tools", "server", "text-orange", order++));

        // Category: Core Concepts
        skillRepository.save(new Skill("OOP", "Core Concepts", "box", "text-purple", order++));
        skillRepository.save(new Skill("Data Structures & Algorithms", "Core Concepts", "binary", "text-yellow", order++));
        skillRepository.save(new Skill("API Integration", "Core Concepts", "shuffle", "text-cyan", order++));
        skillRepository.save(new Skill("Database Management", "Core Concepts", "database", "text-pink", order++));
        skillRepository.save(new Skill("Agile/Scrum", "Core Concepts", "users", "text-blue", order++));
        skillRepository.save(new Skill("SDLC", "Core Concepts", "git-commit", "text-green", order++));
        skillRepository.save(new Skill("Performance Optimization", "Core Concepts", "trending-up", "text-cyan", order++));
        skillRepository.save(new Skill("Version Control", "Core Concepts", "git-pull-request", "text-red", order++));

        // Category: UI/UX
        skillRepository.save(new Skill("Figma", "UI/UX", "figma", "text-pink", order++));
        skillRepository.save(new Skill("Wireframing", "UI/UX", "layout", "text-blue", order++));
        skillRepository.save(new Skill("Prototyping", "UI/UX", "play", "text-green", order++));
        skillRepository.save(new Skill("User Flows", "UI/UX", "git-merge", "text-orange", order++));
        skillRepository.save(new Skill("Sitemap Design", "UI/UX", "map", "text-cyan", order++));
        skillRepository.save(new Skill("Responsive UI Design", "UI/UX", "smartphone", "text-purple", order++));
        skillRepository.save(new Skill("UX Research Basics", "UI/UX", "search", "text-yellow", order++));

        System.out.println("Skills seeded in database.");
    }
}
