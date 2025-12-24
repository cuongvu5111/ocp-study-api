package com.ocp.study.service;

import com.ocp.study.entity.Certification;
import com.ocp.study.repository.CertificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CertificationService {

    private final CertificationRepository certificationRepository;

    @Transactional(readOnly = true)
    public List<Certification> getAllCertifications() {
        return certificationRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Certification getCertificationById(Long id) {
        return certificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Certification not found with id: " + id));
    }
}
