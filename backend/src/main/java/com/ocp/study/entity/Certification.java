package com.ocp.study.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Entity đại diện cho một chứng chỉ.
 * VD: "OCP Java SE 11", "AWS Certified Solutions Architect", etc.
 */
@Entity
@Table(name = "certifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Certification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Tên chứng chỉ. VD: "OCP Java SE 11 Developer"
     */
    @Column(nullable = false)
    private String name;

    /**
     * Mã chứng chỉ. VD: "1Z0-819"
     */
    @Column(nullable = false, unique = true)
    private String code;

    /**
     * Mô tả về chứng chỉ
     */
    @Column(columnDefinition = "TEXT")
    private String description;

    /**
     * Icon/Logo của chứng chỉ
     */
    @Column(length = 50)
    private String icon;

    /**
     * Danh sách Topics thuộc chứng chỉ này
     */
    @OneToMany(mappedBy = "certification", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Topic> topics = new ArrayList<>();
}
