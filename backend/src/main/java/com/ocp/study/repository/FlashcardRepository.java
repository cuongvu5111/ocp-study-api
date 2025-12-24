package com.ocp.study.repository;

import com.ocp.study.entity.Flashcard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository cho Flashcard entity.
 * 
 * @author OCP Study Team
 * @since 1.0.0
 */
@Repository
public interface FlashcardRepository extends JpaRepository<Flashcard, Long> {

    /**
     * Lấy flashcards theo topic
     */
    List<Flashcard> findByTopicIdOrderByCreatedAtDesc(Long topicId);

    /**
     * Lấy flashcards theo subtopic
     */
    List<Flashcard> findBySubtopicIdOrderByCreatedAtDesc(Long subtopicId);

    long countByTopic_Certification_Id(Long certificationId);

    /**
     * Lấy flashcards cần review (next_review <= now)
     */
    @Query("SELECT f FROM Flashcard f WHERE f.nextReview IS NULL OR f.nextReview <= :now ORDER BY f.nextReview ASC")
    List<Flashcard> findCardsToReview(LocalDateTime now);

    /**
     * Lấy flashcards cần review theo topic
     */
    @Query("SELECT f FROM Flashcard f WHERE f.topic.id = :topicId AND (f.nextReview IS NULL OR f.nextReview <= :now) ORDER BY f.nextReview ASC")
    List<Flashcard> findCardsToReviewByTopic(Long topicId, LocalDateTime now);

    /**
     * Đếm số flashcards theo topic
     */
    long countByTopicId(Long topicId);
}
