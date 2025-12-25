package com.ocp.study.repository;

import com.ocp.study.entity.Flashcard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Repository cho Flashcard entity.
 * 
 * @author OCP Study Team
 * @since 1.0.0
 */
@Repository
public interface FlashcardRepository extends JpaRepository<Flashcard, UUID> {

    /**
     * Lấy flashcards theo topic
     */
    List<Flashcard> findByTopicIdOrderByCreatedAtDesc(UUID topicId);

    org.springframework.data.domain.Page<Flashcard> findByTopicIdOrderByCreatedAtDesc(UUID topicId,
            org.springframework.data.domain.Pageable pageable);

    /**
     * Lấy flashcards theo subtopic
     */
    List<Flashcard> findBySubtopicIdOrderByCreatedAtDesc(UUID subtopicId);

    long countByTopic_Certification_Id(UUID certificationId);

    /**
     * Lấy flashcards cần review (next_review <= now)
     */
    @Query("SELECT f FROM Flashcard f WHERE f.nextReview IS NULL OR f.nextReview <= :now ORDER BY f.nextReview ASC")
    List<Flashcard> findCardsToReview(LocalDateTime now);

    /**
     * Lấy flashcards cần review theo topic
     */
    @Query("SELECT f FROM Flashcard f WHERE f.topic.id = :topicId AND (f.nextReview IS NULL OR f.nextReview <= :now) ORDER BY f.nextReview ASC")
    List<Flashcard> findCardsToReviewByTopic(UUID topicId, LocalDateTime now);

    /**
     * Đếm số flashcards theo topic
     */
    long countByTopicId(UUID topicId);
}
