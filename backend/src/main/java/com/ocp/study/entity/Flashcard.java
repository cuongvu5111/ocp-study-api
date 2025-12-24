package com.ocp.study.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Entity đại diện cho một Flashcard để ôn tập.
 * Mỗi flashcard có mặt trước (câu hỏi) và mặt sau (câu trả lời).
 * 
 * @author OCP Study Team
 * @since 1.0.0
 */
@Entity
@Table(name = "flashcards")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Flashcard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Topic mà flashcard thuộc về
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "topic_id", nullable = false)
    private Topic topic;

    /**
     * Subtopic cụ thể (optional)
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subtopic_id")
    private Subtopic subtopic;

    /**
     * Mặt trước - thường là câu hỏi hoặc concept
     */
    @Column(columnDefinition = "TEXT", nullable = false)
    private String front;

    /**
     * Mặt sau - câu trả lời hoặc giải thích
     */
    @Column(columnDefinition = "TEXT", nullable = false)
    private String back;

    /**
     * Code example nếu có
     */
    @Column(name = "code_example", columnDefinition = "TEXT")
    private String codeExample;

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
     * Thời gian review tiếp theo (Spaced Repetition)
     */
    @Column(name = "next_review")
    private LocalDateTime nextReview;

    /**
     * Thời gian tạo
     */
    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    /**
     * Thời gian cập nhật
     */
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    /**
     * Tăng số lần review và cập nhật next review time
     */
    public void markReviewed(boolean correct) {
        reviewCount++;
        if (correct) {
            correctCount++;
            // Spaced Repetition: tăng interval theo số lần đúng liên tiếp
            int intervalDays = (int) Math.pow(2, Math.min(correctCount, 7));
            nextReview = LocalDateTime.now().plusDays(intervalDays);
        } else {
            // Reset nếu sai
            nextReview = LocalDateTime.now().plusHours(4);
        }
    }
}
