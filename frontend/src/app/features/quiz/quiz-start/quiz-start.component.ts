import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

/**
 * Quiz Start component - Chọn mode và bắt đầu quiz.
 */
@Component({
    selector: 'app-quiz-start',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="quiz-start">
      <header class="page-header">
        <h1>Quiz Practice</h1>
        <p>Luyện tập với câu hỏi tương tự đề thi thực tế</p>
      </header>
      
      <!-- Quiz Modes -->
      <div class="mode-grid">
        <div class="mode-card" (click)="selectMode('quick')">
          <span class="mode-icon">⚡</span>
          <h3>Quick Quiz</h3>
          <p>10 câu ngẫu nhiên, không giới hạn thời gian</p>
        </div>
        
        <div class="mode-card" (click)="selectMode('topic')">
          <span class="mode-icon">📚</span>
          <h3>Quiz theo Topic</h3>
          <p>Chọn topic bạn muốn luyện tập</p>
        </div>
        
        <div class="mode-card mode-card--premium" (click)="selectMode('mock')">
          <span class="mode-icon">🎯</span>
          <h3>Mock Exam</h3>
          <p>50 câu, 90 phút - giống đề thi thật</p>
          <span class="premium-badge">Đề xuất</span>
        </div>
      </div>
      
      <!-- Recent Scores -->
      <section class="recent-section">
        <h2 class="section-title">Lịch sử gần đây</h2>
        <div class="history-list">
          @for (item of history(); track item.date) {
            <div class="history-item">
              <div class="history-info">
                <span class="history-type">{{ item.type }}</span>
                <span class="history-date">{{ item.date }}</span>
              </div>
              <div class="history-score" [class.pass]="item.score >= 68">
                {{ item.score }}%
              </div>
            </div>
          }
        </div>
      </section>
    </div>
  `,
    styles: [`
    .quiz-start {
      max-width: 1000px;
      margin: 0 auto;
    }
    
    .page-header {
      margin-bottom: var(--spacing-8);
      
      h1 { margin-bottom: var(--spacing-2); }
      p { color: var(--color-text-secondary); margin: 0; }
    }
    
    .mode-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--spacing-6);
      margin-bottom: var(--spacing-10);
    }
    
    .mode-card {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: var(--spacing-8);
      background: var(--gradient-card);
      border: 2px solid var(--color-border);
      border-radius: var(--radius-2xl);
      cursor: pointer;
      transition: all var(--transition-normal);
      
      &:hover {
        transform: translateY(-4px);
        border-color: var(--color-primary);
        box-shadow: var(--shadow-glow);
      }
      
      &--premium {
        border-color: var(--color-accent);
        
        &:hover {
          border-color: var(--color-accent);
          box-shadow: 0 0 20px rgba(245, 158, 11, 0.3);
        }
      }
    }
    
    .mode-icon {
      font-size: 3rem;
      margin-bottom: var(--spacing-4);
    }
    
    .mode-card h3 {
      font-size: var(--font-size-xl);
      margin-bottom: var(--spacing-2);
    }
    
    .mode-card p {
      font-size: var(--font-size-sm);
      color: var(--color-text-muted);
      margin: 0;
    }
    
    .premium-badge {
      position: absolute;
      top: var(--spacing-4);
      right: var(--spacing-4);
      padding: var(--spacing-1) var(--spacing-3);
      font-size: var(--font-size-xs);
      font-weight: 600;
      color: var(--color-accent);
      background-color: rgba(245, 158, 11, 0.2);
      border-radius: var(--radius-full);
    }
    
    .section-title {
      font-size: var(--font-size-xl);
      margin-bottom: var(--spacing-6);
    }
    
    .history-list {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-3);
    }
    
    .history-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-4);
      background: var(--gradient-card);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
    }
    
    .history-info {
      display: flex;
      flex-direction: column;
    }
    
    .history-type {
      font-weight: 500;
      color: var(--color-text-primary);
    }
    
    .history-date {
      font-size: var(--font-size-sm);
      color: var(--color-text-muted);
    }
    
    .history-score {
      font-size: var(--font-size-xl);
      font-weight: 700;
      color: var(--color-error);
      
      &.pass {
        color: var(--color-success);
      }
    }
    
    @media (max-width: 768px) {
      .mode-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class QuizStartComponent {
    history = signal([
        { type: 'Mock Exam', date: '22/12/2024', score: 72 },
        { type: 'Quick Quiz', date: '21/12/2024', score: 80 },
        { type: 'Topic: Streams', date: '20/12/2024', score: 65 },
    ]);

    selectMode(mode: string) {
        console.log('Selected mode:', mode);
        // TODO: Navigate to quiz page with mode
    }
}
