package com.ocp.study.service;

import com.ocp.study.entity.Subtopic;
import com.ocp.study.entity.TopicProgress;
import com.ocp.study.repository.SubtopicRepository;
import com.ocp.study.repository.TopicProgressRepository;
import com.ocp.study.repository.TopicRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Service xử lý logic cho Topic Progress tracking.
 * 
 * @author OCP Study Team
 * @since 1.0.0
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class ProgressService {

    private final TopicProgressRepository progressRepository;
    private final SubtopicRepository subtopicRepository;
    private final TopicRepository topicRepository;
    private final StreakService streakService;

    /**
     * Cập nhật trạng thái học của subtopic
     */
    @Transactional
    public TopicProgress updateProgress(String userId, UUID subtopicId, TopicProgress.Status status) {
        Subtopic subtopic = subtopicRepository.findById(subtopicId)
                .orElseThrow(() -> new RuntimeException("Subtopic không tồn tại: " + subtopicId));

        TopicProgress progress = progressRepository.findByUserIdAndSubtopicId(userId, subtopicId)
                .orElseGet(() -> TopicProgress.builder()
                        .userId(userId)
                        .topic(subtopic.getTopic())
                        .subtopic(subtopic)
                        .build());

        progress.setStatus(status);

        if (status == TopicProgress.Status.IN_PROGRESS && progress.getStartedAt() == null) {
            progress.setStartedAt(LocalDateTime.now());
        } else if (status == TopicProgress.Status.COMPLETED) {
            progress.setCompletedAt(LocalDateTime.now());
            progress.setCompletionPercentage(100);
        }

        TopicProgress saved = progressRepository.save(progress);
        log.info("✅ Saved progress: userId={}, subtopicId={}, topicId={}, status={}",
                userId, subtopicId, saved.getTopic().getId(), saved.getStatus());

        // Record study activity để tính streak (estimate 5 phút cho mỗi lần update)
        try {
            streakService.recordStudyActivity(userId, 5, 0, 0);
            log.info("Recorded study activity for user {} (update progress)", userId);
        } catch (Exception e) {
            log.warn("Failed to record study activity: {}", e.getMessage());
        }

        return saved;
    }

    /**
     * Cập nhật % hoàn thành
     */
    @Transactional
    public TopicProgress updateCompletionPercentage(String userId, UUID subtopicId, Integer percentage) {
        TopicProgress progress = progressRepository.findByUserIdAndSubtopicId(userId, subtopicId)
                .orElseThrow(() -> new RuntimeException("Progress không tồn tại"));

        progress.setCompletionPercentage(percentage);

        if (percentage >= 100) {
            progress.setStatus(TopicProgress.Status.COMPLETED);
            progress.setCompletedAt(LocalDateTime.now());
        } else if (percentage > 0) {
            progress.setStatus(TopicProgress.Status.IN_PROGRESS);
            if (progress.getStartedAt() == null) {
                progress.setStartedAt(LocalDateTime.now());
            }
        }

        TopicProgress saved = progressRepository.save(progress);

        // Record study activity
        try {
            streakService.recordStudyActivity(userId, 5, 0, 0);
        } catch (Exception e) {
            log.warn("Failed to record study activity: {}", e.getMessage());
        }

        return saved;
    }

    /**
     * Thêm ghi chú cho subtopic
     */
    @Transactional
    public TopicProgress addNote(String userId, UUID subtopicId, String note) {
        Subtopic subtopic = subtopicRepository.findById(subtopicId)
                .orElseThrow(() -> new RuntimeException("Subtopic không tồn tại: " + subtopicId));

        TopicProgress progress = progressRepository.findByUserIdAndSubtopicId(userId, subtopicId)
                .orElseGet(() -> TopicProgress.builder()
                        .userId(userId)
                        .topic(subtopic.getTopic())
                        .subtopic(subtopic)
                        .build());

        progress.setNotes(note);
        return progressRepository.save(progress);
    }

    /**
     * Lấy % hoàn thành tổng thể
     */
    public Double getOverallProgress(String userId) {
        return progressRepository.getAverageCompletionByUserId(userId);
    }

    /**
     * Đếm số subtopics đã hoàn thành
     */
    public long getCompletedCount(String userId) {
        return progressRepository.countCompletedByUserId(userId);
    }
}
