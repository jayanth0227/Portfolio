package com.portfolio.backend.controller;

import com.portfolio.backend.model.Skill;
import com.portfolio.backend.repository.SkillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/skills")
public class SkillController {

    private final SkillRepository skillRepository;

    @Autowired
    public SkillController(SkillRepository skillRepository) {
        this.skillRepository = skillRepository;
    }

    @GetMapping
    public ResponseEntity<List<Skill>> getAllSkills() {
        return ResponseEntity.ok(skillRepository.findAllByOrderBySortOrderAsc());
    }

    @PostMapping
    public ResponseEntity<Skill> createSkill(@RequestBody Skill skill) {
        int maxOrder = skillRepository.findAll().stream()
                .mapToInt(s -> s.getSortOrder() != null ? s.getSortOrder() : 0)
                .max()
                .orElse(0);
        skill.setSortOrder(maxOrder + 1);
        return ResponseEntity.ok(skillRepository.save(skill));
    }

    @PutMapping("/reorder")
    public ResponseEntity<?> reorderSkills(@RequestBody List<Long> orderedIds) {
        for (int i = 0; i < orderedIds.size(); i++) {
            Long id = orderedIds.get(i);
            int finalI = i;
            skillRepository.findById(id).ifPresent(skill -> {
                skill.setSortOrder(finalI);
                skillRepository.save(skill);
            });
        }
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Skill> updateSkill(@PathVariable Long id, @RequestBody Skill details) {
        return skillRepository.findById(id)
                .map(existing -> {
                    existing.setName(details.getName());
                    existing.setCategory(details.getCategory());
                    existing.setIcon(details.getIcon());
                    existing.setIconColor(details.getIconColor());
                    return ResponseEntity.ok(skillRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSkill(@PathVariable Long id) {
        return skillRepository.findById(id)
                .map(existing -> {
                    skillRepository.delete(existing);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
