package com.ocp.study.controller;

import com.ocp.study.dto.DashboardDTO;
import com.ocp.study.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * REST Controller cho Dashboard API.
 * 
 * @author OCP Study Team
 * @since 1.0.0
 */
@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "API dữ liệu dashboard")
public class DashboardController {

    private final DashboardService dashboardService;
    private static final String DEFAULT_USER_ID = "default-user";

    @GetMapping
    @Operation(summary = "Lấy dữ liệu dashboard", description = "Trả về tổng quan tiến độ, streak, flashcards due, etc.")
    public ResponseEntity<DashboardDTO> getDashboard(
            @RequestHeader(value = "X-User-Id", defaultValue = DEFAULT_USER_ID) String userId,
            @RequestParam(required = false) UUID certificationId) {
        return ResponseEntity.ok(dashboardService.getDashboard(userId, certificationId));
    }

    @PostMapping("/study-session")
    @Operation(summary = "Ghi nhận thời gian học", description = "Ghi nhận số phút đã học hôm nay")
    public ResponseEntity<Void> recordStudySession(
            @RequestParam int minutes,
            @RequestHeader(value = "X-User-Id", defaultValue = DEFAULT_USER_ID) String userId) {
        dashboardService.recordStudySession(userId, minutes);
        return ResponseEntity.ok().build();
    }
}
