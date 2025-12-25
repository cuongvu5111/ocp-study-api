package com.ocp.study.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Entity đại diện cho một Topic trong OCP exam.
 * VD: "Working with Java Data Types", "Exception Handling", etc.
 * 
 * @author OCP Study Team
 * @since 1.0.0
 */
@Entity
@Table(name = "topics")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Topic {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    /**
     * Tên topic. VD: "Working with Java Data Types"
     */
    @Column(nullable = false)
    private String name;

    /**
     * Mô tả chi tiết về topic
     */
    @Column(columnDefinition = "TEXT")
    private String description;

    /**
     * Icon emoji để hiển thị. VD: "📘", "📗"
     */
    @Column(length = 10)
    private String icon;

    /**
     * Tháng học topic này (1-6)
     */
    @Column(nullable = false)
    private Integer month;

    /**
     * Thứ tự hiển thị trong danh sách
     */
    @Column(name = "order_index", nullable = false)
    private Integer orderIndex;

    /**
     * Số ngày ước tính để hoàn thành topic
     */
    @Column(name = "estimated_days")
    private Integer estimatedDays;

    /**
     * Danh sách subtopics thuộc topic này
     */
    @OneToMany(mappedBy = "topic", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Subtopic> subtopics = new ArrayList<>();

    /**
     * Danh sách flashcards thuộc topic này
     */
    @OneToMany(mappedBy = "topic", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Flashcard> flashcards = new ArrayList<>();

    /**
     * Danh sách câu hỏi quiz thuộc topic này
     */
    @OneToMany(mappedBy = "topic", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Question> questions = new ArrayList<>();

    // Helper methods
    public void addSubtopic(Subtopic subtopic) {
        subtopics.add(subtopic);
        subtopic.setTopic(this);
    }

    public void removeSubtopic(Subtopic subtopic) {
        subtopics.remove(subtopic);
        subtopic.setTopic(null);
    }

    /**
     * Chứng chỉ mà topic này thuộc về
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "certification_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore // Prevent infinite recursion if serialized directly
    private Certification certification;
}
