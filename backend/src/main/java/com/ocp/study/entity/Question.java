package com.ocp.study.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Entity đại diện cho một câu hỏi Quiz.
 * Hỗ trợ Multiple Choice với nhiều đáp án.
 * 
 * @author OCP Study Team
 * @since 1.0.0
 */
@Entity
@Table(name = "questions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Topic mà câu hỏi thuộc về
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "topic_id", nullable = false)
    private Topic topic;

    /**
     * Nội dung câu hỏi
     */
    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    /**
     * Code snippet đi kèm (nếu có)
     */
    @Column(name = "code_snippet", columnDefinition = "TEXT")
    private String codeSnippet;

    /**
     * Loại câu hỏi: SINGLE_CHOICE hoặc MULTIPLE_CHOICE
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "question_type", nullable = false)
    @Builder.Default
    private QuestionType questionType = QuestionType.SINGLE_CHOICE;

    /**
     * Danh sách các đáp án
     */
    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<QuestionOption> options = new ArrayList<>();

    /**
     * Giải thích đáp án đúng
     */
    @Column(columnDefinition = "TEXT")
    private String explanation;

    /**
     * Độ khó (1-5)
     */
    @Column(nullable = false)
    @Builder.Default
    private Integer difficulty = 3;

    /**
     * Loại câu hỏi
     */
    public enum QuestionType {
        SINGLE_CHOICE, // Chọn 1 đáp án đúng
        MULTIPLE_CHOICE // Chọn nhiều đáp án đúng
    }

    // Helper methods
    public void addOption(QuestionOption option) {
        options.add(option);
        option.setQuestion(this);
    }

    public void removeOption(QuestionOption option) {
        options.remove(option);
        option.setQuestion(null);
    }
}
