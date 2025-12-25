package com.ocp.study.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Entity theo dõi tiến độ học của user cho từng subtopic.
 * 
 * @author OCP Study Team
 * @since 1.0.0
 */
@Entity
@Table(name = "topic_progress", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "user_id", "subtopic_id" })
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TopicProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    /**
     * User ID (tạm thời dùng String, sau có thể link với User entity)
     */
    @Column(name = "user_id", nullable = false)
    private String userId;

    /**
     * Topic được theo dõi
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "topic_id", nullable = false)
    private Topic topic;

    /**
     * Subtopic được theo dõi
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subtopic_id", nullable = false)
    private Subtopic subtopic;

    /**
     * Trạng thái học: NOT_STARTED, IN_PROGRESS, COMPLETED
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Status status = Status.NOT_STARTED;

    /**
     * Ghi chú cá nhân
     */
    @Column(columnDefinition = "TEXT")
    private String notes;

    /**
     * % hoàn thành (0-100)
     */
    @Column(name = "completion_percentage")
    @Builder.Default
    private Integer completionPercentage = 0;

    /**
     * Thời gian bắt đầu học
     */
    @Column(name = "started_at")
    private LocalDateTime startedAt;

    /**
     * Thời gian hoàn thành
     */
    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    /**
     * Enum định nghĩa trạng thái học
     */
    public enum Status {
        NOT_STARTED, // Chưa bắt đầu
        IN_PROGRESS, // Đang học
        COMPLETED // Đã hoàn thành
    }

    /**
     * Đánh dấu bắt đầu học
     */
    public void markStarted() {
        if (status == Status.NOT_STARTED) {
            status = Status.IN_PROGRESS;
            startedAt = LocalDateTime.now();
        }
    }

    /**
     * Đánh dấu hoàn thành
     */
    public void markCompleted() {
        status = Status.COMPLETED;
        completionPercentage = 100;
        completedAt = LocalDateTime.now();
    }
}
