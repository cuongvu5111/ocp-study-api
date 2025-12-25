package com.ocp.study.service;

import com.ocp.study.dto.SubtopicDTO;
import com.ocp.study.dto.TopicDTO;
import com.ocp.study.entity.Subtopic;
import com.ocp.study.entity.Topic;
import com.ocp.study.entity.TopicProgress;
import com.ocp.study.repository.SubtopicRepository;
import com.ocp.study.repository.TopicProgressRepository;
import com.ocp.study.repository.TopicRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Service xử lý logic cho Topics và Subtopics.
 * 
 * @author OCP Study Team
 * @since 1.0.0
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TopicService {

        private final TopicRepository topicRepository;
        private final SubtopicRepository subtopicRepository;
        private final TopicProgressRepository progressRepository;

        /**
         * Lấy tất cả topics với progress của user
         */
        /**
         * Lấy tất cả topics với progress của user theo certificate
         */
        public org.springframework.data.domain.Page<TopicDTO> getAllTopics(String userId, Long certificationId,
                        org.springframework.data.domain.Pageable pageable) {
                org.springframework.data.domain.Page<Topic> topicsPage;
                if (certificationId != null) {
                        // Need to update repository to return Page
                        topicsPage = topicRepository.findAllByCertificationId(certificationId, pageable);
                } else {
                        topicsPage = topicRepository.findAll(pageable);
                }

                List<TopicProgress> userProgress = progressRepository.findByUserId(userId);

                // Map progress theo subtopicId để lookup nhanh
                Map<Long, TopicProgress> progressMap = userProgress.stream()
                                .collect(Collectors.toMap(
                                                p -> p.getSubtopic().getId(),
                                                p -> p,
                                                (a, b) -> b));

                return topicsPage.map(topic -> mapToDTO(topic, progressMap));
        }

        /**
         * Lấy topic theo ID với subtopics và progress
         */
        public TopicDTO getTopicById(Long id, String userId) {
                Topic topic = topicRepository.findByIdWithSubtopics(id);
                if (topic == null) {
                        throw new RuntimeException("Topic không tồn tại: " + id);
                }

                List<TopicProgress> userProgress = progressRepository.findByUserIdAndTopicId(userId, id);
                Map<Long, TopicProgress> progressMap = userProgress.stream()
                                .collect(Collectors.toMap(
                                                p -> p.getSubtopic().getId(),
                                                p -> p,
                                                (a, b) -> b));

                return mapToDTO(topic, progressMap);
        }

        /**
         * Lấy topics theo tháng
         */
        public List<TopicDTO> getTopicsByMonth(Integer month, String userId) {
                List<Topic> topics = topicRepository.findByMonthOrderByOrderIndexAsc(month);
                List<TopicProgress> userProgress = progressRepository.findByUserId(userId);

                Map<Long, TopicProgress> progressMap = userProgress.stream()
                                .collect(Collectors.toMap(
                                                p -> p.getSubtopic().getId(),
                                                p -> p,
                                                (a, b) -> b));

                return topics.stream()
                                .map(topic -> mapToDTO(topic, progressMap))
                                .collect(Collectors.toList());
        }

        /**
         * Map Topic entity sang DTO với progress info
         */
        private TopicDTO mapToDTO(Topic topic, Map<Long, TopicProgress> progressMap) {
                List<SubtopicDTO> subtopicDTOs = topic.getSubtopics().stream()
                                .map(subtopic -> mapSubtopicToDTO(subtopic, progressMap.get(subtopic.getId())))
                                .collect(Collectors.toList());

                int totalSubtopics = subtopicDTOs.size();
                int completedSubtopics = (int) subtopicDTOs.stream()
                                .filter(s -> s.getStatus() == TopicProgress.Status.COMPLETED)
                                .count();

                double progressPercentage = totalSubtopics > 0
                                ? (double) completedSubtopics / totalSubtopics * 100
                                : 0;

                return TopicDTO.builder()
                                .id(topic.getId())
                                .name(topic.getName())
                                .description(topic.getDescription())
                                .icon(topic.getIcon())
                                .month(topic.getMonth())
                                .orderIndex(topic.getOrderIndex())
                                .estimatedDays(topic.getEstimatedDays())
                                .subtopics(subtopicDTOs)
                                .completedSubtopics(completedSubtopics)
                                .totalSubtopics(totalSubtopics)
                                .progressPercentage(progressPercentage)
                                .build();
        }

        /**
         * Map Subtopic entity sang DTO với progress
         */
        private SubtopicDTO mapSubtopicToDTO(Subtopic subtopic, TopicProgress progress) {
                return SubtopicDTO.builder()
                                .id(subtopic.getId())
                                .topicId(subtopic.getTopic().getId())
                                .name(subtopic.getName())
                                .description(subtopic.getDescription())
                                .difficulty(subtopic.getDifficulty())
                                .estimatedDays(subtopic.getEstimatedDays())
                                .priority(subtopic.getPriority())
                                .orderIndex(subtopic.getOrderIndex())
                                .status(progress != null ? progress.getStatus() : TopicProgress.Status.NOT_STARTED)
                                .completionPercentage(progress != null ? progress.getCompletionPercentage() : 0)
                                .build();
        }

        /**
         * Tạo topic mới
         */
        @Transactional
        public TopicDTO createTopic(com.ocp.study.dto.CreateTopicRequest request, Long certificationId) {
                if (certificationId == null) {
                        throw new IllegalArgumentException("Certification ID is required");
                }

                com.ocp.study.entity.Certification cert = new com.ocp.study.entity.Certification();
                cert.setId(certificationId); // Reference by ID

                Topic topic = new Topic();
                topic.setName(request.getName());
                topic.setDescription(request.getDescription());
                topic.setIcon(request.getIcon());
                topic.setMonth(request.getMonth());
                topic.setCertification(cert);
                topic.setOrderIndex(100); // Default order for now
                topic.setEstimatedDays(7);

                // Handle subtopics
                if (request.getSubtopics() != null && !request.getSubtopics().isEmpty()) {
                        for (com.ocp.study.dto.CreateTopicRequest.CreateSubtopicRequest subtopicReq : request
                                        .getSubtopics()) {
                                Subtopic subtopic = new Subtopic();
                                subtopic.setName(subtopicReq.getName());
                                subtopic.setDescription(subtopicReq.getDescription());
                                subtopic.setDifficulty(
                                                subtopicReq.getDifficulty() != null ? subtopicReq.getDifficulty() : 1);
                                subtopic.setEstimatedDays(
                                                subtopicReq.getEstimatedDays() != null ? subtopicReq.getEstimatedDays()
                                                                : 1);
                                subtopic.setOrderIndex(
                                                subtopicReq.getOrderIndex() != null ? subtopicReq.getOrderIndex() : 0);

                                // Parse priority
                                try {
                                        subtopic.setPriority(Subtopic.Priority.valueOf(
                                                        subtopicReq.getPriority() != null ? subtopicReq.getPriority()
                                                                        : "MEDIUM"));
                                } catch (IllegalArgumentException e) {
                                        subtopic.setPriority(Subtopic.Priority.MEDIUM);
                                }

                                topic.addSubtopic(subtopic);
                        }
                }

                topic = topicRepository.save(topic);
                return mapToDTO(topic, new java.util.HashMap<>());
        }

        /**
         * Xóa topic
         */
        @Transactional
        public void deleteTopic(Long id) {
                if (!topicRepository.existsById(id)) {
                        throw new RuntimeException("Topic not found: " + id);
                }
                topicRepository.deleteById(id);
        }

}
