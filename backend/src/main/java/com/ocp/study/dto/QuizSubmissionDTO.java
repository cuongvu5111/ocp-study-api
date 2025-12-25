package com.ocp.study.dto;

import lombok.*;

import java.util.UUID;

/**
 * DTO cho Quiz submission request.
 * 
 * @author OCP Study Team
 * @since 1.0.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizSubmissionDTO {

    private String quizType; // QUICK_QUIZ, TOPIC_QUIZ, MOCK_EXAM
    private UUID topicId; // Optional - for topic quiz
    private String topicName; // Optional - for display
    private Integer totalQuestions;
    private Integer correctAnswers;
    private Integer scorePercentage;
    private Integer timeSpent; // seconds
}
