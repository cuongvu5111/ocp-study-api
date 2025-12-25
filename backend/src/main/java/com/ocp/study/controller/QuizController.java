package com.ocp.study.controller;

import com.ocp.study.dto.QuestionDTO;
import com.ocp.study.dto.QuizSubmissionDTO;
import com.ocp.study.entity.QuizHistory;
import com.ocp.study.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * REST Controller cho Quiz API - Lấy câu hỏi và submit quiz.
 * 
 * @author OCP Study Team
 * @since 1.0.0
 */
@RestController
@RequestMapping("/api/quiz")
@CrossOrigin(origins = "*")
public class QuizController {

    @Autowired
    private QuizService quizService;

    /**
     * GET /api/quiz/questions - Lấy câu hỏi ngẫu nhiên cho quiz
     * 
     * @param topicId Optional - filter theo topic
     * @param limit   Số câu hỏi (default 10)
     */
    @GetMapping("/questions")
    public ResponseEntity<List<QuestionDTO>> getQuestions(
            @RequestParam(required = false) UUID topicId,
            @RequestParam(defaultValue = "10") int limit) {

        List<QuestionDTO> questions = quizService.getRandomQuestions(topicId, limit);
        return ResponseEntity.ok(questions);
    }

    /**
     * GET /api/quiz/questions/topic/{topicId} - Lấy tất cả câu hỏi theo topic
     */
    @GetMapping("/questions/topic/{topicId}")
    public ResponseEntity<List<QuestionDTO>> getQuestionsByTopic(@PathVariable UUID topicId) {
        List<QuestionDTO> questions = quizService.getQuestionsByTopic(topicId);
        return ResponseEntity.ok(questions);
    }

    /**
     * POST /api/quiz/submit - Submit kết quả quiz
     */
    @PostMapping("/submit")
    public ResponseEntity<Map<String, Object>> submitQuiz(@RequestBody QuizSubmissionDTO submission) {
        // Lưu vào database
        QuizHistory saved = quizService.saveQuizResult(submission);

        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("message", "Quiz submitted successfully");
        result.put("historyId", saved.getId());

        return ResponseEntity.ok(result);
    }

    /**
     * GET /api/quiz/history - Lấy lịch sử quiz
     */
    @GetMapping("/history")
    public ResponseEntity<List<Map<String, Object>>> getHistory() {
        List<QuizHistory> history = quizService.getQuizHistory();

        // Transform to frontend format
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        List<Map<String, Object>> response = history.stream()
                .map(h -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("type", formatQuizType(h.getQuizType(), h.getTopicName()));
                    item.put("date", h.getCompletedAt().format(formatter));
                    item.put("score", h.getScorePercentage());
                    return item;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    private String formatQuizType(String type, String topicName) {
        return switch (type) {
            case "MOCK_EXAM" -> "Mock Exam";
            case "QUICK_QUIZ" -> "Quick Quiz";
            case "TOPIC_QUIZ" -> "Topic: " + (topicName != null ? topicName : "Unknown");
            default -> type;
        };
    }
}
