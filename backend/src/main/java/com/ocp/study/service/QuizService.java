package com.ocp.study.service;

import com.ocp.study.dto.QuestionDTO;
import com.ocp.study.dto.QuizSubmissionDTO;
import com.ocp.study.entity.Question;
import com.ocp.study.entity.QuestionOption;
import com.ocp.study.entity.QuizHistory;
import com.ocp.study.repository.QuestionRepository;
import com.ocp.study.repository.QuizHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service xử lý logic Quiz - Lấy câu hỏi và chấm điểm.
 * 
 * @author OCP Study Team
 * @since 1.0.0
 */
@Service
@RequiredArgsConstructor
public class QuizService {

    private final QuestionRepository questionRepository;
    private final QuizHistoryRepository quizHistoryRepository;
    private final UserService userService;

    /**
     * Lấy câu hỏi ngẫu nhiên cho quiz
     */
    public List<QuestionDTO> getRandomQuestions(Long topicId, int limit) {
        List<Question> questions;

        if (topicId != null) {
            questions = questionRepository.findRandomQuestionsByTopic(topicId, limit);
        } else {
            questions = questionRepository.findRandomQuestions(limit);
        }

        return questions.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Lấy tất cả câu hỏi theo topic
     */
    public List<QuestionDTO> getQuestionsByTopic(Long topicId) {
        List<Question> questions = questionRepository.findByTopicIdWithOptions(topicId);
        return questions.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Convert Question entity to DTO
     */
    private QuestionDTO convertToDTO(Question question) {
        List<QuestionDTO.OptionDTO> optionDTOs = new ArrayList<>();

        if (question.getOptions() != null) {
            int idx = 0;
            for (QuestionOption option : question.getOptions()) {
                optionDTOs.add(QuestionDTO.OptionDTO.builder()
                        .id(option.getId())
                        .optionKey(String.valueOf((char) ('A' + idx)))
                        .content(option.getContent())
                        .isCorrect(option.getIsCorrect())
                        .build());
                idx++;
            }
        }

        return QuestionDTO.builder()
                .id(question.getId())
                .topicId(question.getTopic() != null ? question.getTopic().getId() : null)
                .topicName(question.getTopic() != null ? question.getTopic().getName() : "")
                .content(question.getContent())
                .codeSnippet(question.getCodeSnippet())
                .questionType(question.getQuestionType())
                .options(optionDTOs)
                .explanation(question.getExplanation())
                .difficulty(question.getDifficulty())
                .build();
    }

    /**
     * Lưu kết quả quiz vào lịch sử
     */
    public QuizHistory saveQuizResult(QuizSubmissionDTO submission) {
        QuizHistory history = QuizHistory.builder()
                .user(userService.getCurrentUser())
                .quizType(submission.getQuizType())
                .topicId(submission.getTopicId())
                .topicName(submission.getTopicName())
                .totalQuestions(submission.getTotalQuestions())
                .correctAnswers(submission.getCorrectAnswers())
                .scorePercentage(submission.getScorePercentage())
                .timeSpent(submission.getTimeSpent())
                .build();

        return quizHistoryRepository.save(history);
    }

    /**
     * Lấy 10 lịch sử gần nhất của user
     */
    public List<QuizHistory> getQuizHistory() {
        return quizHistoryRepository.findTop10ByUserOrderByCompletedAtDesc(userService.getCurrentUser());
    }
}
