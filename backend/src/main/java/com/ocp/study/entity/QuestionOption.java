package com.ocp.study.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Entity đại diện cho một đáp án của câu hỏi Quiz.
 * 
 * @author OCP Study Team
 * @since 1.0.0
 */
@Entity
@Table(name = "question_options")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionOption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Câu hỏi mà đáp án thuộc về
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    /**
     * Ký hiệu đáp án: A, B, C, D, E, F
     */
    @Column(name = "option_key", length = 1, nullable = false)
    private String optionKey;

    /**
     * Nội dung đáp án
     */
    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    /**
     * Đây có phải đáp án đúng không
     */
    @Column(name = "is_correct", nullable = false)
    @Builder.Default
    private Boolean isCorrect = false;
}
