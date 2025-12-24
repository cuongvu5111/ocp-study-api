package com.ocp.study.repository;

import com.ocp.study.entity.Subtopic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository cho Subtopic entity.
 * 
 * @author OCP Study Team
 * @since 1.0.0
 */
@Repository
public interface SubtopicRepository extends JpaRepository<Subtopic, Long> {

    /**
     * Lấy subtopics theo topic
     */
    List<Subtopic> findByTopicIdOrderByOrderIndexAsc(Long topicId);

    /**
     * Lấy subtopics theo priority
     */
    List<Subtopic> findByPriorityOrderByTopicIdAscOrderIndexAsc(Subtopic.Priority priority);
}
