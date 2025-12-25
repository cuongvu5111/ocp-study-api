package com.ocp.study.repository;

import com.ocp.study.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Repository cho Question entity.
 * 
 * @author OCP Study Team
 * @since 1.0.0
 */
@Repository
public interface QuestionRepository extends JpaRepository<Question, UUID> {

    /**
     * Lấy questions theo topic
     */
    List<Question> findByTopicId(UUID topicId);

    long countByTopic_Certification_Id(UUID certificationId);

    /**
     * Lấy questions với options (eager fetch)
     */
    @Query("SELECT DISTINCT q FROM Question q LEFT JOIN FETCH q.options WHERE q.topic.id = :topicId")
    List<Question> findByTopicIdWithOptions(UUID topicId);

    /**
     * Lấy ngẫu nhiên N câu hỏi để làm quiz
     */
    @Query(value = "SELECT * FROM questions ORDER BY RANDOM() LIMIT :limit", nativeQuery = true)
    List<Question> findRandomQuestions(int limit);

    /**
     * Lấy ngẫu nhiên N câu hỏi theo topic
     */
    @Query(value = "SELECT * FROM questions WHERE topic_id = :topicId ORDER BY RANDOM() LIMIT :limit", nativeQuery = true)
    List<Question> findRandomQuestionsByTopic(UUID topicId, int limit);

    /**
     * Đếm số câu hỏi theo topic
     */
    long countByTopicId(UUID topicId);
}
