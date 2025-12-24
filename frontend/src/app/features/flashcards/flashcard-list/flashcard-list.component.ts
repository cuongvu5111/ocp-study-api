import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

/**
 * Flashcard List component - Hiển thị danh sách flashcards.
 */
@Component({
    selector: 'app-flashcard-list',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="flashcard-list">
      <header class="page-header">
        <div>
          <h1>Flashcards</h1>
          <p>Ôn tập với phương pháp Spaced Repetition</p>
        </div>
        <div class="header-actions">
          <a routerLink="/flashcards/review" class="btn btn--primary">
            <span class="material-icons-outlined">play_arrow</span>
            Review ngay ({{ dueCount() }})
          </a>
          <button class="btn btn--secondary" (click)="showCreateModal = true">
            <span class="material-icons-outlined">add</span>
            Tạo mới
          </button>
        </div>
      </header>
      
      <!-- Stats -->
      <div class="stats-row">
        <div class="stat-box">
          <span class="stat-icon">📚</span>
          <div class="stat-info">
            <span class="stat-value">{{ totalCards() }}</span>
            <span class="stat-label">Tổng số</span>
          </div>
        </div>
        <div class="stat-box">
          <span class="stat-icon">⏰</span>
          <div class="stat-info">
            <span class="stat-value">{{ dueCount() }}</span>
            <span class="stat-label">Cần ôn</span>
          </div>
        </div>
        <div class="stat-box">
          <span class="stat-icon">✅</span>
          <div class="stat-info">
            <span class="stat-value">{{ masteredCount() }}</span>
            <span class="stat-label">Đã thuộc</span>
          </div>
        </div>
      </div>
      
      <!-- Flashcards Grid -->
      <div class="cards-grid">
        @for (card of flashcards(); track card.id) {
          <div class="flashcard-item">
            <div class="card-topic">{{ card.topicName }}</div>
            <div class="card-front">{{ card.front }}</div>
            <div class="card-meta">
              <span title="Số lần review">
                <span class="material-icons-outlined">refresh</span>
                {{ card.reviewCount }}
              </span>
              <span title="Lần review tiếp">
                <span class="material-icons-outlined">schedule</span>
                {{ card.nextReview }}
              </span>
            </div>
          </div>
        }
      </div>
    </div>
  `,
    styles: [`
    .flashcard-list {
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--spacing-6);
      
      h1 { margin-bottom: var(--spacing-2); }
      p { color: var(--color-text-secondary); margin: 0; }
    }
    
    .header-actions {
      display: flex;
      gap: var(--spacing-3);
    }
    
    .stats-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--spacing-4);
      margin-bottom: var(--spacing-6);
    }
    
    .stat-box {
      display: flex;
      align-items: center;
      gap: var(--spacing-4);
      padding: var(--spacing-5);
      background: var(--gradient-card);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-xl);
    }
    
    .stat-icon { font-size: 2rem; }
    
    .stat-info {
      display: flex;
      flex-direction: column;
    }
    
    .stat-value {
      font-size: var(--font-size-2xl);
      font-weight: 700;
    }
    
    .stat-label {
      font-size: var(--font-size-sm);
      color: var(--color-text-muted);
    }
    
    .cards-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--spacing-4);
    }
    
    .flashcard-item {
      padding: var(--spacing-5);
      background: var(--gradient-card);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-xl);
      transition: all var(--transition-normal);
      cursor: pointer;
      
      &:hover {
        border-color: var(--color-primary);
        transform: translateY(-2px);
      }
    }
    
    .card-topic {
      font-size: var(--font-size-xs);
      color: var(--color-primary-light);
      margin-bottom: var(--spacing-2);
    }
    
    .card-front {
      font-size: var(--font-size-base);
      color: var(--color-text-primary);
      margin-bottom: var(--spacing-4);
      line-height: 1.5;
    }
    
    .card-meta {
      display: flex;
      gap: var(--spacing-4);
      font-size: var(--font-size-sm);
      color: var(--color-text-muted);
      
      span {
        display: flex;
        align-items: center;
        gap: var(--spacing-1);
        
        .material-icons-outlined { font-size: 16px; }
      }
    }
    
    @media (max-width: 1024px) {
      .cards-grid, .stats-row {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    
    @media (max-width: 640px) {
      .cards-grid, .stats-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class FlashcardListComponent {
    showCreateModal = false;
    totalCards = signal(45);
    dueCount = signal(12);
    masteredCount = signal(23);

    flashcards = signal([
        { id: 1, topicName: 'Lambda & Streams', front: 'Functional Interface là gì?', reviewCount: 5, nextReview: '2 giờ' },
        { id: 2, topicName: 'Collections', front: 'HashMap vs TreeMap?', reviewCount: 3, nextReview: '1 ngày' },
        { id: 3, topicName: 'Concurrency', front: 'synchronized block hoạt động như thế nào?', reviewCount: 2, nextReview: '3 ngày' },
        { id: 4, topicName: 'OOP', front: 'Abstract class vs Interface trong Java 11?', reviewCount: 7, nextReview: '1 tuần' },
        { id: 5, topicName: 'Exceptions', front: 'try-with-resources hoạt động ra sao?', reviewCount: 4, nextReview: 'Hôm nay' },
        { id: 6, topicName: 'Modules', front: 'module-info.java chứa những gì?', reviewCount: 1, nextReview: 'Hôm nay' },
    ]);
}
