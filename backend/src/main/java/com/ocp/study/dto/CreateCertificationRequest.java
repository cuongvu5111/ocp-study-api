package com.ocp.study.dto;

import lombok.Data;
import java.util.List;

@Data
public class CreateCertificationRequest {
    private String name;
    private String code;
    private String description;
    private String icon;
    private Integer durationMonths;
    private List<CreateTopicRequest> topics;
}
