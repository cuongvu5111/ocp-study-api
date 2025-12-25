package com.ocp.study.repository;

import com.ocp.study.entity.Topic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Repository cho Topic entity.
 * 
 * @author OCP Study Team
 * @since 1.0.0
 */
@Repository
public interface TopicRepository extends JpaRepository<Topic, UUID> {

    /**
     * Lấy tất cả topics sắp xếp theo thứ tự
     */
    List<Topic> findAllByOrderByOrderIndexAsc();

    /**
     * Lấy topics theo tháng học
     */
    List<Topic> findByMonthOrderByOrderIndexAsc(Integer month);

    /**
     * Lấy topic với subtopics (eager fetch)
     */
    @Query("SELECT DISTINCT t FROM Topic t LEFT JOIN FETCH t.subtopics WHERE t.id = :id")
    Topic findByIdWithSubtopics(UUID id);

    /**
     * Lấy tất cả topics với subtopics
     */
    @Query("SELECT DISTINCT t FROM Topic t LEFT JOIN FETCH t.subtopics ORDER BY t.orderIndex")
    List<Topic> findAllWithSubtopics();

    /**
     * Lấy tất cả topics theo certificationId với subtopics
     */
    @Query("SELECT DISTINCT t FROM Topic t LEFT JOIN FETCH t.subtopics WHERE t.certification.id = :certificationId ORDER BY t.orderIndex")
    List<Topic> findAllWithSubtopicsByCertificationId(UUID certificationId);

    long countByCertificationId(UUID certificationId);

    org.springframework.data.domain.Page<Topic> findAllByCertificationId(UUID certificationId,
            org.springframework.data.domain.Pageable pageable);
}
