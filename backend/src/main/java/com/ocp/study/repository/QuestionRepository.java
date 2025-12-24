package com.ocp.study.repository;

import com.ocp.study.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository cho Question entity.
 * 
 * @author OCP Study Team
 * @since 1.0.0
 */
@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

    /**
     * Lấy questions theo topic
     */
    List<Question> findByTopicId(Long topicId);

    /**
     * Lấy questions với options (eager fetch)
     */
    @Query("SELECT DISTINCT q FROM Question q LEFT JOIN FETCH q.options WHERE q.topic.id = :topicId")
    List<Question> findByTopicIdWithOptions(Long topicId);

    /**
     * Lấy ngẫu nhiên N câu hỏi để làm quiz
     */
    @Query(value = "SELECT * FROM questions ORDER BY RANDOM() LIMIT :limit", nativeQuery = true)
    List<Question> findRandomQuestions(int limit);

    /**
     * Lấy ngẫu nhiên N câu hỏi theo topic
     */
    @Query(value = "SELECT * FROM questions WHERE topic_id = :topicId ORDER BY RANDOM() LIMIT :limit", nativeQuery = true)
    List<Question> findRandomQuestionsByTopic(Long topicId, int limit);

    /**
     * Đếm số câu hỏi theo topic
     */
    long countByTopicId(Long topicId);
}
