package com.ocp.study.dto;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
public class CreateTopicRequest {
    private UUID id; // Optional, for updates
    private String name;
    private String description;
    private String icon;
    private Integer month; // Which month this topic belongs to (1, 2, 3...)
    private UUID certificationId; // For creating topic standalone
    private List<CreateSubtopicRequest> subtopics = new ArrayList<>();

    @Data
    public static class CreateSubtopicRequest {
        private String name;
        private String description;
        private Integer difficulty; // 1-5
        private Integer estimatedDays;
        private String priority; // LOW, MEDIUM, HIGH, CRITICAL
        private Integer orderIndex;
    }
}
