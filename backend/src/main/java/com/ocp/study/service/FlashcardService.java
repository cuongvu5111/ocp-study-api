package com.ocp.study.service;

import com.ocp.study.dto.FlashcardDTO;
import com.ocp.study.entity.Flashcard;
import com.ocp.study.entity.Subtopic;
import com.ocp.study.entity.Topic;
import com.ocp.study.repository.FlashcardRepository;
import com.ocp.study.repository.SubtopicRepository;
import com.ocp.study.repository.TopicRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service xử lý logic cho Flashcards.
 * 
 * @author OCP Study Team
 * @since 1.0.0
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FlashcardService {

    private final FlashcardRepository flashcardRepository;
    private final TopicRepository topicRepository;
    private final SubtopicRepository subtopicRepository;

    /**
     * Lấy tất cả flashcards
     */
    public List<FlashcardDTO> getAllFlashcards() {
        return flashcardRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Lấy flashcards theo topic
     */
    public List<FlashcardDTO> getFlashcardsByTopic(Long topicId) {
        return flashcardRepository.findByTopicIdOrderByCreatedAtDesc(topicId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Lấy flashcards cần review (spaced repetition)
     */
    public List<FlashcardDTO> getFlashcardsToReview() {
        return flashcardRepository.findCardsToReview(LocalDateTime.now()).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Lấy flashcards cần review theo topic
     */
    public List<FlashcardDTO> getFlashcardsToReviewByTopic(Long topicId) {
        return flashcardRepository.findCardsToReviewByTopic(topicId, LocalDateTime.now()).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Lấy flashcard theo ID
     */
    public FlashcardDTO getFlashcardById(Long id) {
        Flashcard flashcard = flashcardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Flashcard không tồn tại: " + id));
        return mapToDTO(flashcard);
    }

    /**
     * Tạo flashcard mới
     */
    @Transactional
    public FlashcardDTO createFlashcard(FlashcardDTO dto) {
        Topic topic = topicRepository.findById(dto.getTopicId())
                .orElseThrow(() -> new RuntimeException("Topic không tồn tại: " + dto.getTopicId()));

        Subtopic subtopic = null;
        if (dto.getSubtopicId() != null) {
            subtopic = subtopicRepository.findById(dto.getSubtopicId())
                    .orElseThrow(() -> new RuntimeException("Subtopic không tồn tại: " + dto.getSubtopicId()));
        }

        Flashcard flashcard = Flashcard.builder()
                .topic(topic)
                .subtopic(subtopic)
                .front(dto.getFront())
                .back(dto.getBack())
                .codeExample(dto.getCodeExample())
                .build();

        flashcard = flashcardRepository.save(flashcard);
        return mapToDTO(flashcard);
    }

    /**
     * Cập nhật flashcard
     */
    @Transactional
    public FlashcardDTO updateFlashcard(Long id, FlashcardDTO dto) {
        Flashcard flashcard = flashcardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Flashcard không tồn tại: " + id));

        flashcard.setFront(dto.getFront());
        flashcard.setBack(dto.getBack());
        flashcard.setCodeExample(dto.getCodeExample());

        if (dto.getSubtopicId() != null) {
            Subtopic subtopic = subtopicRepository.findById(dto.getSubtopicId())
                    .orElseThrow(() -> new RuntimeException("Subtopic không tồn tại"));
            flashcard.setSubtopic(subtopic);
        }

        flashcard = flashcardRepository.save(flashcard);
        return mapToDTO(flashcard);
    }

    /**
     * Xóa flashcard
     */
    @Transactional
    public void deleteFlashcard(Long id) {
        if (!flashcardRepository.existsById(id)) {
            throw new RuntimeException("Flashcard không tồn tại: " + id);
        }
        flashcardRepository.deleteById(id);
    }

    /**
     * Đánh dấu đã review flashcard
     */
    @Transactional
    public FlashcardDTO markReviewed(Long id, boolean correct) {
        Flashcard flashcard = flashcardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Flashcard không tồn tại: " + id));

        flashcard.markReviewed(correct);
        flashcard = flashcardRepository.save(flashcard);
        return mapToDTO(flashcard);
    }

    /**
     * Map entity sang DTO
     */
    private FlashcardDTO mapToDTO(Flashcard flashcard) {
        return FlashcardDTO.builder()
                .id(flashcard.getId())
                .topicId(flashcard.getTopic().getId())
                .topicName(flashcard.getTopic().getName())
                .subtopicId(flashcard.getSubtopic() != null ? flashcard.getSubtopic().getId() : null)
                .subtopicName(flashcard.getSubtopic() != null ? flashcard.getSubtopic().getName() : null)
                .front(flashcard.getFront())
                .back(flashcard.getBack())
                .codeExample(flashcard.getCodeExample())
                .reviewCount(flashcard.getReviewCount())
                .correctCount(flashcard.getCorrectCount())
                .nextReview(flashcard.getNextReview())
                .createdAt(flashcard.getCreatedAt())
                .build();
    }
}
