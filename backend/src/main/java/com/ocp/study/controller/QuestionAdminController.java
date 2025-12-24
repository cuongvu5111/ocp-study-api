package com.ocp.study.controller;

import com.ocp.study.dto.CreateQuestionRequest;
import com.ocp.study.entity.Question;
import com.ocp.study.entity.QuestionOption;
import com.ocp.study.entity.Topic;
import com.ocp.study.repository.QuestionRepository;
import com.ocp.study.repository.TopicRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.*;

/**
 * Admin Controller - Quản lý câu hỏi quiz (chỉ ADMIN).
 * 
 * @author OCP Study Team
 * @since 1.0.0
 */
@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = "*")
public class QuestionAdminController {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private TopicRepository topicRepository;

    /**
     * GET /admin/questions - Lấy danh sách tất cả câu hỏi
     */
    @GetMapping("/questions")
    public ResponseEntity<List<Map<String, Object>>> getAllQuestions() {
        List<Question> questions = questionRepository.findAll();

        List<Map<String, Object>> result = questions.stream()
                .map(q -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", q.getId());
                    map.put("content", q.getContent());
                    map.put("topicId", q.getTopic().getId());
                    map.put("topicName", q.getTopic().getName());
                    map.put("difficulty", q.getDifficulty());
                    map.put("questionType", q.getQuestionType().name());
                    map.put("optionsCount", q.getOptions().size());
                    return map;
                })
                .toList();

        return ResponseEntity.ok(result);
    }

    /**
     * GET /admin/questions/{id} - Lấy chi tiết câu hỏi theo ID
     */
    @GetMapping("/questions/{id}")
    public ResponseEntity<Map<String, Object>> getQuestionById(@PathVariable Long id) {
        Question question = questionRepository.findById(id).orElse(null);
        if (question == null) {
            return ResponseEntity.notFound().build();
        }

        Map<String, Object> result = new HashMap<>();
        result.put("id", question.getId());
        result.put("content", question.getContent());
        result.put("codeSnippet", question.getCodeSnippet());
        result.put("topicId", question.getTopic().getId());
        result.put("topicName", question.getTopic().getName());
        result.put("difficulty", question.getDifficulty());
        result.put("explanation", question.getExplanation());
        result.put("questionType", question.getQuestionType().name());

        List<Map<String, Object>> options = question.getOptions().stream()
                .map(opt -> {
                    Map<String, Object> optMap = new HashMap<>();
                    optMap.put("key", opt.getOptionKey());
                    optMap.put("content", opt.getContent());
                    optMap.put("isCorrect", opt.getIsCorrect());
                    return optMap;
                })
                .toList();
        result.put("options", options);

        return ResponseEntity.ok(result);
    }

    /**
     * POST /admin/questions - Tạo câu hỏi mới
     */
    @PostMapping("/questions")
    public ResponseEntity<Map<String, Object>> createQuestion(@RequestBody CreateQuestionRequest request) {
        // Validate topic exists
        Topic topic = topicRepository.findById(request.getTopicId()).orElse(null);
        if (topic == null) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Topic không tồn tại"));
        }

        // Create question
        Question question = new Question();
        question.setTopic(topic);
        question.setContent(request.getContent());
        question.setCodeSnippet(request.getCodeSnippet());
        question.setQuestionType(Question.QuestionType.valueOf(request.getQuestionType()));
        question.setDifficulty(request.getDifficulty());
        question.setExplanation(request.getExplanation());

        // Create options
        List<QuestionOption> optionList = new ArrayList<>();
        for (int i = 0; i < request.getOptions().size(); i++) {
            CreateQuestionRequest.OptionRequest optReq = request.getOptions().get(i);
            QuestionOption option = new QuestionOption();
            option.setQuestion(question);
            option.setOptionKey(optReq.getKey());
            option.setContent(optReq.getContent());
            option.setIsCorrect(optReq.isCorrect());
            optionList.add(option);
        }
        question.setOptions(optionList);

        questionRepository.save(question);

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "success", true,
                "message", "Tạo câu hỏi thành công",
                "questionId", question.getId()));
    }

    /**
     * PUT /admin/questions/{id} - Cập nhật câu hỏi
     */
    @PutMapping("/questions/{id}")
    public ResponseEntity<Map<String, Object>> updateQuestion(
            @PathVariable Long id,
            @RequestBody CreateQuestionRequest request) {

        Question question = questionRepository.findById(id).orElse(null);
        if (question == null) {
            return ResponseEntity.notFound().build();
        }

        question.setContent(request.getContent());
        question.setCodeSnippet(request.getCodeSnippet());
        question.setDifficulty(request.getDifficulty());
        question.setExplanation(request.getExplanation());

        questionRepository.save(question);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Cập nhật thành công"));
    }

    /**
     * DELETE /admin/questions/{id} - Xóa câu hỏi
     */
    @DeleteMapping("/questions/{id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long id) {
        if (!questionRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        questionRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * GET /admin/questions/template - Download CSV template
     */
    @GetMapping("/questions/template")
    public ResponseEntity<Resource> downloadTemplate() throws IOException {
        Resource resource = new ClassPathResource("templates/questions_template.csv");

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"questions_template.csv\"")
                .header(HttpHeaders.CONTENT_TYPE, "text/csv; charset=UTF-8")
                .body(resource);
    }

    /**
     * POST /admin/questions/import-csv - Import từ CSV
     */
    @PostMapping("/questions/import-csv")
    public ResponseEntity<Map<String, Object>> importCSV(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "File trống"));
        }

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {

            String headerLine = reader.readLine(); // Skip header
            String line;
            int imported = 0;
            List<String> errors = new ArrayList<>();

            while ((line = reader.readLine()) != null) {
                if (line.trim().isEmpty())
                    continue;

                try {
                    List<String> values = parseCSVLine(line);
                    if (values.size() < 11) {
                        errors.add("Dòng thiếu dữ liệu: " + line.substring(0, Math.min(50, line.length())));
                        continue;
                    }

                    // Parse values
                    Long topicId = Long.parseLong(values.get(0).trim());
                    String content = values.get(1);
                    String codeSnippet = values.get(2);
                    String questionType = values.get(3);
                    Integer difficulty = Integer.parseInt(values.get(4).trim());
                    String explanation = values.get(5);
                    String optionA = values.get(6);
                    String optionB = values.get(7);
                    String optionC = values.get(8);
                    String optionD = values.get(9);
                    String correctAnswer = values.get(10).trim().toUpperCase();

                    // Get topic
                    Topic topic = topicRepository.findById(topicId).orElse(null);
                    if (topic == null) {
                        errors.add("Topic ID không tồn tại: " + topicId);
                        continue;
                    }

                    // Create question
                    Question question = new Question();
                    question.setTopic(topic);
                    question.setContent(content);
                    question.setCodeSnippet(codeSnippet.isEmpty() ? null : codeSnippet);
                    question.setQuestionType(Question.QuestionType.valueOf(questionType));
                    question.setDifficulty(difficulty);
                    question.setExplanation(explanation);

                    // Create options
                    List<QuestionOption> optionList = new ArrayList<>();
                    String[] optContents = { optionA, optionB, optionC, optionD };
                    String[] optKeys = { "A", "B", "C", "D" };
                    int correctIndex = correctAnswer.charAt(0) - 'A';

                    for (int i = 0; i < 4; i++) {
                        QuestionOption opt = new QuestionOption();
                        opt.setQuestion(question);
                        opt.setOptionKey(optKeys[i]);
                        opt.setContent(optContents[i]);
                        opt.setIsCorrect(i == correctIndex);
                        optionList.add(opt);
                    }
                    question.setOptions(optionList);

                    questionRepository.save(question);
                    imported++;

                } catch (Exception e) {
                    errors.add("Lỗi parse dòng: " + e.getMessage());
                }
            }

            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("imported", imported);
            result.put("errors", errors);
            result.put("message", "Import thành công " + imported + " câu hỏi");

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", "Lỗi đọc file: " + e.getMessage()));
        }
    }

    private List<String> parseCSVLine(String line) {
        List<String> result = new ArrayList<>();
        StringBuilder current = new StringBuilder();
        boolean inQuotes = false;

        for (int i = 0; i < line.length(); i++) {
            char c = line.charAt(i);
            if (c == '"') {
                inQuotes = !inQuotes;
            } else if (c == ',' && !inQuotes) {
                result.add(current.toString().trim());
                current = new StringBuilder();
            } else {
                current.append(c);
            }
        }
        result.add(current.toString().trim());
        return result;
    }
}
