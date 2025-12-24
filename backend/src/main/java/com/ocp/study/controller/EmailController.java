package com.ocp.study.controller;

import com.ocp.study.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Email Admin Controller - Endpoints để quản lý email.
 * 
 * @author OCP Study Team
 * @since 1.0.0
 */
@RestController
@RequestMapping("/admin/emails")
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = "*")
public class EmailController {

    @Autowired
    private EmailService emailService;

    /**
     * POST /admin/emails/send-test - Gửi test email.
     */
    @PostMapping("/send-test")
    public ResponseEntity<Map<String, Object>> sendTestEmail(@RequestParam String toEmail) {
        try {
            emailService.sendTestEmail(toEmail);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Test email sent to " + toEmail));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "message", "Failed to send email: " + e.getMessage()));
        }
    }
}
