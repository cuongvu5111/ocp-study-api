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

    @Transactional
    public Certification createCertification(com.ocp.study.dto.CreateCertificationRequest request) {
        Certification certification = new Certification();
        certification.setName(request.getName());
        certification.setCode(request.getCode());
        certification.setDescription(request.getDescription());
        certification.setIcon(request.getIcon());
        certification.setDurationMonths(request.getDurationMonths());

        Certification savedCert = certificationRepository.save(certification);

        if (request.getTopics() != null) {
            List<com.ocp.study.entity.Topic> topics = request.getTopics().stream().map(t -> {
                com.ocp.study.entity.Topic topic = new com.ocp.study.entity.Topic();
                topic.setName(t.getName());
                topic.setDescription(t.getDescription());
                topic.setIcon(t.getIcon());
                topic.setMonth(t.getMonth());
                topic.setCertification(savedCert);
                // Set default values for other required fields if any
                topic.setOrderIndex(0); // Default, logic can be improved
                topic.setEstimatedDays(7); // Default
                return topic;
            }).collect(java.util.stream.Collectors.toList());

            savedCert.setTopics(topics);
            // JPA cascade will save topics because of CascadeType.ALL
        }

        return savedCert;
    }
}
