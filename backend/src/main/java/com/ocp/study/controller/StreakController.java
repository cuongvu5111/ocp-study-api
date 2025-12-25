package com.ocp.study.controller;

import com.ocp.study.dto.DailyActivityDTO;
import com.ocp.study.dto.StreakDTO;
import com.ocp.study.service.StreakService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller xử lý Study Streak APIs.
 * 
 * @author OCP Study Team
 * @since 1.0.0
 */
@RestController
@RequestMapping("/streak")
@RequiredArgsConstructor
@Tag(name = "Streak", description = "Study Streak APIs")
public class StreakController {

    private static final String DEFAULT_USER_ID = "default-user";

    private final StreakService streakService;

    /**
     * Lấy thông tin streak của user
     */
    @GetMapping
    @Operation(summary = "Get user streak", description = "Lấy thông tin streak hiện tại của user")
    public ResponseEntity<StreakDTO> getStreak(
            @RequestHeader(value = "X-User-Id", defaultValue = DEFAULT_USER_ID) String userId) {

        StreakDTO streak = streakService.calculateStreak(userId);
        return ResponseEntity.ok(streak);
    }

    /**
     * Lấy lịch sử hoạt động học tập
     */
    @GetMapping("/history")
    @Operation(summary = "Get study history", description = "Lấy lịch sử hoạt động học tập N ngày gần nhất")
    public ResponseEntity<List<DailyActivityDTO>> getHistory(
            @RequestHeader(value = "X-User-Id", defaultValue = DEFAULT_USER_ID) String userId,
            @RequestParam(defaultValue = "30") int days) {

        List<DailyActivityDTO> history = streakService.getDailyActivities(userId, days);
        return ResponseEntity.ok(history);
    }

    /**
     * Ghi nhận hoạt động học tập (manual tracking)
     */
    @PostMapping("/record")
    @Operation(summary = "Record study activity", description = "Ghi nhận hoạt động học tập thủ công")
    public ResponseEntity<?> recordActivity(
            @RequestHeader(value = "X-User-Id", defaultValue = DEFAULT_USER_ID) String userId,
            @RequestParam(defaultValue = "0") int minutes,
            @RequestParam(defaultValue = "0") int flashcards,
            @RequestParam(defaultValue = "0") int questions) {

        streakService.recordStudyActivity(userId, minutes, flashcards, questions);
        return ResponseEntity.ok().build();
    }
}
