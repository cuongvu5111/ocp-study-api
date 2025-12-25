package com.ocp.study.dto;

import com.ocp.study.entity.Question;
import lombok.*;

import java.util.List;
import java.util.UUID;

/**
 * DTO cho Question (câu hỏi quiz).
 * 
 * @author OCP Study Team
 * @since 1.0.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionDTO {
    private UUID id;
    private UUID topicId;
    private String topicName;
    private String content;
    private String codeSnippet;
    private Question.QuestionType questionType;
    private List<OptionDTO> options;
    private String explanation;
    private Integer difficulty;

    /**
     * DTO cho mỗi đáp án
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OptionDTO {
        private UUID id;
        private String optionKey;
        private String content;
        private Boolean isCorrect; // Chỉ trả về khi show answer
    }
}
