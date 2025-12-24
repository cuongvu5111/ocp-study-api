package com.ocp.study.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;

/**
 * DTO cho Quiz submission.
 * 
 * @author OCP Study Team
 * @since 1.0.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizSubmitDTO {

    @NotEmpty(message = "Danh sách câu trả lời không được trống")
    private List<AnswerDTO> answers;

    /**
     * Một câu trả lời
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AnswerDTO {
        @NotNull(message = "Question ID là bắt buộc")
        private Long questionId;

        @NotEmpty(message = "Phải chọn ít nhất một đáp án")
        private List<String> selectedOptions; // ["A"], ["A", "C"] cho multiple choice
    }
}

/**
 * DTO cho Quiz result.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
class QuizResultDTO {
    private Integer score; // Số câu đúng
    private Integer totalQuestions; // Tổng số câu
    private Double percentage; // % đúng
    private List<QuestionResultDTO> results;

    /**
     * Kết quả từng câu
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class QuestionResultDTO {
        private Long questionId;
        private String questionContent;
        private List<String> selectedOptions;
        private List<String> correctOptions;
        private Boolean isCorrect;
        private String explanation;
    }
}
