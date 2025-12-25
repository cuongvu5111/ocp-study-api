package com.ocp.study.service;

import com.ocp.study.dto.NotificationDTO;
import com.ocp.study.entity.Notification;
import com.ocp.study.entity.Notification.NotificationType;
import com.ocp.study.entity.User;
import com.ocp.study.repository.NotificationRepository;
import com.ocp.study.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service xử lý logic Notification.
 * 
 * @author OCP Study Team
 * @since 1.0.0
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    /**
     * Tạo notification mới
     */
    @Transactional
    public Notification createNotification(UUID userId, NotificationType type,
            String title, String message, String actionUrl) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        Notification notification = Notification.builder()
                .user(user)
                .type(type)
                .title(title)
                .message(message)
                .actionUrl(actionUrl)
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();

        notification = notificationRepository.save(notification);
        log.info("Created notification {} for user {}", type, userId);

        return notification;
    }

    /**
     * Lấy notifications với pagination
     */
    @Transactional(readOnly = true)
    public Page<NotificationDTO> getNotifications(UUID userId, Pageable pageable) {
        Page<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
        return notifications.map(this::toDTO);
    }

    /**
     * Lấy số lượng notification chưa đọc
     */
    @Transactional(readOnly = true)
    public int getUnreadCount(UUID userId) {
        return notificationRepository.countUnreadByUserId(userId);
    }

    /**
     * Mark notification là đã đọc
     */
    @Transactional
    public void markAsRead(UUID notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found: " + notificationId));

        if (!notification.getIsRead()) {
            notification.setIsRead(true);
            notification.setReadAt(LocalDateTime.now());
            notificationRepository.save(notification);
            log.info("Marked notification {} as read", notificationId);
        }
    }

    /**
     * Mark tất cả notifications của user là đã đọc
     */
    @Transactional
    public void markAllAsRead(UUID userId) {
        notificationRepository.markAllAsReadByUserId(userId);
        log.info("Marked all notifications as read for user {}", userId);
    }

    /**
     * Xóa notification
     */
    @Transactional
    public void deleteNotification(UUID notificationId) {
        notificationRepository.deleteById(notificationId);
        log.info("Deleted notification {}", notificationId);
    }

    /**
     * Convert entity sang DTO
     */
    private NotificationDTO toDTO(Notification notification) {
        return NotificationDTO.builder()
                .id(notification.getId())
                .type(notification.getType())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .actionUrl(notification.getActionUrl())
                .isRead(notification.getIsRead())
                .createdAt(notification.getCreatedAt())
                .readAt(notification.getReadAt())
                .relativeTime(getRelativeTime(notification.getCreatedAt()))
                .build();
    }

    /**
     * Tính relative time string
     */
    private String getRelativeTime(LocalDateTime dateTime) {
        Duration duration = Duration.between(dateTime, LocalDateTime.now());

        long minutes = duration.toMinutes();
        if (minutes < 1)
            return "Vừa xong";
        if (minutes < 60)
            return minutes + " phút trước";

        long hours = duration.toHours();
        if (hours < 24)
            return hours + " giờ trước";

        long days = duration.toDays();
        if (days < 7)
            return days + " ngày trước";
        if (days < 30)
            return (days / 7) + " tuần trước";

        long months = days / 30;
        return months + " tháng trước";
    }

    // ===== Auto-generation methods =====

    /**
     * Generate streak warning notification
     */
    @Transactional
    public void generateStreakWarning(UUID userId, int currentStreak) {
        String title = "⚠️ Streak sắp mất!";
        String message = String.format("Bạn chưa học hôm nay. Học ngay để giữ streak %d ngày!", currentStreak);
        String actionUrl = "/dashboard";

        createNotification(userId, NotificationType.STREAK_WARNING, title, message, actionUrl);
    }

    /**
     * Generate review due notification
     */
    @Transactional
    public void generateReviewDueNotification(UUID userId, int flashcardCount) {
        String title = "📚 Flashcard đến hạn";
        String message = String.format("Bạn có %d flashcards cần ôn tập hôm nay", flashcardCount);
        String actionUrl = "/flashcards/review";

        createNotification(userId, NotificationType.REVIEW_DUE, title, message, actionUrl);
    }

    /**
     * Generate quiz suggestion notification
     */
    @Transactional
    public void generateQuizSuggestion(UUID userId, String topicName) {
        String title = "🎯 Quiz mới";
        String message = String.format("Topic '%s' - Test kiến thức của bạn", topicName);
        String actionUrl = "/quiz";

        createNotification(userId, NotificationType.QUIZ_SUGGESTION, title, message, actionUrl);
    }

    /**
     * Generate achievement notification
     */
    @Transactional
    public void generateAchievement(UUID userId, String achievementName, String description) {
        String title = "🏆 " + achievementName;
        String message = description;
        String actionUrl = "/profile/achievements";

        createNotification(userId, NotificationType.ACHIEVEMENT, title, message, actionUrl);
    }

    /**
     * Generate progress milestone notification
     */
    @Transactional
    public void generateProgressMilestone(UUID userId, String milestone) {
        String title = "🎉 Chúc mừng!";
        String message = milestone;
        String actionUrl = "/dashboard";

        createNotification(userId, NotificationType.PROGRESS_MILESTONE, title, message, actionUrl);
    }
}
