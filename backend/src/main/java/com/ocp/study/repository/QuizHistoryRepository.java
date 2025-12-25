package com.ocp.study.repository;

import com.ocp.study.entity.QuizHistory;
import com.ocp.study.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Repository cho QuizHistory entity.
 * 
 * @author OCP Study Team
 * @since 1.0.0
 */
@Repository
public interface QuizHistoryRepository extends JpaRepository<QuizHistory, UUID> {

    /**
     * Lấy lịch sử quiz của user, sắp xếp mới nhất trước
     */
    List<QuizHistory> findByUserOrderByCompletedAtDesc(User user);

    /**
     * Lấy N lịch sử gần nhất của user
     */
    List<QuizHistory> findTop10ByUserOrderByCompletedAtDesc(User user);
}
