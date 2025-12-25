package com.ocp.study.dto;

import lombok.Data;
import java.util.List;
import java.util.UUID;

/**
 * DTO cho request tạo câu hỏi mới.
 */
@Data
public class CreateQuestionRequest {
    private UUID topicId;
    private String content;
    private String codeSnippet;
    private String questionType;
    private Integer difficulty;
    private String explanation;
    private List<OptionRequest> options;

    @Data
    public static class OptionRequest {
        private String key;
        private String content;
        private boolean isCorrect;
    }
}
