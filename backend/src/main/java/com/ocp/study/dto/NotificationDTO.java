package com.ocp.study.dto;

import com.ocp.study.entity.Notification.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * DTO cho Notification.
 * 
 * @author OCP Study Team
 * @since 1.0.0
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDTO {

    private UUID id;
    private NotificationType type;
    private String title;
    private String message;
    private String actionUrl;
    private Boolean isRead;
    private LocalDateTime createdAt;
    private LocalDateTime readAt;

    /**
     * Relative time string (e.g., "2 giờ trước")
     */
    private String relativeTime;
}
