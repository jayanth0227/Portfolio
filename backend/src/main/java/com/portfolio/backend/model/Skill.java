package com.portfolio.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "skills")
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String category;
    private String icon;
    private String iconColor;
    private Integer sortOrder = 0;

    public Skill() {
    }

    public Skill(String name, String category, String icon, String iconColor) {
        this.name = name;
        this.category = category;
        this.icon = icon;
        this.iconColor = iconColor;
    }

    public Skill(String name, String category, String icon, String iconColor, Integer sortOrder) {
        this.name = name;
        this.category = category;
        this.icon = icon;
        this.iconColor = iconColor;
        this.sortOrder = sortOrder;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public String getIconColor() { return iconColor; }
    public void setIconColor(String iconColor) { this.iconColor = iconColor; }

    public Integer getSortOrder() { return sortOrder; }
    public void setSortOrder(Integer sortOrder) { this.sortOrder = sortOrder; }
}
