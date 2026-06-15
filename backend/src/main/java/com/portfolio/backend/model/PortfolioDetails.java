package com.portfolio.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "portfolio_details")
public class PortfolioDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String heroTitle;

    @Column(columnDefinition = "TEXT")
    private String heroSubtitle;

    @Column(columnDefinition = "TEXT")
    private String bio;

    private String avatarUrl;
    
    // Stats
    private String yearsExperience;
    private String coreProjectsCount;
    private String academicStand;

    // Contact & Socials
    private String githubUrl;
    private String linkedinUrl;
    private String email;
    private String phone;
    private String location;

    public PortfolioDetails() {
    }

    public PortfolioDetails(String name, String heroTitle, String heroSubtitle, String bio, String avatarUrl,
                            String yearsExperience, String coreProjectsCount, String academicStand,
                            String githubUrl, String linkedinUrl, String email, String phone, String location) {
        this.name = name;
        this.heroTitle = heroTitle;
        this.heroSubtitle = heroSubtitle;
        this.bio = bio;
        this.avatarUrl = avatarUrl;
        this.yearsExperience = yearsExperience;
        this.coreProjectsCount = coreProjectsCount;
        this.academicStand = academicStand;
        this.githubUrl = githubUrl;
        this.linkedinUrl = linkedinUrl;
        this.email = email;
        this.phone = phone;
        this.location = location;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getHeroTitle() { return heroTitle; }
    public void setHeroTitle(String heroTitle) { this.heroTitle = heroTitle; }

    public String getHeroSubtitle() { return heroSubtitle; }
    public void setHeroSubtitle(String heroSubtitle) { this.heroSubtitle = heroSubtitle; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public String getYearsExperience() { return yearsExperience; }
    public void setYearsExperience(String yearsExperience) { this.yearsExperience = yearsExperience; }

    public String getCoreProjectsCount() { return coreProjectsCount; }
    public void setCoreProjectsCount(String coreProjectsCount) { this.coreProjectsCount = coreProjectsCount; }

    public String getAcademicStand() { return academicStand; }
    public void setAcademicStand(String academicStand) { this.academicStand = academicStand; }

    public String getGithubUrl() { return githubUrl; }
    public void setGithubUrl(String githubUrl) { this.githubUrl = githubUrl; }

    public String getLinkedinUrl() { return linkedinUrl; }
    public void setLinkedinUrl(String linkedinUrl) { this.linkedinUrl = linkedinUrl; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
}
