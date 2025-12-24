import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Flashcard Review component - Review mode với flip animation.
 */
@Component({
    selector: 'app-flashcard-review',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="flashcard-review">
      <header class="review-header">
        <h1>Review Flashcards</h1>
        <div class="progress-info">
          {{ currentIndex() + 1 }} / {{ totalCards() }}
        </div>
      </header>
      
      <div class="progress mb-6">
        <div 
          class="progress__bar" 
          [style.width.%]="(currentIndex() / totalCards()) * 100"
        ></div>
      </div>
      
      <div 
        class="flashcard" 
        [class.flipped]="isFlipped()"
        (click)="flip()"
      >
        <div class="flashcard__inner">
          <div class="flashcard__front">
            <span class="card-label">Câu hỏi</span>
            <p class="card-content">{{ currentCard().front }}</p>
            <span class="hint">Click để xem đáp án</span>
          </div>
          <div class="flashcard__back">
            <span class="card-label">Đáp án</span>
            <p class="card-content">{{ currentCard().back }}</p>
            @if (currentCard().codeExample) {
              <pre class="code-example"><code>{{ currentCard().codeExample }}</code></pre>
            }
          </div>
        </div>
      </div>
      
      @if (isFlipped()) {
        <div class="review-actions">
          <button class="btn btn--error" (click)="markReview(false)">
            <span class="material-icons-outlined">close</span>
            Chưa thuộc
          </button>
          <button class="btn btn--success" (click)="markReview(true)">
            <span class="material-icons-outlined">check</span>
            Đã thuộc
          </button>
        </div>
      }
    </div>
  `,
    styles: [`
    .flashcard-review {
      max-width: 800px;
      margin: 0 auto;
      padding: var(--spacing-6);
    }
    
    .review-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-4);
      
      h1 { font-size: var(--font-size-2xl); }
    }
    
    .progress-info {
      font-size: var(--font-size-lg);
      color: var(--color-text-secondary);
    }
    
    .flashcard {
      perspective: 1000px;
      cursor: pointer;
      margin-bottom: var(--spacing-6);
    }
    
    .flashcard__inner {
      position: relative;
      min-height: 400px;
      transition: transform 0.6s;
      transform-style: preserve-3d;
    }
    
    .flashcard.flipped .flashcard__inner {
      transform: rotateY(180deg);
    }
    
    .flashcard__front,
    .flashcard__back {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--spacing-8);
      background: var(--gradient-card);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-2xl);
      backface-visibility: hidden;
      text-align: center;
    }
    
    .flashcard__back {
      transform: rotateY(180deg);
    }
    
    .card-label {
      position: absolute;
      top: var(--spacing-4);
      left: var(--spacing-4);
      padding: var(--spacing-1) var(--spacing-3);
      font-size: var(--font-size-xs);
      font-weight: 600;
      color: var(--color-primary-light);
      background-color: rgba(99, 102, 241, 0.2);
      border-radius: var(--radius-full);
    }
    
    .card-content {
      font-size: var(--font-size-2xl);
      line-height: 1.6;
      color: var(--color-text-primary);
    }
    
    .hint {
      position: absolute;
      bottom: var(--spacing-4);
      font-size: var(--font-size-sm);
      color: var(--color-text-muted);
    }
    
    .code-example {
      margin-top: var(--spacing-4);
      padding: var(--spacing-4);
      background-color: var(--color-bg-secondary);
      border-radius: var(--radius-lg);
      font-size: var(--font-size-sm);
      text-align: left;
      overflow-x: auto;
    }
    
    .review-actions {
      display: flex;
      justify-content: center;
      gap: var(--spacing-4);
    }
    
    .btn--error {
      background-color: var(--color-error);
      color: white;
      
      &:hover {
        background-color: #dc2626;
      }
    }
    
    .btn--success {
      background-color: var(--color-success);
      color: white;
      
      &:hover {
        background-color: #16a34a;
      }
    }
  `]
})
export class FlashcardReviewComponent {
    currentIndex = signal(0);
    totalCards = signal(5);
    isFlipped = signal(false);

    cards = [
        { front: 'Functional Interface là gì?', back: 'Là interface chỉ có một abstract method. Được đánh dấu @FunctionalInterface và có thể dùng với lambda expressions.', codeExample: '@FunctionalInterface\ninterface MyFunc {\n  void apply();\n}' },
        { front: 'HashMap vs TreeMap?', back: 'HashMap: O(1) lookup, không sắp xếp. TreeMap: O(log n) lookup, tự động sắp xếp theo key.', codeExample: null },
        { front: 'try-with-resources hoạt động ra sao?', back: 'Tự động đóng resources implement AutoCloseable sau khi try block kết thúc. Resources đóng theo thứ tự ngược.', codeExample: 'try (var reader = new FileReader(file)) {\n  // use reader\n} // auto-closed' },
    ];

    currentCard = () => this.cards[this.currentIndex()];

    flip() {
        this.isFlipped.set(!this.isFlipped());
    }

    markReview(correct: boolean) {
        // TODO: Call API to update spaced repetition
        if (this.currentIndex() < this.totalCards() - 1) {
            this.currentIndex.update(i => i + 1);
            this.isFlipped.set(false);
        }
    }
}
