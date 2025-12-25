package com.ocp.study.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

/**
 * Entity đại diện cho một Subtopic (chủ đề con) trong một Topic.
 * VD: "Primitives và Wrapper Classes" là subtopic của "Working with Java Data
 * Types"
 * 
 * @author OCP Study Team
 * @since 1.0.0
 */
@Entity
@Table(name = "subtopics")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Subtopic {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    /**
     * Topic cha của subtopic này
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "topic_id", nullable = false)
    private Topic topic;

    /**
     * Tên subtopic. VD: "Primitives và Wrapper Classes"
     */
    @Column(nullable = false)
    private String name;

    /**
     * Mô tả chi tiết
     */
    @Column(columnDefinition = "TEXT")
    private String description;

    /**
     * Độ khó (1-5 sao)
     */
    @Column(nullable = false)
    private Integer difficulty;

    /**
     * Số ngày ước tính để học
     */
    @Column(name = "estimated_days", nullable = false)
    private Integer estimatedDays;

    /**
     * Mức độ ưu tiên: LOW, MEDIUM, HIGH, CRITICAL
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority;

    /**
     * Thứ tự hiển thị trong topic
     */
    @Column(name = "order_index", nullable = false)
    private Integer orderIndex;

    /**
     * Enum định nghĩa mức độ ưu tiên
     */
    public enum Priority {
        LOW, // Thấp - Có thể skip nếu thiếu thời gian
        MEDIUM, // Trung bình - Nên học
        HIGH, // Cao - Cần học kỹ
        CRITICAL // Rất cao - Bắt buộc phải master
    }
}
