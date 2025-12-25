package com.ocp.study.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * DTO cho Flashcard.
 * 
 * @author OCP Study Team
 * @since 1.0.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlashcardDTO {
    private UUID id;

    @NotNull(message = "Topic ID là bắt buộc")
    private UUID topicId;

    private UUID subtopicId;

    @NotBlank(message = "Mặt trước không được để trống")
    private String front;

    @NotBlank(message = "Mặt sau không được để trống")
    private String back;

    private String codeExample;
    private Integer reviewCount;
    private Integer correctCount;
    private LocalDateTime nextReview;
    private LocalDateTime createdAt;

    // Thông tin bổ sung
    private String topicName;
    private String subtopicName;
}
