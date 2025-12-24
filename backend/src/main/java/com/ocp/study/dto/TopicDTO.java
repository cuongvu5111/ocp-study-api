package com.ocp.study.dto;

import lombok.*;

import java.util.List;

/**
 * DTO cho Topic để trả về cho client.
 * 
 * @author OCP Study Team
 * @since 1.0.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TopicDTO {
    private Long id;
    private String name;
    private String description;
    private String icon;
    private Integer month;
    private Integer orderIndex;
    private Integer estimatedDays;
    private List<SubtopicDTO> subtopics;

    // Progress info
    private Integer completedSubtopics;
    private Integer totalSubtopics;
    private Double progressPercentage;
}
