package com.ocp.study.repository;

import com.ocp.study.entity.Topic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository cho Topic entity.
 * 
 * @author OCP Study Team
 * @since 1.0.0
 */
@Repository
public interface TopicRepository extends JpaRepository<Topic, Long> {

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
    Topic findByIdWithSubtopics(Long id);

    /**
     * Lấy tất cả topics với subtopics
     */
    @Query("SELECT DISTINCT t FROM Topic t LEFT JOIN FETCH t.subtopics ORDER BY t.orderIndex")
    List<Topic> findAllWithSubtopics();
}
