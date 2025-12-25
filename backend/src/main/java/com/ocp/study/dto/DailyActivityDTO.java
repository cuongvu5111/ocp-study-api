package com.ocp.study.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * DTO cho thông tin hoạt động học tập trong một ngày.
 * 
 * @author OCP Study Team
 * @since 1.0.0
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DailyActivityDTO {

    /**
     * Ngày
     */
    private LocalDate date;

    /**
     * Số phút đã học
     */
    private Integer minutesStudied;

    /**
     * Số flashcards đã review
     */
    private Integer flashcardsReviewed;

    /**
     * Số câu hỏi đã trả lời
     */
    private Integer questionsAnswered;

    /**
     * Có hoạt động học tập không
     */
    private Boolean hasActivity;

    /**
     * Day of week (Mon, Tue, ...)
     */
    private String dayOfWeek;
}
