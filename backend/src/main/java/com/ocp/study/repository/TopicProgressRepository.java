package com.ocp.study.repository;

import com.ocp.study.entity.TopicProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository cho TopicProgress entity.
 * 
 * @author OCP Study Team
 * @since 1.0.0
 */
@Repository
public interface TopicProgressRepository extends JpaRepository<TopicProgress, Long> {

    /**
     * Lấy progress theo user và subtopic
     */
    Optional<TopicProgress> findByUserIdAndSubtopicId(String userId, Long subtopicId);

    /**
     * Lấy tất cả progress của user
     */
    List<TopicProgress> findByUserId(String userId);

    /**
     * Lấy progress theo user và topic
     */
    List<TopicProgress> findByUserIdAndTopicId(String userId, Long topicId);

    /**
     * Đếm số subtopics đã hoàn thành theo user
     */
    @Query("SELECT COUNT(p) FROM TopicProgress p WHERE p.userId = :userId AND p.status = 'COMPLETED'")
    long countCompletedByUserId(String userId);

    /**
     * Đếm số subtopics đã hoàn thành theo user và topic
     */
    @Query("SELECT COUNT(p) FROM TopicProgress p WHERE p.userId = :userId AND p.topic.id = :topicId AND p.status = 'COMPLETED'")
    long countCompletedByUserIdAndTopicId(String userId, Long topicId);

    /**
     * Tính % hoàn thành tổng thể
     */
    @Query("SELECT COALESCE(AVG(p.completionPercentage), 0) FROM TopicProgress p WHERE p.userId = :userId")
    Double getAverageCompletionByUserId(String userId);

    /**
     * Đếm số subtopics đã hoàn thành theo user và certification
     */
    @Query("SELECT COUNT(p) FROM TopicProgress p WHERE p.userId = :userId AND p.topic.certification.id = :certificationId AND p.status = 'COMPLETED'")
    long countCompletedByUserIdAndCertificationId(String userId, Long certificationId);

    /**
     * Tính % hoàn thành tổng thể theo certification
     */
    @Query("SELECT COALESCE(AVG(p.completionPercentage), 0) FROM TopicProgress p WHERE p.userId = :userId AND p.topic.certification.id = :certificationId")
    Double getAverageCompletionByUserIdAndCertificationId(String userId, Long certificationId);
}
