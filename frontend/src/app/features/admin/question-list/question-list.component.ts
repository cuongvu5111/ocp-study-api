import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';

/**
 * Admin component - Danh sách câu hỏi với edit/delete.
 */
@Component({
    selector: 'app-question-list',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="admin-container">
      <header class="page-header">
        <div class="header-left">
          <a routerLink="/dashboard" class="btn btn--ghost btn--icon">
            <span class="material-icons-outlined">arrow_back</span>
          </a>
          <h1>Quản lý câu hỏi</h1>
        </div>
        <div class="header-actions">
          <a routerLink="/admin/questions/create" class="btn btn--primary">
            <span class="material-icons-outlined">add</span>
            Tạo mới
          </a>
          <a routerLink="/admin/questions/import" class="btn btn--secondary">
            <span class="material-icons-outlined">upload_file</span>
            Import CSV
          </a>
        </div>
      </header>

      <!-- Stats -->
      <div class="stats-row">
        <div class="stat-card">
          <span class="stat-value">{{ questions().length }}</span>
          <span class="stat-label">Tổng câu hỏi</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ getTopicCount() }}</span>
          <span class="stat-label">Topics</span>
        </div>
      </div>

      <!-- Loading -->
      @if (loading()) {
      <div class="loading-state">
        <div class="spinner"></div>
        <p>Đang tải...</p>
      </div>
      } @else if (questions().length === 0) {
      <div class="empty-state">
        <span class="material-icons-outlined">quiz</span>
        <p>Chưa có câu hỏi nào</p>
        <a routerLink="/admin/questions/create" class="btn btn--primary">
          Tạo câu hỏi đầu tiên
        </a>
      </div>
      } @else {
      <!-- Question Table -->
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Câu hỏi</th>
              <th>Topic</th>
              <th>Độ khó</th>
              <th>Loại</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (q of questions(); track q.id) {
            <tr>
              <td>{{ q.id }}</td>
              <td class="question-content">{{ q.content | slice:0:60 }}...</td>
              <td>
                <span class="topic-badge">{{ q.topicName }}</span>
              </td>
              <td>
                @for (star of [1,2,3]; track star) {
                <span class="star" [class.filled]="star <= q.difficulty">★</span>
                }
              </td>
              <td>
                <span class="type-badge" [class.multiple]="q.questionType === 'MULTIPLE_CHOICE'">
                  {{ q.questionType === 'SINGLE_CHOICE' ? 'Single' : 'Multi' }}
                </span>
              </td>
              <td class="actions">
                <button class="btn btn--ghost btn--sm" title="Sửa" disabled>
                  <span class="material-icons-outlined">edit</span>
                </button>
                <button class="btn btn--ghost btn--sm btn--danger" title="Xóa" (click)="deleteQuestion(q.id)">
                  <span class="material-icons-outlined">delete</span>
                </button>
              </td>
            </tr>
            }
          </tbody>
        </table>
      </div>
      }

      @if (message()) {
      <div class="toast" [class.success]="!isError()" [class.error]="isError()">
        {{ message() }}
      </div>
      }
    </div>
  `,
    styles: [`
    .admin-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: var(--spacing-6);
    }

    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--spacing-6);

      .header-left {
        display: flex;
        align-items: center;
        gap: var(--spacing-4);
      }

      h1 { margin: 0; }

      .header-actions {
        display: flex;
        gap: var(--spacing-3);
      }
    }

    .stats-row {
      display: flex;
      gap: var(--spacing-4);
      margin-bottom: var(--spacing-6);
    }

    .stat-card {
      background: var(--gradient-card);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-xl);
      padding: var(--spacing-4) var(--spacing-6);
      display: flex;
      flex-direction: column;

      .stat-value {
        font-size: var(--font-size-2xl);
        font-weight: 700;
        color: var(--color-primary);
      }

      .stat-label {
        font-size: var(--font-size-sm);
        color: var(--color-text-muted);
      }
    }

    .loading-state, .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--spacing-12);
      color: var(--color-text-muted);

      .material-icons-outlined {
        font-size: 48px;
        margin-bottom: var(--spacing-4);
      }
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

    .table-container {
      background: var(--gradient-card);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-xl);
      overflow: hidden;
    }

    table {
      width: 100%;
      border-collapse: collapse;

      th, td {
        padding: var(--spacing-4);
        text-align: left;
        border-bottom: 1px solid var(--color-border);
      }

      th {
        background: var(--color-bg-tertiary);
        font-weight: 600;
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);
      }

      tbody tr:hover {
        background: var(--color-bg-card-hover);
      }
    }

    .question-content {
      max-width: 300px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .topic-badge {
      display: inline-block;
      padding: var(--spacing-1) var(--spacing-2);
      background: rgba(99, 102, 241, 0.1);
      color: var(--color-primary);
      border-radius: var(--radius-md);
      font-size: var(--font-size-xs);
      font-weight: 500;
    }

    .star {
      color: var(--color-text-muted);
      &.filled { color: var(--color-accent); }
    }

    .type-badge {
      display: inline-block;
      padding: var(--spacing-1) var(--spacing-2);
      background: rgba(34, 197, 94, 0.1);
      color: var(--color-success);
      border-radius: var(--radius-md);
      font-size: var(--font-size-xs);
      font-weight: 500;

      &.multiple {
        background: rgba(245, 158, 11, 0.1);
        color: var(--color-accent);
      }
    }

    .actions {
      display: flex;
      gap: var(--spacing-2);
    }

    .btn--sm {
      padding: var(--spacing-2);
    }

    .btn--danger:hover {
      color: var(--color-error);
    }

    .toast {
      position: fixed;
      bottom: var(--spacing-6);
      right: var(--spacing-6);
      padding: var(--spacing-4) var(--spacing-6);
      border-radius: var(--radius-lg);
      font-weight: 500;
      animation: slideIn 0.3s ease;

      &.success {
        background: var(--color-success);
        color: white;
      }

      &.error {
        background: var(--color-error);
        color: white;
      }
    }

    @keyframes slideIn {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `]
})
export class QuestionListComponent implements OnInit {
    private apiService = inject(ApiService);

    questions = signal<any[]>([]);
    loading = signal(true);
    message = signal<string | null>(null);
    isError = signal(false);

    ngOnInit() {
        this.loadQuestions();
    }

    loadQuestions() {
        this.loading.set(true);
        this.apiService.getQuestions().subscribe({
            next: (data) => {
                this.questions.set(data);
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Error loading questions:', err);
                this.loading.set(false);
                this.showMessage('Lỗi tải danh sách câu hỏi', true);
            }
        });
    }

    getTopicCount(): number {
        const topicIds = new Set(this.questions().map(q => q.topicId));
        return topicIds.size;
    }

    deleteQuestion(id: number) {
        if (!confirm('Bạn có chắc muốn xóa câu hỏi này?')) return;

        this.apiService.deleteQuestion(id).subscribe({
            next: () => {
                this.questions.update(qs => qs.filter(q => q.id !== id));
                this.showMessage('Xóa câu hỏi thành công', false);
            },
            error: (err) => {
                console.error('Error deleting question:', err);
                this.showMessage('Lỗi xóa câu hỏi', true);
            }
        });
    }

    showMessage(msg: string, error: boolean) {
        this.message.set(msg);
        this.isError.set(error);
        setTimeout(() => this.message.set(null), 3000);
    }
}
