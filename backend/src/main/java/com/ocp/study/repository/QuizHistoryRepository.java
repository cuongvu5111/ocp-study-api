package com.ocp.study.repository;

import com.ocp.study.entity.QuizHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository cho QuizHistory entity.
 * 
 * @author OCP Study Team
 * @since 1.0.0
 */
@Repository
public interface QuizHistoryRepository extends JpaRepository<QuizHistory, Long> {

    /**
     * Lấy lịch sử quiz, sắp xếp mới nhất trước
     */
    List<QuizHistory> findAllByOrderByCompletedAtDesc();

    /**
     * Lấy N lịch sử gần nhất
     */
    List<QuizHistory> findTop10ByOrderByCompletedAtDesc();
}
