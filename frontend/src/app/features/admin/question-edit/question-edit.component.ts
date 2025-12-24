import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';

interface Option {
    key: string;
    content: string;
    isCorrect: boolean;
}

/**
 * Admin component - Form sửa câu hỏi.
 */
@Component({
    selector: 'app-question-edit',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    template: `
    <div class="admin-container">
      <header class="page-header">
        <a routerLink="/admin/questions" class="btn btn--ghost btn--icon">
          <span class="material-icons-outlined">arrow_back</span>
        </a>
        <h1>Sửa câu hỏi #{{ questionId }}</h1>
      </header>

      @if (loading()) {
      <div class="loading-state">
        <div class="spinner"></div>
        <p>Đang tải...</p>
      </div>
      } @else {
      <form (ngSubmit)="onSubmit()" class="question-form">
        <!-- Topic -->
        <div class="form-group">
          <label for="topic">Topic</label>
          <select id="topic" [(ngModel)]="topicId" name="topicId" required>
            <option value="">Chọn topic</option>
            @for (topic of topics(); track topic.id) {
            <option [value]="topic.id">{{ topic.name }}</option>
            }
          </select>
        </div>

        <!-- Question Content -->
        <div class="form-group">
          <label for="content">Nội dung câu hỏi *</label>
          <textarea 
            id="content" 
            [(ngModel)]="content" 
            name="content"
            rows="4"
            required
          ></textarea>
        </div>

        <!-- Code Snippet -->
        <div class="form-group">
          <label for="codeSnippet">Code snippet (optional)</label>
          <textarea 
            id="codeSnippet" 
            [(ngModel)]="codeSnippet" 
            name="codeSnippet"
            rows="6"
            class="code-input"
          ></textarea>
        </div>

        <!-- Options -->
        <div class="form-group">
          <label>Đáp án (chọn đáp án đúng)</label>
          <div class="options-grid">
            @for (opt of options; track opt.key; let i = $index) {
            <div class="option-row">
              <label class="radio-label">
                <input 
                  type="radio" 
                  name="correct" 
                  [value]="i"
                  [(ngModel)]="correctIndex"
                />
                <span class="option-key">{{ opt.key }}</span>
              </label>
              <input 
                type="text" 
                [(ngModel)]="opt.content" 
                [name]="'option_' + opt.key"
                required
              />
            </div>
            }
          </div>
        </div>

        <!-- Difficulty -->
        <div class="form-group">
          <label>Độ khó</label>
          <div class="difficulty-selector">
            @for (level of [1, 2, 3]; track level) {
            <button 
              type="button" 
              class="difficulty-btn" 
              [class.active]="difficulty === level"
              (click)="difficulty = level"
            >
              @for (star of [1,2,3]; track star) {
              <span class="star" [class.filled]="star <= level">★</span>
              }
            </button>
            }
          </div>
        </div>

        <!-- Explanation -->
        <div class="form-group">
          <label for="explanation">Giải thích đáp án</label>
          <textarea 
            id="explanation" 
            [(ngModel)]="explanation" 
            name="explanation"
            rows="3"
          ></textarea>
        </div>

        @if (error()) {
        <div class="error-message">{{ error() }}</div>
        }

        @if (success()) {
        <div class="success-message">{{ success() }}</div>
        }

        <div class="form-actions">
          <a routerLink="/admin/questions" class="btn btn--ghost">Hủy</a>
          <button type="submit" class="btn btn--primary" [disabled]="saving()">
            @if (saving()) { <span class="spinner-sm"></span> }
            Lưu thay đổi
          </button>
        </div>
      </form>
      }
    </div>
  `,
    styles: [`
    .admin-container {
      max-width: 800px;
      margin: 0 auto;
      padding: var(--spacing-6);
    }

    .page-header {
      display: flex;
      align-items: center;
      gap: var(--spacing-4);
      margin-bottom: var(--spacing-8);

      h1 { margin: 0; }
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: var(--spacing-12);
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid var(--color-border);
      border-top-color: var(--color-primary);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin { to { transform: rotate(360deg); } }

    .question-form {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-6);
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-2);

      label {
        font-weight: 500;
        color: var(--color-text-secondary);
      }

      input, textarea, select {
        padding: var(--spacing-3) var(--spacing-4);
        background: var(--color-bg-secondary);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-lg);
        color: var(--color-text-primary);
        font-size: var(--font-size-base);

        &:focus {
          outline: none;
          border-color: var(--color-primary);
        }
      }

      .code-input {
        font-family: monospace;
        font-size: var(--font-size-sm);
      }
    }

    .options-grid {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-3);
    }

    .option-row {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);

      .radio-label {
        display: flex;
        align-items: center;
        gap: var(--spacing-2);
        cursor: pointer;
      }

      .option-key {
        font-weight: 600;
        color: var(--color-primary);
        width: 24px;
      }

      input[type="text"] {
        flex: 1;
      }
    }

    .difficulty-selector {
      display: flex;
      gap: var(--spacing-3);
    }

    .difficulty-btn {
      padding: var(--spacing-2) var(--spacing-4);
      background: var(--color-bg-secondary);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      cursor: pointer;

      &.active {
        border-color: var(--color-primary);
        background: rgba(99, 102, 241, 0.1);
      }

      .star {
        color: var(--color-text-muted);
        &.filled { color: var(--color-accent); }
      }
    }

    .error-message {
      padding: var(--spacing-3);
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid var(--color-error);
      border-radius: var(--radius-lg);
      color: var(--color-error);
    }

    .success-message {
      padding: var(--spacing-3);
      background: rgba(34, 197, 94, 0.1);
      border: 1px solid var(--color-success);
      border-radius: var(--radius-lg);
      color: var(--color-success);
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--spacing-4);
    }

    .spinner-sm {
      width: 16px;
      height: 16px;
      border: 2px solid transparent;
      border-top-color: currentColor;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }
  `]
})
export class QuestionEditComponent implements OnInit {
    private apiService = inject(ApiService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    questionId = 0;
    topics = signal<any[]>([]);
    loading = signal(true);
    saving = signal(false);
    error = signal<string | null>(null);
    success = signal<string | null>(null);

    topicId = '';
    content = '';
    codeSnippet = '';
    difficulty = 2;
    explanation = '';
    correctIndex = 0;

    options: Option[] = [
        { key: 'A', content: '', isCorrect: true },
        { key: 'B', content: '', isCorrect: false },
        { key: 'C', content: '', isCorrect: false },
        { key: 'D', content: '', isCorrect: false },
    ];

    ngOnInit() {
        this.questionId = Number(this.route.snapshot.paramMap.get('id'));
        this.loadTopics();
        this.loadQuestion();
    }

    loadTopics() {
        this.apiService.getTopics().subscribe({
            next: (data) => this.topics.set(data),
            error: (err) => console.error('Error loading topics:', err)
        });
    }

    loadQuestion() {
        this.apiService.getQuestionById(this.questionId).subscribe({
            next: (data) => {
                this.topicId = String(data.topicId);
                this.content = data.content || '';
                this.codeSnippet = data.codeSnippet || '';
                this.difficulty = data.difficulty || 2;
                this.explanation = data.explanation || '';

                // Load options
                if (data.options && data.options.length === 4) {
                    this.options = data.options.map((opt: any, i: number) => {
                        if (opt.isCorrect) this.correctIndex = i;
                        return {
                            key: opt.key,
                            content: opt.content,
                            isCorrect: opt.isCorrect
                        };
                    });
                }

                this.loading.set(false);
            },
            error: (err) => {
                console.error('Error loading question:', err);
                this.error.set('Không tìm thấy câu hỏi');
                this.loading.set(false);
            }
        });
    }

    onSubmit() {
        if (!this.topicId || !this.content) {
            this.error.set('Vui lòng điền đầy đủ thông tin');
            return;
        }

        if (this.options.some(o => !o.content)) {
            this.error.set('Vui lòng điền đầy đủ 4 đáp án');
            return;
        }

        // Set correct answer
        this.options.forEach((opt, i) => opt.isCorrect = i === this.correctIndex);

        const payload = {
            topicId: Number(this.topicId),
            content: this.content,
            codeSnippet: this.codeSnippet || null,
            questionType: 'SINGLE_CHOICE',
            difficulty: this.difficulty,
            explanation: this.explanation,
            options: this.options
        };

        this.saving.set(true);
        this.error.set(null);

        this.apiService.updateQuestion(this.questionId, payload).subscribe({
            next: () => {
                this.saving.set(false);
                this.success.set('Cập nhật thành công!');
                setTimeout(() => this.router.navigate(['/admin/questions']), 1500);
            },
            error: (err) => {
                this.saving.set(false);
                this.error.set(err.error?.message || 'Lỗi khi cập nhật');
            }
        });
    }
}
