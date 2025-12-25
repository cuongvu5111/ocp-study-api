package com.ocp.study.repository;

import com.ocp.study.entity.Subtopic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Repository cho Subtopic entity.
 * 
 * @author OCP Study Team
 * @since 1.0.0
 */
@Repository
public interface SubtopicRepository extends JpaRepository<Subtopic, UUID> {

    /**
     * Lấy subtopics theo topic
     */
    List<Subtopic> findByTopicIdOrderByOrderIndexAsc(UUID topicId);

    long countByTopic_Certification_Id(UUID certificationId);

    /**
     * Lấy subtopics theo priority
     */
    List<Subtopic> findByPriorityOrderByTopicIdAscOrderIndexAsc(Subtopic.Priority priority);
}
