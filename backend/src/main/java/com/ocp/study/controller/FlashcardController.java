package com.ocp.study.controller;

import com.ocp.study.dto.FlashcardDTO;
import com.ocp.study.service.FlashcardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST Controller cho Flashcards API.
 * 
 * @author OCP Study Team
 * @since 1.0.0
 */
@RestController
@RequestMapping("/flashcards")
@RequiredArgsConstructor
@Tag(name = "Flashcards", description = "API quản lý flashcards")
public class FlashcardController {

    private final FlashcardService flashcardService;

    @GetMapping
    @Operation(summary = "Lấy tất cả flashcards (có phân trang)")
    public ResponseEntity<org.springframework.data.domain.Page<FlashcardDTO>> getAllFlashcards(
            org.springframework.data.domain.Pageable pageable) {
        return ResponseEntity.ok(flashcardService.getAllFlashcards(pageable));
    }

    @GetMapping("/topic/{topicId}")
    @Operation(summary = "Lấy flashcards theo topic (có phân trang)")
    public ResponseEntity<org.springframework.data.domain.Page<FlashcardDTO>> getFlashcardsByTopic(
            @PathVariable UUID topicId,
            org.springframework.data.domain.Pageable pageable) {
        return ResponseEntity.ok(flashcardService.getFlashcardsByTopic(topicId, pageable));
    }

    @GetMapping("/review")
    @Operation(summary = "Lấy flashcards cần review", description = "Trả về flashcards theo thuật toán Spaced Repetition")
    public ResponseEntity<List<FlashcardDTO>> getFlashcardsToReview() {
        return ResponseEntity.ok(flashcardService.getFlashcardsToReview());
    }

    @GetMapping("/review/topic/{topicId}")
    @Operation(summary = "Lấy flashcards cần review theo topic")
    public ResponseEntity<List<FlashcardDTO>> getFlashcardsToReviewByTopic(@PathVariable UUID topicId) {
        return ResponseEntity.ok(flashcardService.getFlashcardsToReviewByTopic(topicId));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy flashcard theo ID")
    public ResponseEntity<FlashcardDTO> getFlashcardById(@PathVariable UUID id) {
        return ResponseEntity.ok(flashcardService.getFlashcardById(id));
    }

    @PostMapping
    @Operation(summary = "Tạo flashcard mới")
    public ResponseEntity<FlashcardDTO> createFlashcard(@Valid @RequestBody FlashcardDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(flashcardService.createFlashcard(dto));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật flashcard")
    public ResponseEntity<FlashcardDTO> updateFlashcard(
            @PathVariable UUID id,
            @Valid @RequestBody FlashcardDTO dto) {
        return ResponseEntity.ok(flashcardService.updateFlashcard(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa flashcard")
    public ResponseEntity<Void> deleteFlashcard(@PathVariable UUID id) {
        flashcardService.deleteFlashcard(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/review")
    @Operation(summary = "Đánh dấu đã review flashcard", description = "Cập nhật spaced repetition interval dựa trên correct/incorrect")
    public ResponseEntity<FlashcardDTO> markReviewed(
            @PathVariable UUID id,
            @RequestParam boolean correct) {
        return ResponseEntity.ok(flashcardService.markReviewed(id, correct));
    }
}
