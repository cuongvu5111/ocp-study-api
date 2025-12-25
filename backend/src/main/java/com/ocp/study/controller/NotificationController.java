package com.ocp.study.controller;

import com.ocp.study.dto.NotificationDTO;
import com.ocp.study.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

/**
 * Controller xử lý Notification APIs.
 * 
 * @author OCP Study Team
 * @since 1.0.0
 */
@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Tag(name = "Notifications", description = "Notification APIs")
public class NotificationController {

    private static final String DEFAULT_USER_ID = "default-user";

    private final NotificationService notificationService;

    /**
     * Lấy danh sách notifications với pagination
     */
    @GetMapping
    @Operation(summary = "Get notifications", description = "Lấy danh sách notifications của user")
    public ResponseEntity<Page<NotificationDTO>> getNotifications(
            @RequestHeader(value = "X-User-Id", defaultValue = DEFAULT_USER_ID) String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        // Convert userId string to UUID (assuming we store UUID in User table)
        // For now, we'll use a workaround - find user by username
        UUID userUuid = getUserUuid(userId);

        Pageable pageable = PageRequest.of(page, size);
        Page<NotificationDTO> notifications = notificationService.getNotifications(userUuid, pageable);

        return ResponseEntity.ok(notifications);
    }

    /**
     * Lấy số lượng notification chưa đọc
     */
    @GetMapping("/unread-count")
    @Operation(summary = "Get unread count", description = "Lấy số lượng notification chưa đọc")
    public ResponseEntity<Map<String, Integer>> getUnreadCount(
            @RequestHeader(value = "X-User-Id", defaultValue = DEFAULT_USER_ID) String userId) {

        UUID userUuid = getUserUuid(userId);
        int count = notificationService.getUnreadCount(userUuid);

        return ResponseEntity.ok(Map.of("count", count));
    }

    /**
     * Mark notification là đã đọc
     */
    @PatchMapping("/{id}/read")
    @Operation(summary = "Mark as read", description = "Đánh dấu notification đã đọc")
    public ResponseEntity<Void> markAsRead(@PathVariable UUID id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok().build();
    }

    /**
     * Mark tất cả notifications là đã đọc
     */
    @PatchMapping("/read-all")
    @Operation(summary = "Mark all as read", description = "Đánh dấu tất cả notifications đã đọc")
    public ResponseEntity<Void> markAllAsRead(
            @RequestHeader(value = "X-User-Id", defaultValue = DEFAULT_USER_ID) String userId) {

        UUID userUuid = getUserUuid(userId);
        notificationService.markAllAsRead(userUuid);

        return ResponseEntity.ok().build();
    }

    /**
     * Xóa notification
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete notification", description = "Xóa notification")
    public ResponseEntity<Void> deleteNotification(@PathVariable UUID id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Helper method để convert userId string sang UUID
     * TODO: Implement proper user lookup
     */
    private UUID getUserUuid(String userId) {
        // Temporary: return a default UUID for demo purposes
        // In production, should lookup user by username and get UUID
        try {
            return UUID.fromString(userId);
        } catch (IllegalArgumentException e) {
            // If userId is not a valid UUID, use a default one for demo
            return UUID.fromString("00000000-0000-0000-0000-000000000000");
        }
    }
}
