package com.portfolio.backend.controller;

import com.portfolio.backend.model.Project;
import com.portfolio.backend.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectRepository projectRepository;

    @Autowired
    public ProjectController(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    @GetMapping
    public ResponseEntity<List<Project>> getAllProjects() {
        return ResponseEntity.ok(projectRepository.findAllByOrderBySortOrderAsc());
    }

    @PostMapping
    public ResponseEntity<Project> createProject(@RequestBody Project project) {
        int maxOrder = projectRepository.findAll().stream()
                .mapToInt(p -> p.getSortOrder() != null ? p.getSortOrder() : 0)
                .max()
                .orElse(0);
        project.setSortOrder(maxOrder + 1);
        return ResponseEntity.ok(projectRepository.save(project));
    }

    @PutMapping("/reorder")
    public ResponseEntity<?> reorderProjects(@RequestBody List<Long> orderedIds) {
        for (int i = 0; i < orderedIds.size(); i++) {
            Long id = orderedIds.get(i);
            int finalI = i;
            projectRepository.findById(id).ifPresent(project -> {
                project.setSortOrder(finalI);
                projectRepository.save(project);
            });
        }
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Project> updateProject(@PathVariable Long id, @RequestBody Project details) {
        return projectRepository.findById(id)
                .map(existing -> {
                    existing.setTitle(details.getTitle());
                    existing.setDescription(details.getDescription());
                    existing.setCategory(details.getCategory());
                    existing.setTag(details.getTag());
                    existing.setDate(details.getDate());
                    existing.setImageUrl(details.getImageUrl());
                    existing.setTechStack(details.getTechStack());
                    existing.setProjectUrl(details.getProjectUrl());
                    return ResponseEntity.ok(projectRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable Long id) {
        return projectRepository.findById(id)
                .map(existing -> {
                    projectRepository.delete(existing);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
