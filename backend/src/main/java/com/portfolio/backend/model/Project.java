package com.portfolio.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String category;
    private String tag;
    private String date;
    private String imageUrl;

    @Column(columnDefinition = "TEXT")
    private String techStack;

    private String projectUrl;

    private Integer sortOrder = 0;

    public Project() {
    }

    public Project(String title, String description, String category, String tag, String date, String imageUrl, String techStack, String projectUrl) {
        this.title = title;
        this.description = description;
        this.category = category;
        this.tag = tag;
        this.date = date;
        this.imageUrl = imageUrl;
        this.techStack = techStack;
        this.projectUrl = projectUrl;
    }

    public Project(String title, String description, String category, String tag, String date, String imageUrl, String techStack, String projectUrl, Integer sortOrder) {
        this.title = title;
        this.description = description;
        this.category = category;
        this.tag = tag;
        this.date = date;
        this.imageUrl = imageUrl;
        this.techStack = techStack;
        this.projectUrl = projectUrl;
        this.sortOrder = sortOrder;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getTag() { return tag; }
    public void setTag(String tag) { this.tag = tag; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getTechStack() { return techStack; }
    public void setTechStack(String techStack) { this.techStack = techStack; }

    public String getProjectUrl() { return projectUrl; }
    public void setProjectUrl(String projectUrl) { this.projectUrl = projectUrl; }

    public Integer getSortOrder() { return sortOrder; }
    public void setSortOrder(Integer sortOrder) { this.sortOrder = sortOrder; }
}
