package com.ocp.study.dto;

import lombok.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * DTO cho Dashboard statistics.
 * 
 * @author OCP Study Team
 * @since 1.0.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardDTO {

    // Tổng quan tiến độ
    private Double overallProgress; // % hoàn thành tổng thể
    private Integer completedTopics; // Số topics đã hoàn thành
    private Integer totalTopics; // Tổng số topics
    private Integer completedSubtopics; // Số subtopics đã hoàn thành
    private Integer totalSubtopics; // Tổng số subtopics

    // Thời gian học
    private Long totalMinutesStudied; // Tổng thời gian học (phút)
    private Integer studyDays; // Số ngày đã học
    private Long currentStreak; // Streak hiện tại

    // Flashcards
    private Long totalFlashcards; // Tổng số flashcards
    private Long flashcardsDue; // Flashcards cần review

    // Quiz
    private Long totalQuestions; // Tổng số câu hỏi
    private Integer quizzesTaken; // Số quiz đã làm
    private Double averageQuizScore; // Điểm trung bình

    // Calendar data (cho 30 ngày gần nhất)
    private List<StudyDayDTO> studyCalendar;

    // Today's tasks
    private List<SubtopicDTO> todaySubtopics;

    /**
     * DTO cho mỗi ngày học trong calendar
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class StudyDayDTO {
        private LocalDate date;
        private Integer minutesStudied;
        private Integer flashcardsReviewed;
        private Integer questionsAnswered;
        private Boolean hasActivity;
    }
}
