package com.ocp.study.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

/**
 * Entity theo dõi study session hàng ngày (cho streak calendar).
 * 
 * @author OCP Study Team
 * @since 1.0.0
 */
@Entity
@Table(name = "study_sessions", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "user_id", "study_date" })
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudySession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * User ID
     */
    @Column(name = "user_id", nullable = false)
    private String userId;

    /**
     * Ngày học
     */
    @Column(name = "study_date", nullable = false)
    private LocalDate studyDate;

    /**
     * Số phút đã học trong ngày
     */
    @Column(name = "minutes_studied", nullable = false)
    @Builder.Default
    private Integer minutesStudied = 0;

    /**
     * Số flashcards đã review
     */
    @Column(name = "flashcards_reviewed")
    @Builder.Default
    private Integer flashcardsReviewed = 0;

    /**
     * Số câu quiz đã làm
     */
    @Column(name = "questions_answered")
    @Builder.Default
    private Integer questionsAnswered = 0;

    /**
     * Ghi chú về ngày học
     */
    @Column(columnDefinition = "TEXT")
    private String notes;

    /**
     * Thêm thời gian học
     */
    public void addStudyTime(int minutes) {
        this.minutesStudied += minutes;
    }
}
