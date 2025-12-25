import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';

interface Flashcard {
  id: string;
  topicId: string;
  topicName: string;
  front: string;
  back: string;
  codeExample?: string;
  reviewCount: number;
  correctCount: number;
}

/**
 * Flashcard Review component - Review mode với flip animation và spaced repetition.
 */
@Component({
  selector: 'app-flashcard-review',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './flashcard-review.component.html',
  styleUrls: ['./flashcard-review.component.scss']
})
export class FlashcardReviewComponent implements OnInit {
  private apiService = inject(ApiService);

  Math = Math; // Expose to template

  loading = signal(true);
  isFlipped = signal(false);
  currentIndex = signal(0);
  reviewComplete = signal(false);

  cards = signal<Flashcard[]>([]);
  correctCount = signal(0);
  incorrectCount = signal(0);

  ngOnInit() {
    this.loadFlashcards();
  }

  loadFlashcards() {
    this.loading.set(true);
    this.apiService.getFlashcards().subscribe({
      next: (data) => {
        // Shuffle cards for review
        const shuffled = [...data].sort(() => Math.random() - 0.5);
        this.cards.set(shuffled);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading flashcards:', err);
        this.loading.set(false);
      }
    });
  }

  currentCard = () => {
    const cards = this.cards();
    const index = this.currentIndex();
    return cards.length > 0 ? cards[index] : null;
  };

  flip() {
    if (!this.reviewComplete()) {
      this.isFlipped.set(!this.isFlipped());
    }
  }

  markReview(correct: boolean) {
    const card = this.currentCard();
    if (!card) return;

    // Update stats
    if (correct) {
      this.correctCount.update(c => c + 1);
    } else {
      this.incorrectCount.update(c => c + 1);
    }

    // Call API to update review stats (fire and forget)
    this.apiService.markFlashcardReviewed(card.id, correct).subscribe({
      error: (err) => console.error('Error updating review:', err)
    });

    // Move to next card or complete
    if (this.currentIndex() < this.cards().length - 1) {
      this.currentIndex.update(i => i + 1);
      this.isFlipped.set(false);
    } else {
      this.reviewComplete.set(true);
    }
  }

  restartReview() {
    // Reshuffle and restart
    const shuffled = [...this.cards()].sort(() => Math.random() - 0.5);
    this.cards.set(shuffled);
    this.currentIndex.set(0);
    this.correctCount.set(0);
    this.incorrectCount.set(0);
    this.isFlipped.set(false);
    this.reviewComplete.set(false);
  }
}
