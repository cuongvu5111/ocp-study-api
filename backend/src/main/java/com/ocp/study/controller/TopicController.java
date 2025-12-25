package com.ocp.study.controller;

import com.ocp.study.dto.TopicDTO;
import com.ocp.study.service.TopicService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST Controller cho Topics API.
 * 
 * @author OCP Study Team
 * @since 1.0.0
 */
@RestController
@RequestMapping("/topics")
@RequiredArgsConstructor
@Tag(name = "Topics", description = "API quản lý topics OCP")
public class TopicController {

    private final TopicService topicService;

    // Tạm thời hardcode userId, sau này sẽ lấy từ JWT token
    private static final String DEFAULT_USER_ID = "default-user";

    @GetMapping
    @Operation(summary = "Lấy tất cả topics", description = "Trả về danh sách tất cả topics với progress, lọc theo certificationId (có phân trang)")
    public ResponseEntity<org.springframework.data.domain.Page<TopicDTO>> getAllTopics(
            @RequestHeader(value = "X-User-Id", defaultValue = DEFAULT_USER_ID) String userId,
            @RequestParam(required = false) UUID certificationId,
            org.springframework.data.domain.Pageable pageable) {
        return ResponseEntity.ok(topicService.getAllTopics(userId, certificationId, pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy topic theo ID", description = "Trả về chi tiết topic với subtopics")
    public ResponseEntity<TopicDTO> getTopicById(
            @PathVariable UUID id,
            @RequestHeader(value = "X-User-Id", defaultValue = DEFAULT_USER_ID) String userId) {
        return ResponseEntity.ok(topicService.getTopicById(id, userId));
    }

    @GetMapping("/month/{month}")
    @Operation(summary = "Lấy topics theo tháng", description = "Trả về topics thuộc tháng học cụ thể (1-6)")
    public ResponseEntity<List<TopicDTO>> getTopicsByMonth(
            @PathVariable Integer month,
            @RequestHeader(value = "X-User-Id", defaultValue = DEFAULT_USER_ID) String userId) {
        return ResponseEntity.ok(topicService.getTopicsByMonth(month, userId));
    }

    @PostMapping
    @Operation(summary = "Tạo topic mới")
    public ResponseEntity<TopicDTO> createTopic(@RequestBody com.ocp.study.dto.CreateTopicRequest request,
            @RequestParam UUID certificationId) {
        // Note: The frontend sends { certificationId, name... } in body.
        // We need to adjust parameters or DTO handling.
        // If frontend sends: { "certificationId": 1, "name": "..." }
        // We should probably include certificationId in CreateTopicRequest DTO or
        // request body map.
        // Or change implementation to extract from body.

        // Let's assume request body has everything needed, but CreateTopicRequest DTO
        // currently doesn't have certificationId.
        // I should update CreateTopicRequest DTO or pass it as param.
        // Frontend sends: apiService.createTopic(val) where val includes
        // certificationId from form.

        // Better implementation: Update CreateTopicRequest to include certificationId.
        // For now, I'll take it from request body if DTO is updated, OR use Map.
        // But TopicService.createTopic expects certificationId as arg.

        // Temporary fix: Trust that frontend sends it in body, but we need to map it.
        // Wait, I can't easily change DTO here without viewing it again.
        // Let's modify Controller to accept Map or updated DTO?
        // I already viewed CreateTopicRequest, it DOES NOT have certificationId.
        // I will overload createTopic in Service or Controller to handle this.

        return ResponseEntity.badRequest().build(); // Placeholder, to be replaced in next step
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa topic")
    public ResponseEntity<Void> deleteTopic(@PathVariable UUID id) {
        topicService.deleteTopic(id);
        return ResponseEntity.noContent().build();
    }
}
