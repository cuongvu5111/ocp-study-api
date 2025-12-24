package com.ocp.study.service;

import com.ocp.study.dto.DashboardDTO;
import com.ocp.study.dto.SubtopicDTO;
import com.ocp.study.entity.StudySession;
import com.ocp.study.entity.Subtopic;
import com.ocp.study.entity.TopicProgress;
import com.ocp.study.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service xử lý logic cho Dashboard.
 * 
 * @author OCP Study Team
 * @since 1.0.0
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private final TopicRepository topicRepository;
    private final SubtopicRepository subtopicRepository;
    private final TopicProgressRepository progressRepository;
    private final FlashcardRepository flashcardRepository;
    private final QuestionRepository questionRepository;
    private final StudySessionRepository sessionRepository;

    /**
     * Lấy dữ liệu dashboard cho user
     */
    public DashboardDTO getDashboard(String userId) {
        // Đếm topics và subtopics
        long totalTopics = topicRepository.count();
        long totalSubtopics = subtopicRepository.count();
        long completedSubtopics = progressRepository.countCompletedByUserId(userId);

        // Tính progress
        Double overallProgress = progressRepository.getAverageCompletionByUserId(userId);

        // Thời gian học
        Long totalMinutesStudied = sessionRepository.getTotalMinutesStudied(userId);
        long studyDays = sessionRepository.countByUserId(userId);
        Long currentStreak = sessionRepository.getCurrentStreak(userId);

        // Flashcards
        long totalFlashcards = flashcardRepository.count();
        long flashcardsDue = flashcardRepository.findCardsToReview(LocalDateTime.now()).size();

        // Questions
        long totalQuestions = questionRepository.count();

        // Calendar (30 ngày gần nhất)
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(30);
        List<StudySession> sessions = sessionRepository
                .findByUserIdAndStudyDateBetweenOrderByStudyDateAsc(userId, startDate, endDate);

        List<DashboardDTO.StudyDayDTO> studyCalendar = sessions.stream()
                .map(this::mapToStudyDayDTO)
                .collect(Collectors.toList());

        // Today's subtopics (những subtopics đang IN_PROGRESS)
        List<TopicProgress> inProgressItems = progressRepository.findByUserId(userId).stream()
                .filter(p -> p.getStatus() == TopicProgress.Status.IN_PROGRESS)
                .limit(5)
                .collect(Collectors.toList());

        List<SubtopicDTO> todaySubtopics = inProgressItems.stream()
                .map(this::mapProgressToSubtopicDTO)
                .collect(Collectors.toList());

        return DashboardDTO.builder()
                .overallProgress(overallProgress != null ? overallProgress : 0.0)
                .completedTopics(calculateCompletedTopics(userId))
                .totalTopics((int) totalTopics)
                .completedSubtopics((int) completedSubtopics)
                .totalSubtopics((int) totalSubtopics)
                .totalMinutesStudied(totalMinutesStudied)
                .studyDays((int) studyDays)
                .currentStreak(currentStreak != null ? currentStreak : 0L)
                .totalFlashcards(totalFlashcards)
                .flashcardsDue(flashcardsDue)
                .totalQuestions(totalQuestions)
                .quizzesTaken(0) // TODO: implement quiz history
                .averageQuizScore(0.0) // TODO: implement
                .studyCalendar(studyCalendar)
                .todaySubtopics(todaySubtopics)
                .build();
    }

    /**
     * Ghi nhận study session cho hôm nay
     */
    @Transactional
    public StudySession recordStudySession(String userId, int minutes) {
        LocalDate today = LocalDate.now();

        StudySession session = sessionRepository.findByUserIdAndStudyDate(userId, today)
                .orElseGet(() -> StudySession.builder()
                        .userId(userId)
                        .studyDate(today)
                        .build());

        session.addStudyTime(minutes);
        return sessionRepository.save(session);
    }

    /**
     * Tính số topics đã hoàn thành (tất cả subtopics completed)
     */
    private Integer calculateCompletedTopics(String userId) {
        // Logic: một topic hoàn thành khi tất cả subtopics đều completed
        // Simplified: đếm số topics có ít nhất 1 subtopic completed
        return 0; // TODO: implement proper logic
    }

    private DashboardDTO.StudyDayDTO mapToStudyDayDTO(StudySession session) {
        return DashboardDTO.StudyDayDTO.builder()
                .date(session.getStudyDate())
                .minutesStudied(session.getMinutesStudied())
                .flashcardsReviewed(session.getFlashcardsReviewed())
                .questionsAnswered(session.getQuestionsAnswered())
                .hasActivity(session.getMinutesStudied() > 0)
                .build();
    }

    private SubtopicDTO mapProgressToSubtopicDTO(TopicProgress progress) {
        Subtopic subtopic = progress.getSubtopic();
        return SubtopicDTO.builder()
                .id(subtopic.getId())
                .topicId(subtopic.getTopic().getId())
                .name(subtopic.getName())
                .difficulty(subtopic.getDifficulty())
                .priority(subtopic.getPriority())
                .status(progress.getStatus())
                .completionPercentage(progress.getCompletionPercentage())
                .build();
    }
}
