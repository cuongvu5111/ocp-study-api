package com.ocp.study.dto;

import com.ocp.study.entity.Subtopic;
import com.ocp.study.entity.TopicProgress;
import lombok.*;

/**
 * DTO cho Subtopic.
 * 
 * @author OCP Study Team
 * @since 1.0.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubtopicDTO {
    private Long id;
    private Long topicId;
    private String name;
    private String description;
    private Integer difficulty;
    private Integer estimatedDays;
    private Subtopic.Priority priority;
    private Integer orderIndex;

    // Progress info
    private TopicProgress.Status status;
    private Integer completionPercentage;
}
