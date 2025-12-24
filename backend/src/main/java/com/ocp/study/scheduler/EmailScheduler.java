package com.ocp.study.scheduler;

import com.ocp.study.entity.User;
import com.ocp.study.repository.UserRepository;
import com.ocp.study.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Email Scheduler - Scheduled jobs để gửi email tự động.
 * 
 * @author OCP Study Team
 * @since 1.0.0
 */
@Component
@EnableScheduling
public class EmailScheduler {

    @Autowired
    private EmailService emailService;

    @Autowired
    private UserRepository userRepository;

    @Value("${email.enabled:false}")
    private boolean emailEnabled;

    /**
     * Daily Digest - Gửi mỗi ngày lúc 8:00 AM
     * Cron: "0 0 8 * * ?" = giây phút giờ ngày tháng thứ
     */
    @Scheduled(cron = "${email.cron.daily-digest:0 0 8 * * ?}")
    public void sendDailyDigests() {
        if (!emailEnabled) {
            System.out.println("Email is disabled. Skipping daily digest.");
            return;
        }

        System.out.println("📧 Starting daily digest email job...");

        List<User> users = userRepository.findAll().stream()
                .filter(u -> u.getEmail() != null && !u.getEmail().isEmpty())
                .filter(User::getEmailEnabled)
                .filter(User::getDailyDigestEnabled)
                .toList();

        System.out.println("Found " + users.size() + " users with email enabled");

        int sent = 0;
        for (User user : users) {
            try {
                // TODO: Get actual stats from database
                Map<String, Object> stats = new HashMap<>();
                stats.put("flashcardsReviewed", 0);
                stats.put("quizScore", 0);
                stats.put("studyMinutes", 0);

                emailService.sendDailyDigest(user, stats);
                sent++;
            } catch (Exception e) {
                System.err.println("Failed to send daily digest to " + user.getEmail() + ": " + e.getMessage());
            }
        }

        System.out.println("✅ Daily digest job completed. Sent: " + sent + "/" + users.size());
    }

    /**
     * Study Reminder - Gửi mỗi ngày lúc 6:00 PM
     */
    @Scheduled(cron = "${email.cron.study-reminder:0 0 18 * * ?}")
    public void sendStudyReminders() {
        if (!emailEnabled) {
            return;
        }

        System.out.println("📧 Starting study reminder email job...");

        List<User> users = userRepository.findAll().stream()
                .filter(u -> u.getEmail() != null && !u.getEmail().isEmpty())
                .filter(User::getEmailEnabled)
                .toList();

        int sent = 0;
        for (User user : users) {
            try {
                // TODO: Check if user has studied today
                emailService.sendStudyReminder(user);
                sent++;
            } catch (Exception e) {
                System.err.println("Failed to send study reminder to " + user.getEmail() + ": " + e.getMessage());
            }
        }

        System.out.println("✅ Study reminder job completed. Sent: " + sent + "/" + users.size());
    }
}
