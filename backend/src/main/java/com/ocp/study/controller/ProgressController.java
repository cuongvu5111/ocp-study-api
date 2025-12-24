package com.ocp.study.controller;

import com.ocp.study.entity.TopicProgress;
import com.ocp.study.service.ProgressService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * REST Controller cho Progress API.
 * 
 * @author OCP Study Team
 * @since 1.0.0
 */
@RestController
@RequestMapping("/progress")
@RequiredArgsConstructor
@Tag(name = "Progress", description = "API theo dõi tiến độ học")
public class ProgressController {

    private final ProgressService progressService;
    private static final String DEFAULT_USER_ID = "default-user";

    @PostMapping("/subtopic/{subtopicId}/status")
    @Operation(summary = "Cập nhật trạng thái học subtopic")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long subtopicId,
            @RequestParam TopicProgress.Status status,
            @RequestHeader(value = "X-User-Id", defaultValue = DEFAULT_USER_ID) String userId) {
        progressService.updateProgress(userId, subtopicId, status);
        return ResponseEntity.ok(Map.of("success", true, "message", "Updated successfully"));
    }

    @PostMapping("/subtopic/{subtopicId}/percentage")
    @Operation(summary = "Cập nhật % hoàn thành subtopic")
    public ResponseEntity<TopicProgress> updatePercentage(
            @PathVariable Long subtopicId,
            @RequestParam Integer percentage,
            @RequestHeader(value = "X-User-Id", defaultValue = DEFAULT_USER_ID) String userId) {
        return ResponseEntity.ok(progressService.updateCompletionPercentage(userId, subtopicId, percentage));
    }

    @PostMapping("/subtopic/{subtopicId}/note")
    @Operation(summary = "Thêm ghi chú cho subtopic")
    public ResponseEntity<TopicProgress> addNote(
            @PathVariable Long subtopicId,
            @RequestBody String note,
            @RequestHeader(value = "X-User-Id", defaultValue = DEFAULT_USER_ID) String userId) {
        return ResponseEntity.ok(progressService.addNote(userId, subtopicId, note));
    }

    @GetMapping("/overall")
    @Operation(summary = "Lấy % hoàn thành tổng thể")
    public ResponseEntity<Double> getOverallProgress(
            @RequestHeader(value = "X-User-Id", defaultValue = DEFAULT_USER_ID) String userId) {
        return ResponseEntity.ok(progressService.getOverallProgress(userId));
    }

    @GetMapping("/completed-count")
    @Operation(summary = "Đếm số subtopics đã hoàn thành")
    public ResponseEntity<Long> getCompletedCount(
            @RequestHeader(value = "X-User-Id", defaultValue = DEFAULT_USER_ID) String userId) {
        return ResponseEntity.ok(progressService.getCompletedCount(userId));
    }
}
