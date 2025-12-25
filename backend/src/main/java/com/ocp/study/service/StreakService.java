package com.ocp.study.service;

import com.ocp.study.dto.DailyActivityDTO;
import com.ocp.study.dto.StreakDTO;
import com.ocp.study.entity.StudySession;
import com.ocp.study.repository.StudySessionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service xử lý logic Study Streak.
 * 
 * @author OCP Study Team
 * @since 1.0.0
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class StreakService {

    private final StudySessionRepository studySessionRepository;

    /**
     * Tính toán và trả về thông tin streak của user
     */
    @Transactional(readOnly = true)
    public StreakDTO calculateStreak(String userId) {
        LocalDate today = LocalDate.now();

        // Lấy ngày học cuối cùng
        Optional<LocalDate> lastStudyDate = studySessionRepository.findLastStudyDate(userId);

        // Tính streak hiện tại
        int currentStreak = calculateCurrentStreak(userId, today);

        // Tính longest streak
        int longestStreak = calculateLongestStreak(userId);

        // Kiểm tra đã học hôm nay chưa
        boolean studiedToday = lastStudyDate.isPresent() && lastStudyDate.get().equals(today);

        // Lấy số phút học hôm nay
        Integer minutesToday = studySessionRepository.getTotalMinutesForDate(userId, today);

        // Lấy hoạt động của tuần hiện tại (Thứ 2 -> Chủ nhật)
        List<DailyActivityDTO> last7Days = getCurrentWeekActivities(userId);

        // Tổng số ngày đã học
        long totalDaysStudied = studySessionRepository.countByUserId(userId);

        return StreakDTO.builder()
                .currentStreak(currentStreak)
                .longestStreak(longestStreak)
                .lastStudyDate(lastStudyDate.orElse(null))
                .last7Days(last7Days)
                .studiedToday(studiedToday)
                .minutesToday(minutesToday != null ? minutesToday : 0)
                .totalDaysStudied(totalDaysStudied)
                .build();
    }

    /**
     * Tính streak hiện tại bằng cách đếm ngày liên tục từ hôm nay về quá khứ
     */
    private int calculateCurrentStreak(String userId, LocalDate today) {
        // Lấy tất cả sessions, sắp xếp giảm dần theo ngày
        List<StudySession> sessions = studySessionRepository.findByUserIdOrderByStudyDateDesc(userId);

        if (sessions.isEmpty()) {
            return 0;
        }

        // Bắt đầu từ hôm nay hoặc hôm qua
        LocalDate startDate = sessions.get(0).getStudyDate();
        if (startDate.isBefore(today.minusDays(1))) {
            // Nếu ngày học cuối cùng cách hôm nay > 1 ngày → streak = 0
            return 0;
        }

        int streak = 0;
        LocalDate expectedDate = today;

        // Nếu chưa học hôm nay, bắt đầu từ hôm qua
        if (!startDate.equals(today)) {
            expectedDate = today.minusDays(1);
        }

        for (StudySession session : sessions) {
            if (session.getStudyDate().equals(expectedDate)) {
                streak++;
                expectedDate = expectedDate.minusDays(1);
            } else if (session.getStudyDate().isBefore(expectedDate)) {
                // Có gap → dừng
                break;
            }
        }

        return streak;
    }

    /**
     * Tính longest streak từ toàn bộ lịch sử
     */
    private int calculateLongestStreak(String userId) {
        List<StudySession> sessions = studySessionRepository.findByUserIdOrderByStudyDateDesc(userId);

        if (sessions.isEmpty()) {
            return 0;
        }

        int maxStreak = 1;
        int currentCount = 1;

        for (int i = 0; i < sessions.size() - 1; i++) {
            LocalDate current = sessions.get(i).getStudyDate();
            LocalDate next = sessions.get(i + 1).getStudyDate();

            // Nếu ngày liên tiếp (current = next + 1 day)
            if (current.minusDays(1).equals(next)) {
                currentCount++;
                maxStreak = Math.max(maxStreak, currentCount);
            } else {
                currentCount = 1;
            }
        }

        return maxStreak;
    }

    /**
     * Lấy thông tin hoạt động trong tuần hiện tại (Thứ 2 đến Chủ nhật)
     */
    public List<DailyActivityDTO> getCurrentWeekActivities(String userId) {
        LocalDate today = LocalDate.now();
        // Tìm ngày Thứ 2 của tuần hiện tại
        LocalDate monday = today.with(java.time.DayOfWeek.MONDAY);
        LocalDate sunday = monday.plusDays(6);

        // Lấy sessions trong khoảng thời gian từ Thứ 2 đến Chủ Nhật của tuần này
        List<StudySession> sessions = studySessionRepository.findByUserIdAndStudyDateBetweenOrderByStudyDateAsc(
                userId, monday, sunday);

        // Map sessions theo ngày
        Map<LocalDate, StudySession> sessionMap = sessions.stream()
                .collect(Collectors.toMap(StudySession::getStudyDate, s -> s));

        // Tạo list cho 7 ngày của tuần (Thứ 2 -> Chủ Nhật)
        List<DailyActivityDTO> activities = new ArrayList<>();
        for (int i = 0; i < 7; i++) {
            LocalDate date = monday.plusDays(i);
            StudySession session = sessionMap.get(date);

            if (session != null) {
                activities.add(DailyActivityDTO.builder()
                        .date(date)
                        .minutesStudied(session.getMinutesStudied())
                        .flashcardsReviewed(session.getFlashcardsReviewed())
                        .questionsAnswered(session.getQuestionsAnswered())
                        .hasActivity(true)
                        .dayOfWeek(date.getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.ENGLISH))
                        .build());
            } else {
                activities.add(DailyActivityDTO.builder()
                        .date(date)
                        .minutesStudied(0)
                        .flashcardsReviewed(0)
                        .questionsAnswered(0)
                        .hasActivity(false)
                        .dayOfWeek(date.getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.ENGLISH))
                        .build());
            }
        }

        return activities;
    }

    /**
     * Lấy thông tin hoạt động trong N ngày gần nhất
     */
    public List<DailyActivityDTO> getDailyActivities(String userId, int days) {
        LocalDate today = LocalDate.now();
        LocalDate startDate = today.minusDays(days - 1);

        // Lấy sessions trong khoảng thời gian
        List<StudySession> sessions = studySessionRepository.findByUserIdAndStudyDateBetweenOrderByStudyDateAsc(
                userId, startDate, today);

        // Map sessions theo ngày
        Map<LocalDate, StudySession> sessionMap = sessions.stream()
                .collect(Collectors.toMap(StudySession::getStudyDate, s -> s));

        // Tạo list DailyActivity cho tất cả các ngày (kể cả ngày không học)
        List<DailyActivityDTO> activities = new ArrayList<>();
        for (int i = days - 1; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            StudySession session = sessionMap.get(date);

            if (session != null) {
                activities.add(DailyActivityDTO.builder()
                        .date(date)
                        .minutesStudied(session.getMinutesStudied())
                        .flashcardsReviewed(session.getFlashcardsReviewed())
                        .questionsAnswered(session.getQuestionsAnswered())
                        .hasActivity(true)
                        .dayOfWeek(date.getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.ENGLISH))
                        .build());
            } else {
                activities.add(DailyActivityDTO.builder()
                        .date(date)
                        .minutesStudied(0)
                        .flashcardsReviewed(0)
                        .questionsAnswered(0)
                        .hasActivity(false)
                        .dayOfWeek(date.getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.ENGLISH))
                        .build());
            }
        }

        return activities;
    }

    /**
     * Ghi nhận hoạt động học tập cho user hôm nay
     */
    @Transactional
    public void recordStudyActivity(String userId, int minutes, int flashcards, int questions) {
        LocalDate today = LocalDate.now();

        // Tìm hoặc tạo study session cho hôm nay
        StudySession session = studySessionRepository.findByUserIdAndStudyDate(userId, today)
                .orElse(StudySession.builder()
                        .userId(userId)
                        .studyDate(today)
                        .minutesStudied(0)
                        .flashcardsReviewed(0)
                        .questionsAnswered(0)
                        .build());

        // Cập nhật thông tin
        session.setMinutesStudied(session.getMinutesStudied() + minutes);
        session.setFlashcardsReviewed(session.getFlashcardsReviewed() + flashcards);
        session.setQuestionsAnswered(session.getQuestionsAnswered() + questions);

        studySessionRepository.save(session);

        log.info("Recorded study activity for user {}: {} mins, {} flashcards, {} questions",
                userId, minutes, flashcards, questions);
    }
}
