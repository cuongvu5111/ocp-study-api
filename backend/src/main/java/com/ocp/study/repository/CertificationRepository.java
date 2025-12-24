package com.ocp.study.repository;

import com.ocp.study.entity.Certification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CertificationRepository extends JpaRepository<Certification, Long> {
    Optional<Certification> findByCode(String code);
}
