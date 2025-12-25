package com.ocp.study.service;

import com.ocp.study.entity.Certification;
import com.ocp.study.repository.CertificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class CertificationService {

    private final CertificationRepository certificationRepository;

    @Transactional(readOnly = true)
    public org.springframework.data.domain.Page<Certification> getAllCertifications(
            org.springframework.data.domain.Pageable pageable) {
        return certificationRepository.findAll(pageable);
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

    public Object getCertificationById(UUID id) {
        Certification cert = certificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Certification not found"));

        // Manually construct response with topics
        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("id", cert.getId());
        response.put("name", cert.getName());
        response.put("code", cert.getCode());
        response.put("description", cert.getDescription());
        response.put("icon", cert.getIcon());
        response.put("durationMonths", cert.getDurationMonths());
        response.put("startDate", cert.getStartDate());
        response.put("endDate", cert.getEndDate());

        // Explicitly include topics
        java.util.List<java.util.Map<String, Object>> topicList = cert.getTopics().stream()
                .map(t -> {
                    java.util.Map<String, Object> topicMap = new java.util.HashMap<>();
                    topicMap.put("id", t.getId());
                    topicMap.put("name", t.getName());
                    topicMap.put("description", t.getDescription());
                    topicMap.put("icon", t.getIcon());
                    topicMap.put("month", t.getMonth());
                    return topicMap;
                })
                .collect(java.util.stream.Collectors.toList());

        response.put("topics", topicList);

        return response;
    }

    private Certification getCertForUpdate(UUID id) {
        return certificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Certification not found"));
    }

    @Transactional
    public Certification updateCertification(UUID id, com.ocp.study.dto.CreateCertificationRequest request) {
        Certification certification = getCertForUpdate(id);
        certification.setName(request.getName());
        certification.setCode(request.getCode());
        certification.setDescription(request.getDescription());
        certification.setIcon(request.getIcon());
        certification.setDurationMonths(request.getDurationMonths());

        if (request.getTopics() != null) {
            // Map existing topics by ID for easy lookup
            java.util.Map<UUID, com.ocp.study.entity.Topic> existingTopics = new java.util.HashMap<>();
            for (com.ocp.study.entity.Topic t : certification.getTopics()) {
                existingTopics.put(t.getId(), t);
            }

            java.util.List<com.ocp.study.entity.Topic> updatedTopics = new java.util.ArrayList<>();

            for (com.ocp.study.dto.CreateTopicRequest tReq : request.getTopics()) {
                if (tReq.getId() != null && existingTopics.containsKey(tReq.getId())) {
                    // Update existing
                    com.ocp.study.entity.Topic existing = existingTopics.get(tReq.getId());
                    existing.setName(tReq.getName());
                    existing.setDescription(tReq.getDescription());
                    existing.setIcon(tReq.getIcon());
                    existing.setMonth(tReq.getMonth());
                    // Preserve other fields
                    updatedTopics.add(existing);
                    existingTopics.remove(tReq.getId()); // Remove processed
                } else {
                    // Create new
                    com.ocp.study.entity.Topic newTopic = new com.ocp.study.entity.Topic();
                    newTopic.setName(tReq.getName());
                    newTopic.setDescription(tReq.getDescription());
                    newTopic.setIcon(tReq.getIcon());
                    newTopic.setMonth(tReq.getMonth());
                    newTopic.setCertification(certification);
                    newTopic.setOrderIndex(updatedTopics.size());
                    newTopic.setEstimatedDays(7);
                    updatedTopics.add(newTopic);
                }
            }

            // Orphan removal logic:
            // Simply setting the list to new list should trigger orphan removal for items
            // NOT in the new list,
            // PROVIDED we are modifying the SAME collection instance or using setTopics
            // with orphanRemoval support.
            // But we actually created a NEW list `updatedTopics`.
            // Safer way for Hibernate OneToMany is to clear and addTo the EXISTING
            // collection?
            // Or just setTopics works if Hibernate manages it.
            // Better: update the existing collection instance.

            certification.getTopics().clear();
            certification.getTopics().addAll(updatedTopics);
        }

        return certificationRepository.save(certification);
    }

    @Transactional
    public void deleteCertification(UUID id) {
        if (!certificationRepository.existsById(id)) {
            throw new RuntimeException("Certification not found with id: " + id);
        }
        certificationRepository.deleteById(id);
    }
}
