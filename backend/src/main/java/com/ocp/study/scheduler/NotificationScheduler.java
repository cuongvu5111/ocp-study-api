package com.ocp.study.scheduler;

import com.ocp.study.entity.User;
import com.ocp.study.repository.FlashcardReviewRepository;
import com.ocp.study.repository.StudySessionRepository;
import com.ocp.study.repository.UserRepository;
import com.ocp.study.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Notification Scheduler - Scheduled jobs để tạo notifications tự động.
 * 
 * @author OCP Study Team
 * @since 1.0.0
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationScheduler {

    private final NotificationService notificationService;
    private final UserRepository userRepository;
    private final StudySessionRepository studySessionRepository;
    private final FlashcardReviewRepository flashcardReviewRepository;

    /**
     * Streak Warning Job - Chạy mỗi ngày lúc 6:00 PM
     * Cảnh báo users có streak nhưng chưa học hôm nay
     * Cron: giây phút giờ ngày tháng thứ
     */
    @Scheduled(cron = "${notification.cron.streak-warning:0 0 18 * * ?}")
    public void sendStreakWarnings() {
        log.info("🔔 Starting streak warning notification job...");

        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);

        List<User> allUsers = userRepository.findAll();
        int sent = 0;

        for (User user : allUsers) {
            try {
                String usrId = user.getId().toString();

                // Kiểm tra xem user có học hôm qua không (có streak)
                Optional<LocalDate> lastStudyDate = studySessionRepository.findLastStudyDate(usrId);

                if (lastStudyDate.isEmpty()) {
                    // User chưa từng học → không có streak → skip
                    continue;
                }

                // Nếu ngày học cuối cùng là hôm qua (có streak đang active)
                // VÀ chưa học hôm nay → cảnh báo
                if (lastStudyDate.get().equals(yesterday)) {
                    // Tính current streak
                    int currentStreak = calculateCurrentStreak(usrId, today);

                    if (currentStreak > 0) {
                        notificationService.generateStreakWarning(user.getId(), currentStreak);
                        sent++;
                        log.info("Sent streak warning to user {}: {} days streak at risk",
                                user.getUsername(), currentStreak);
                    }
                }
            } catch (Exception e) {
                log.error("Failed to process streak warning for user {}: {}",
                        user.getUsername(), e.getMessage());
            }
        }

        log.info("✅ Streak warning job completed. Sent: {} notifications", sent);
    }

    /**
     * Review Due Job - Chạy mỗi ngày lúc 8:00 AM
     * Thông báo users có flashcards đến hạn review
     */
    @Scheduled(cron = "${notification.cron.review-due:0 0 8 * * ?}")
    public void sendReviewDueNotifications() {
        log.info("🔔 Starting review due notification job...");

        List<User> allUsers = userRepository.findAll();
        LocalDateTime now = LocalDateTime.now();
        int sent = 0;

        for (User user : allUsers) {
            try {
                // Đếm flashcards đến hạn review
                Long dueCount = flashcardReviewRepository.countDueReviewsByUser(user, now);

                if (dueCount != null && dueCount > 0) {
                    notificationService.generateReviewDueNotification(user.getId(), dueCount.intValue());
                    sent++;
                    log.info("Sent review due notification to user {}: {} flashcards due",
                            user.getUsername(), dueCount);
                }
            } catch (Exception e) {
                log.error("Failed to process review due for user {}: {}",
                        user.getUsername(), e.getMessage());
            }
        }

        log.info("✅ Review due job completed. Sent: {} notifications", sent);
    }

    /**
     * Tính streak hiện tại của user (simplified version)
     */
    private int calculateCurrentStreak(String userId, LocalDate today) {
        var sessions = studySessionRepository.findByUserIdOrderByStudyDateDesc(userId);

        if (sessions.isEmpty()) {
            return 0;
        }

        int streak = 0;
        LocalDate expectedDate = today.minusDays(1); // Bắt đầu từ hôm qua (vì chưa học hôm nay)

        for (var session : sessions) {
            if (session.getStudyDate().equals(expectedDate)) {
                streak++;
                expectedDate = expectedDate.minusDays(1);
            } else if (session.getStudyDate().isBefore(expectedDate)) {
                break;
            }
        }

        return streak;
    }
}
