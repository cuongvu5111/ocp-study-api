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
import java.util.UUID;
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
        /**
         * Lấy dữ liệu dashboard cho user, có thể lọc theo certificationId
         */
        public DashboardDTO getDashboard(String userId, UUID certificationId) {
                long totalTopics;
                long totalSubtopics;
                long completedSubtopics;
                Double overallProgress;
                long totalFlashcards;
                long totalQuestions;

                if (certificationId != null) {
                        totalTopics = topicRepository.countByCertificationId(certificationId);
                        totalSubtopics = subtopicRepository.countByTopic_Certification_Id(certificationId);
                        completedSubtopics = progressRepository.countCompletedByUserIdAndCertificationId(userId,
                                        certificationId);
                        overallProgress = progressRepository.getAverageCompletionByUserIdAndCertificationId(userId,
                                        certificationId);
                        totalFlashcards = flashcardRepository.countByTopic_Certification_Id(certificationId);
                        totalQuestions = questionRepository.countByTopic_Certification_Id(certificationId);
                } else {
                        totalTopics = topicRepository.count();
                        totalSubtopics = subtopicRepository.count();
                        completedSubtopics = progressRepository.countCompletedByUserId(userId);
                        overallProgress = progressRepository.getAverageCompletionByUserId(userId);
                        totalFlashcards = flashcardRepository.count();
                        totalQuestions = questionRepository.count();
                }

                // Streak và Calendar giữ nguyên (tính global)
                Long totalMinutesStudied = sessionRepository.getTotalMinutesStudied(userId);
                long studyDays = sessionRepository.countByUserId(userId);
                Long currentStreak = sessionRepository.getCurrentStreak(userId);

                long flashcardsDue = flashcardRepository.findCardsToReview(LocalDateTime.now()).size(); // TODO: filter
                                                                                                        // due by cert?

                // Calendar (30 ngày gần nhất)
                LocalDate endDate = LocalDate.now();
                LocalDate startDate = endDate.minusDays(30);
                List<StudySession> sessions = sessionRepository
                                .findByUserIdAndStudyDateBetweenOrderByStudyDateAsc(userId, startDate, endDate);

                List<DashboardDTO.StudyDayDTO> studyCalendar = sessions.stream()
                                .map(this::mapToStudyDayDTO)
                                .collect(Collectors.toList());

                // Today's subtopics (những subtopics đang IN_PROGRESS)
                // TODO: filter by certificationId if present
                List<TopicProgress> inProgressItems = progressRepository.findByUserId(userId).stream()
                                .filter(p -> p.getStatus() == TopicProgress.Status.IN_PROGRESS)
                                .filter(p -> certificationId == null
                                                || p.getTopic().getCertification().getId().equals(certificationId))
                                .limit(5)
                                .collect(Collectors.toList());

                List<SubtopicDTO> todaySubtopics = inProgressItems.stream()
                                .map(this::mapProgressToSubtopicDTO)
                                .collect(Collectors.toList());

                return DashboardDTO.builder()
                                .overallProgress(overallProgress != null ? overallProgress : 0.0)
                                .completedTopics(calculateCompletedTopics(userId)) // TODO: filter by cert
                                .totalTopics((int) totalTopics)
                                .completedSubtopics((int) completedSubtopics)
                                .totalSubtopics((int) totalSubtopics)
                                .totalMinutesStudied(totalMinutesStudied)
                                .studyDays((int) studyDays)
                                .currentStreak(currentStreak != null ? currentStreak : 0L)
                                .totalFlashcards(totalFlashcards)
                                .flashcardsDue(flashcardsDue)
                                .totalQuestions(totalQuestions)
                                .quizzesTaken(0)
                                .averageQuizScore(0.0)
                                .studyCalendar(studyCalendar)
                                .todaySubtopics(todaySubtopics)
                                .build();
        }

        // Overload for backward compatibility
        public DashboardDTO getDashboard(String userId) {
                return getDashboard(userId, null);
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
