package com.ocp.study.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Entity cho hệ thống thông báo.
 * 
 * @author OCP Study Team
 * @since 1.0.0
 */
@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    /**
     * User nhận notification
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /**
     * Loại notification
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private NotificationType type;

    /**
     * Tiêu đề notification
     */
    @Column(nullable = false)
    private String title;

    /**
     * Nội dung notification
     */
    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    /**
     * URL để navigate khi click (deep link)
     */
    @Column(length = 500)
    private String actionUrl;

    /**
     * Đã đọc chưa
     */
    @Column(nullable = false)
    @Builder.Default
    private Boolean isRead = false;

    /**
     * Thời gian tạo
     */
    @Column(name = "created_at", nullable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    /**
     * Thời gian đọc
     */
    @Column(name = "read_at")
    private LocalDateTime readAt;

    /**
     * Enum định nghĩa các loại notification
     */
    public enum NotificationType {
        STREAK_WARNING, // Cảnh báo streak sắp mất
        REVIEW_DUE, // Flashcards đến hạn review
        QUIZ_SUGGESTION, // Đề xuất làm quiz
        ACHIEVEMENT, // Đạt achievement
        PROGRESS_MILESTONE // Hoàn thành milestone
    }
}
