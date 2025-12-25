package com.ocp.study.repository;

import com.ocp.study.entity.StudySession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository cho StudySession entity.
 * 
 * @author OCP Study Team
 * @since 1.0.0
 */
@Repository
public interface StudySessionRepository extends JpaRepository<StudySession, UUID> {

    /**
     * Lấy session theo user và ngày
     */
    Optional<StudySession> findByUserIdAndStudyDate(String userId, LocalDate date);

    /**
     * Lấy sessions trong khoảng thời gian
     */
    List<StudySession> findByUserIdAndStudyDateBetweenOrderByStudyDateAsc(
            String userId, LocalDate startDate, LocalDate endDate);

    /**
     * Lấy sessions của user sắp xếp theo ngày
     */
    List<StudySession> findByUserIdOrderByStudyDateDesc(String userId);

    /**
     * Tính tổng thời gian học của user
     */
    @Query("SELECT COALESCE(SUM(s.minutesStudied), 0) FROM StudySession s WHERE s.userId = :userId")
    Long getTotalMinutesStudied(String userId);

    /**
     * Tính streak hiện tại (số ngày liên tiếp có học)
     */
    @Query(value = """
            WITH consecutive_dates AS (
                SELECT study_date,
                       study_date - (ROW_NUMBER() OVER (ORDER BY study_date))::int AS grp
                FROM study_sessions
                WHERE user_id = :userId
            )
            SELECT COUNT(*) FROM consecutive_dates
            WHERE grp = (SELECT grp FROM consecutive_dates WHERE study_date = CURRENT_DATE)
            """, nativeQuery = true)
    Long getCurrentStreak(String userId);

    /**
     * Đếm số ngày đã học
     */
    long countByUserId(String userId);
}
