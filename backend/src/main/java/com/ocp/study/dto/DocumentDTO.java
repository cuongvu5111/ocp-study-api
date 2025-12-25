package com.ocp.study.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentDTO {
    private UUID id;
    private String title;
    private String fileName;
    private Long fileSize;
    private UUID certificationId;
    private LocalDateTime uploadedAt;
    private String uploadedBy;
}
