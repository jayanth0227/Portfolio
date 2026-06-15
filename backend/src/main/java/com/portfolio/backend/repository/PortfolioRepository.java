package com.portfolio.backend.repository;

import com.portfolio.backend.model.PortfolioDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PortfolioRepository extends JpaRepository<PortfolioDetails, Long> {
}
