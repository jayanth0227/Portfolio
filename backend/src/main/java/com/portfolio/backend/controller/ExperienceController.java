package com.portfolio.backend.controller;

import com.portfolio.backend.model.Experience;
import com.portfolio.backend.repository.ExperienceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/experiences")
public class ExperienceController {

    private final ExperienceRepository experienceRepository;

    @Autowired
    public ExperienceController(ExperienceRepository experienceRepository) {
        this.experienceRepository = experienceRepository;
    }

    @GetMapping
    public ResponseEntity<List<Experience>> getAllExperiences() {
        return ResponseEntity.ok(experienceRepository.findAllByOrderBySortOrderAsc());
    }

    @PostMapping
    public ResponseEntity<Experience> createExperience(@RequestBody Experience experience) {
        int maxOrder = experienceRepository.findAll().stream()
                .mapToInt(e -> e.getSortOrder() != null ? e.getSortOrder() : 0)
                .max()
                .orElse(0);
        experience.setSortOrder(maxOrder + 1);
        return ResponseEntity.ok(experienceRepository.save(experience));
    }

    @PutMapping("/reorder")
    public ResponseEntity<?> reorderExperiences(@RequestBody List<Long> orderedIds) {
        for (int i = 0; i < orderedIds.size(); i++) {
            Long id = orderedIds.get(i);
            int finalI = i;
            experienceRepository.findById(id).ifPresent(exp -> {
                exp.setSortOrder(finalI);
                experienceRepository.save(exp);
            });
        }
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Experience> updateExperience(@PathVariable Long id, @RequestBody Experience details) {
        return experienceRepository.findById(id)
                .map(existing -> {
                    existing.setRole(details.getRole());
                    existing.setDuration(details.getDuration());
                    existing.setDescription(details.getDescription());
                    return ResponseEntity.ok(experienceRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExperience(@PathVariable Long id) {
        return experienceRepository.findById(id)
                .map(existing -> {
                    experienceRepository.delete(existing);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
