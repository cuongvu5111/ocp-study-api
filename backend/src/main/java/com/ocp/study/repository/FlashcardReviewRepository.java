package com.ocp.study.repository;

import com.ocp.study.entity.FlashcardReview;
import com.ocp.study.entity.User;
import com.ocp.study.entity.Flashcard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository cho FlashcardReview.
 * 
 * @author OCP Study Team
 * @since 1.0.0
 */
@Repository
public interface FlashcardReviewRepository extends JpaRepository<FlashcardReview, UUID> {

    /**
     * Tìm review của user cho flashcard cụ thể
     */
    Optional<FlashcardReview> findByUserAndFlashcard(User user, Flashcard flashcard);

    /**
     * Lấy tất cả reviews của user
     */
    List<FlashcardReview> findByUser(User user);

    /**
     * Lấy flashcards cần review (nextReview <= now)
     */
    @Query("SELECT fr FROM FlashcardReview fr WHERE fr.user = :user AND fr.nextReview <= :now ORDER BY fr.nextReview ASC")
    List<FlashcardReview> findDueReviewsByUser(@Param("user") User user, @Param("now") LocalDateTime now);

    /**
     * Đếm số flashcards cần review
     */
    @Query("SELECT COUNT(fr) FROM FlashcardReview fr WHERE fr.user = :user AND fr.nextReview <= :now")
    Long countDueReviewsByUser(@Param("user") User user, @Param("now") LocalDateTime now);

    /**
     * Lấy reviews của user theo topic
     */
    @Query("SELECT fr FROM FlashcardReview fr WHERE fr.user = :user AND fr.flashcard.topic.id = :topicId")
    List<FlashcardReview> findByUserAndTopicId(@Param("user") User user, @Param("topicId") UUID topicId);
}
