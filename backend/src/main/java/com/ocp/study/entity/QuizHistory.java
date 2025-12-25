package com.ocp.study.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Entity lưu lịch sử làm quiz của user.
 * 
 * @author OCP Study Team
 * @since 1.0.0
 */
@Entity
@Table(name = "quiz_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    /**
     * User đã làm quiz này
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /**
     * Loại quiz: QUICK_QUIZ, TOPIC_QUIZ, MOCK_EXAM
     */
    @Column(name = "quiz_type", nullable = false, length = 20)
    private String quizType;

    /**
     * Topic ID nếu là topic quiz
     */
    @Column(name = "topic_id")
    private UUID topicId;

    /**
     * Topic name để hiển thị
     */
    @Column(name = "topic_name", length = 200)
    private String topicName;

    /**
     * Tổng số câu hỏi
     */
    @Column(name = "total_questions", nullable = false)
    private Integer totalQuestions;

    /**
     * Số câu trả lời đúng
     */
    @Column(name = "correct_answers", nullable = false)
    private Integer correctAnswers;

    /**
     * Điểm phần trăm
     */
    @Column(name = "score_percentage", nullable = false)
    private Integer scorePercentage;

    /**
     * Thời gian làm bài (seconds)
     */
    @Column(name = "time_spent")
    private Integer timeSpent;

    /**
     * Ngày làm quiz
     */
    @Column(name = "completed_at", nullable = false)
    @Builder.Default
    private LocalDateTime completedAt = LocalDateTime.now();
}
