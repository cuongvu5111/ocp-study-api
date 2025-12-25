package com.ocp.study.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Entity lưu trữ lịch sử review flashcard của mỗi user.
 * Mỗi user có review data riêng cho mỗi flashcard.
 * 
 * @author OCP Study Team
 * @since 1.0.0
 */
@Entity
@Table(name = "flashcard_reviews", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "user_id", "flashcard_id" })
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlashcardReview {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    /**
     * User đang review flashcard này
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /**
     * Flashcard được review
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "flashcard_id", nullable = false)
    private Flashcard flashcard;

    /**
     * Số lần đã review
     */
    @Column(name = "review_count")
    @Builder.Default
    private Integer reviewCount = 0;

    /**
     * Số lần trả lời đúng
     */
    @Column(name = "correct_count")
    @Builder.Default
    private Integer correctCount = 0;

    /**
     * Độ khó hiện tại (0-5, 0 = dễ nhất)
     */
    @Column(name = "difficulty_level")
    @Builder.Default
    private Integer difficultyLevel = 3;

    /**
     * Thời gian review tiếp theo (Spaced Repetition)
     */
    @Column(name = "next_review")
    private LocalDateTime nextReview;

    /**
     * Lần review cuối
     */
    @Column(name = "last_reviewed")
    private LocalDateTime lastReviewed;

    /**
     * Thời gian tạo record này
     */
    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    /**
     * Mark flashcard as reviewed và update spaced repetition schedule
     */
    public void markReviewed(boolean correct) {
        reviewCount++;
        lastReviewed = LocalDateTime.now();

        if (correct) {
            correctCount++;
            // Giảm độ khó nếu trả lời đúng
            if (difficultyLevel > 0) {
                difficultyLevel--;
            }
            // Spaced Repetition: interval tăng theo độ khó giảm
            int intervalDays = (int) Math.pow(2, 5 - difficultyLevel);
            nextReview = LocalDateTime.now().plusDays(intervalDays);
        } else {
            // Tăng độ khó nếu sai
            if (difficultyLevel < 5) {
                difficultyLevel++;
            }
            // Review lại sớm hơn nếu sai
            nextReview = LocalDateTime.now().plusHours(4);
        }
    }
}
