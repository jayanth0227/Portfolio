package com.portfolio.backend.controller;

import com.portfolio.backend.model.PortfolioDetails;
import com.portfolio.backend.repository.PortfolioRepository;
import com.portfolio.backend.service.CloudinaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Collections;

@RestController
@RequestMapping("/api/portfolio")
public class PortfolioController {

    private final PortfolioRepository portfolioRepository;
    private final CloudinaryService cloudinaryService;

    @Autowired
    public PortfolioController(PortfolioRepository portfolioRepository, CloudinaryService cloudinaryService) {
        this.portfolioRepository = portfolioRepository;
        this.cloudinaryService = cloudinaryService;
    }

    @GetMapping
    public ResponseEntity<PortfolioDetails> getPortfolio() {
        return portfolioRepository.findAll().stream().findFirst()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping
    public ResponseEntity<PortfolioDetails> updatePortfolio(@RequestBody PortfolioDetails details) {
        PortfolioDetails existing = portfolioRepository.findAll().stream().findFirst()
                .orElse(new PortfolioDetails());

        existing.setName(details.getName());
        existing.setHeroTitle(details.getHeroTitle());
        existing.setHeroSubtitle(details.getHeroSubtitle());
        existing.setBio(details.getBio());
        existing.setAvatarUrl(details.getAvatarUrl());
        existing.setYearsExperience(details.getYearsExperience());
        existing.setCoreProjectsCount(details.getCoreProjectsCount());
        existing.setAcademicStand(details.getAcademicStand());
        existing.setGithubUrl(details.getGithubUrl());
        existing.setLinkedinUrl(details.getLinkedinUrl());
        existing.setEmail(details.getEmail());
        existing.setPhone(details.getPhone());
        existing.setLocation(details.getLocation());

        PortfolioDetails saved = portfolioRepository.save(existing);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/upload-image")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            String url = cloudinaryService.uploadFile(file);
            return ResponseEntity.ok(Collections.singletonMap("url", url));
        } catch (IOException | IllegalArgumentException e) {
            return ResponseEntity.status(500).body(Collections.singletonMap("error", e.getMessage()));
        }
    }
}
