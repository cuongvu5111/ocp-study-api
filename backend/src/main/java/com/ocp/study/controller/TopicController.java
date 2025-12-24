package com.ocp.study.controller;

import com.ocp.study.dto.TopicDTO;
import com.ocp.study.service.TopicService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    @Operation(summary = "Lấy tất cả topics", description = "Trả về danh sách tất cả topics với progress")
    public ResponseEntity<List<TopicDTO>> getAllTopics(
            @RequestHeader(value = "X-User-Id", defaultValue = DEFAULT_USER_ID) String userId) {
        return ResponseEntity.ok(topicService.getAllTopics(userId));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy topic theo ID", description = "Trả về chi tiết topic với subtopics")
    public ResponseEntity<TopicDTO> getTopicById(
            @PathVariable Long id,
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
}
