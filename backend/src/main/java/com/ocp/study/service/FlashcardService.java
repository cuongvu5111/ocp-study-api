package com.ocp.study.service;

import com.ocp.study.dto.FlashcardDTO;
import com.ocp.study.entity.Flashcard;
import com.ocp.study.entity.FlashcardReview;
import com.ocp.study.entity.Subtopic;
import com.ocp.study.entity.Topic;
import com.ocp.study.entity.User;
import com.ocp.study.repository.FlashcardRepository;
import com.ocp.study.repository.FlashcardReviewRepository;
import com.ocp.study.repository.SubtopicRepository;
import com.ocp.study.repository.TopicRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Service xử lý logic cho Flashcards với user-specific review tracking.
 * 
 * @author OCP Study Team
 * @since 1.0.0
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@SuppressWarnings("null")
public class FlashcardService {

    private final FlashcardRepository flashcardRepository;
    private final FlashcardReviewRepository flashcardReviewRepository;
    private final TopicRepository topicRepository;
    private final SubtopicRepository subtopicRepository;
    private final UserService userService;

    /**
     * Lấy tất cả flashcards (chưa filter theo user)
     */
    /**
     * Lấy tất cả flashcards (chưa filter theo user)
     */
    public org.springframework.data.domain.Page<FlashcardDTO> getAllFlashcards(
            org.springframework.data.domain.Pageable pageable) {
        return flashcardRepository.findAll(pageable)
                .map(fc -> mapToDTO(fc, null));
    }

    /**
     * Lấy flashcards theo topic với user review data
     */
    public org.springframework.data.domain.Page<FlashcardDTO> getFlashcardsByTopic(Long topicId,
            org.springframework.data.domain.Pageable pageable) {
        User user = userService.getCurrentUser();
        // Repository needs to support pagination
        org.springframework.data.domain.Page<Flashcard> flashcards = flashcardRepository
                .findByTopicIdOrderByCreatedAtDesc(topicId, pageable);

        // Get all reviews for this user (for the current page's flashcards would be
        // efficient, but map lookup is okay even for a page)
        // Ideally we fetch reviews only for the flashcard IDs in the page
        List<Long> flashcardIds = flashcards.getContent().stream().map(Flashcard::getId).collect(Collectors.toList());

        // This is a bit inefficient if we fetch ALL reviews for topic.
        // Better: findByFlashcardIdInAndUser(ids, user)
        // But for now, let's stick to simple logic or optimize if Review Repo supports
        // it.
        // Assuming findByUserAndTopicId returns all for topic.

        Map<Long, FlashcardReview> reviewMap = flashcardReviewRepository.findByUserAndTopicId(user, topicId)
                .stream()
                .filter(fr -> flashcardIds.contains(fr.getFlashcard().getId()))
                .collect(Collectors.toMap(
                        fr -> fr.getFlashcard().getId(),
                        fr -> fr));

        return flashcards.map(fc -> mapToDTO(fc, reviewMap.get(fc.getId())));
    }

    /**
     * Lấy flashcards cần review của user (spaced repetition)
     */
    public List<FlashcardDTO> getFlashcardsToReview() {
        User user = userService.getCurrentUser();
        List<FlashcardReview> dueReviews = flashcardReviewRepository.findDueReviewsByUser(user, LocalDateTime.now());

        return dueReviews.stream()
                .map(review -> mapToDTO(review.getFlashcard(), review))
                .collect(Collectors.toList());
    }

    /**
     * Lấy flashcards cần review theo topic
     */
    public List<FlashcardDTO> getFlashcardsToReviewByTopic(Long topicId) {
        User user = userService.getCurrentUser();
        List<FlashcardReview> reviews = flashcardReviewRepository.findByUserAndTopicId(user, topicId);

        LocalDateTime now = LocalDateTime.now();
        return reviews.stream()
                .filter(review -> review.getNextReview() != null && review.getNextReview().isBefore(now))
                .map(review -> mapToDTO(review.getFlashcard(), review))
                .collect(Collectors.toList());
    }

    /**
     * Lấy flashcard theo ID
     */
    public FlashcardDTO getFlashcardById(Long id) {
        Flashcard flashcard = flashcardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Flashcard không tồn tại: " + id));
        return mapToDTO(flashcard, null); // Admin operation, no user review
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
        return mapToDTO(flashcard, null); // Admin create, no user review
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
        return mapToDTO(flashcard, null); // Admin update, no user review
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
     * Đánh dấu đã review flashcard (user-specific)
     */
    @Transactional
    public FlashcardDTO markReviewed(Long flashcardId, boolean correct) {
        User user = userService.getCurrentUser();
        Flashcard flashcard = flashcardRepository.findById(flashcardId)
                .orElseThrow(() -> new RuntimeException("Flashcard không tồn tại: " + flashcardId));

        // Find or create review record
        FlashcardReview review = flashcardReviewRepository.findByUserAndFlashcard(user, flashcard)
                .orElseGet(() -> FlashcardReview.builder()
                        .user(user)
                        .flashcard(flashcard)
                        .build());

        review.markReviewed(correct);
        review = flashcardReviewRepository.save(review);

        return mapToDTO(flashcard, review);
    }

    /**
     * Map entity sang DTO, merge với review data nếu có
     */
    private FlashcardDTO mapToDTO(Flashcard flashcard, FlashcardReview review) {
        return FlashcardDTO.builder()
                .id(flashcard.getId())
                .topicId(flashcard.getTopic().getId())
                .topicName(flashcard.getTopic().getName())
                .subtopicId(flashcard.getSubtopic() != null ? flashcard.getSubtopic().getId() : null)
                .subtopicName(flashcard.getSubtopic() != null ? flashcard.getSubtopic().getName() : null)
                .front(flashcard.getFront())
                .back(flashcard.getBack())
                .codeExample(flashcard.getCodeExample())
                // User-specific review data
                .reviewCount(review != null ? review.getReviewCount() : 0)
                .correctCount(review != null ? review.getCorrectCount() : 0)
                .nextReview(review != null ? review.getNextReview() : null)
                .createdAt(flashcard.getCreatedAt())
                .build();
    }
}
