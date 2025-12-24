package com.ocp.study.dto;

import lombok.Data;

@Data
public class CreateTopicRequest {
    private String name;
    private String description;
    private String icon;
    private Integer month; // Which month this topic belongs to (1, 2, 3...)
}
