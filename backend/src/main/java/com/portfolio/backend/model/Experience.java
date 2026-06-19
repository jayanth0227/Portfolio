package com.portfolio.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "experiences")
public class Experience {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String role;
    private String duration;

    @Column(columnDefinition = "TEXT")
    private String description;

    private Integer sortOrder = 0;

    public Experience() {
    }

    public Experience(String role, String duration, String description) {
        this.role = role;
        this.duration = duration;
        this.description = description;
    }

    public Experience(String role, String duration, String description, Integer sortOrder) {
        this.role = role;
        this.duration = duration;
        this.description = description;
        this.sortOrder = sortOrder;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getSortOrder() { return sortOrder; }
    public void setSortOrder(Integer sortOrder) { this.sortOrder = sortOrder; }
}
