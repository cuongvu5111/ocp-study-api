package com.ocp.study.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import com.ocp.study.entity.User;

import java.util.Map;

/**
 * Email service để gửi emails cho users.
 * 
 * @author OCP Study Team
 * @since 1.0.0
 */
@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private TemplateEngine templateEngine;

    @Value("${email.from}")
    private String fromEmail;

    @Value("${email.enabled:false}")
    private boolean emailEnabled;

    /**
     * Gửi Daily Digest email cho user.
     */
    public void sendDailyDigest(User user, Map<String, Object> stats) {
        if (!emailEnabled || !user.getEmailEnabled()) {
            return;
        }

        try {
            String subject = "📊 Daily Study Digest - OCP Study";
            String htmlContent = buildEmailFromTemplate("email/daily-digest", Map.of(
                    "username", user.getUsername(),
                    "flashcardsReviewed", stats.getOrDefault("flashcardsReviewed", 0),
                    "quizScore", stats.getOrDefault("quizScore", 0),
                    "studyMinutes", stats.getOrDefault("studyMinutes", 0),
                    "dashboardUrl", "http://localhost:4200/dashboard"));

            sendHtmlEmail(user.getEmail(), subject, htmlContent);
        } catch (Exception e) {
            // Log error but don't fail
            System.err.println("Failed to send daily digest to " + user.getEmail() + ": " + e.getMessage());
        }
    }

    /**
     * Gửi Study Reminder email.
     */
    public void sendStudyReminder(User user) {
        if (!emailEnabled || !user.getEmailEnabled()) {
            return;
        }

        try {
            String subject = "⏰ Study Reminder - OCP Study";
            String htmlContent = buildEmailFromTemplate("email/study-reminder", Map.of(
                    "username", user.getUsername(),
                    "dashboardUrl", "http://localhost:4200/dashboard",
                    "quizUrl", "http://localhost:4200/quiz"));

            sendHtmlEmail(user.getEmail(), subject, htmlContent);
        } catch (Exception e) {
            System.err.println("Failed to send study reminder to " + user.getEmail() + ": " + e.getMessage());
        }
    }

    /**
     * Gửi test email (admin).
     */
    public void sendTestEmail(String toEmail) throws MessagingException {
        String htmlContent = buildEmailFromTemplate("email/test", Map.of(
                "message", "Email configuration is working correctly!"));

        sendHtmlEmail(toEmail, "🧪 Test Email - OCP Study", htmlContent);
    }

    /**
     * Build HTML content từ Thymeleaf template.
     */
    private String buildEmailFromTemplate(String templateName, Map<String, Object> variables) {
        Context context = new Context();
        context.setVariables(variables);
        return templateEngine.process(templateName, context);
    }

    /**
     * Gửi HTML email.
     */
    private void sendHtmlEmail(String to, String subject, String htmlContent) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true); // true = isHtml

        mailSender.send(message);
    }
}
