import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { CertificationService } from '../../../core/services/certification.service';

@Component({
    selector: 'app-flashcard-list-admin',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    template: `
    <div class="admin-container">
      <header class="page-header">
        <div class="header-left">
            <a routerLink="/dashboard" class="btn btn--ghost btn--icon">
                <span class="material-icons-outlined">arrow_back</span>
            </a>
            <h1>Quản lý Flashcards</h1>
        </div>
        <a routerLink="/admin/flashcards/create" class="btn btn--primary">
          <span class="material-icons-outlined">add</span>
          Tạo Flashcard
        </a>
      </header>

      <!-- Filter Bar -->
      <div class="filter-bar">
        <div class="filter-group">
            <select [(ngModel)]="selectedCertId" (change)="onCertChange()" class="form-select">
                <option [ngValue]="null">-- Tất cả Chứng chỉ --</option>
                @for (cert of certifications(); track cert.id) {
                    <option [value]="cert.id">{{ cert.name }}</option>
                }
            </select>

            <select [(ngModel)]="selectedTopicId" (change)="loadFlashcards()" class="form-select" [disabled]="!selectedCertId">
                <option [ngValue]="null">-- Tất cả Topics --</option>
                @for (topic of topics(); track topic.id) {
                    <option [value]="topic.id">{{ topic.name }}</option>
                }
            </select>
        </div>
      </div>

      @if (loading()) {
        <div class="loading">Loading...</div>
      }

      <div class="table-container">
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Front (Câu hỏi)</th>
                    <th>Back (Đáp án)</th>
                    <th>Topic</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                @for (card of flashcards(); track card.id) {
                    <tr>
                        <td>{{ card.id }}</td>
                        <td class="col-content">
                            <div class="content-text">{{ card.front }}</div>
                        </td>
                        <td class="col-content">
                            <div class="content-text">{{ card.back }}</div>
                        </td>
                        <td>
                            <div class="topic-badge">{{ card.topicName }}</div>
                        </td>
                        <td class="actions">
                            <button class="btn btn--sm btn--ghost" [routerLink]="['/admin/flashcards/edit', card.id]">
                                <span class="material-icons-outlined">edit</span>
                            </button>
                            <button class="btn btn--sm btn--ghost" (click)="deleteFlashcard(card.id)">
                                <span class="material-icons-outlined">delete</span>
                            </button>
                        </td>
                    </tr>
                }
                @empty {
                    <tr><td colspan="5" class="text-center">Chưa có flashcard nào. Chọn Cert/Topic để xem.</td></tr>
                }
            </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      @if (totalPages > 1) {
        <div class="pagination">
            <button class="btn btn--secondary" [disabled]="currentPage() === 0" (click)="onPageChange(currentPage() - 1)">Previous</button>
            <span>Page {{ currentPage() + 1 }} of {{ totalPages }}</span>
            <button class="btn btn--secondary" [disabled]="currentPage() >= totalPages - 1" (click)="onPageChange(currentPage() + 1)">Next</button>
        </div>
      }
    </div>
  `,
    styles: [`
    .admin-container {
        padding: 2rem;
        max-width: 1200px;
        margin: 0 auto;
    }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      
      .header-left {
          display: flex;
          align-items: center;
          gap: 1rem;
      }
      h1 { margin: 0; }
    }
    
    .filter-bar {
        margin-bottom: 1.5rem;
        
        .filter-group {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
        }

        .form-select {
            padding: 0.5rem 1rem;
            border-radius: 8px;
            background: var(--color-bg-secondary);
            color: var(--color-text-primary);
            border: 1px solid var(--color-border);
            min-width: 200px;
        }
    }
    
    .table-container {
        border: 1px solid var(--color-border);
        border-radius: 12px;
        overflow: hidden;
        background: var(--color-bg-secondary);
    }
    
    table {
        width: 100%;
        border-collapse: collapse;
        
        th, td {
            padding: 1rem;
            text-align: left;
            border-bottom: 1px solid var(--color-border);
        }
        
        th { background: #1e293b; }
    }

    .col-content {
        max-width: 300px;
    }

    .content-text {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
    }
    
    .actions {
        display: flex;
        gap: 0.5rem;
    }

    .topic-badge {
        display: inline-block;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        background: rgba(255, 255, 255, 0.1);
        font-size: 0.85rem;
    }
    
    .text-center { text-align: center; }
    
    .pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1rem;
        margin-top: 2rem;
        
        span { font-weight: 500; }
    }
  `]
})
export class FlashcardListComponent implements OnInit {
    private apiService = inject(ApiService);
    private certService = inject(CertificationService);

    certifications = signal<any[]>([]);
    topics = signal<any[]>([]);
    flashcards = signal<any[]>([]);

    loading = signal(false);

    selectedCertId: number | null = null;
    selectedTopicId: number | null = null;

    // Pagination
    currentPage = signal(0);
    pageSize = signal(10);
    totalElements = signal(0);

    get totalPages(): number {
        return Math.ceil(this.totalElements() / this.pageSize());
    }

    ngOnInit() {
        this.loadCertifications();
        this.loadFlashcards();
    }

    loadCertifications() {
        this.certService.getAllCertifications(0, 100).subscribe((data: any) => {
            this.certifications.set(data.content || data);
        });
    }

    onCertChange() {
        this.selectedTopicId = null;
        this.topics.set([]);
        this.currentPage.set(0);

        if (this.selectedCertId) {
            this.apiService.getTopics(this.selectedCertId).subscribe((data: any) => {
                // ApiService.getTopics now returns Page or Array depending on update.
                // Wait, I updated getTopics to Page!
                // I need to check getTopics usage in catch-all.
                // getTopics(certId) -> returns Page or Array?
                // In ApiService: return this.http.get<any>(url, { params });
                // If I didn't update backend to return Page for filtered topics, it returns List?
                // In TopicController, with certId it CALLS topicService.getAllTopics(userId, certId, pageable).
                // Which returns Page<TopicDTO>.
                // So data is Page.
                // I need to handle data.content.
                this.topics.set(data.content || data);
            });
        }

        this.loadFlashcards();
    }

    loadFlashcards() {
        this.loading.set(true);
        if (this.selectedTopicId) {
            // Filter by topic
            this.apiService.getFlashcardsByTopic(this.selectedTopicId, this.currentPage(), this.pageSize()).subscribe({
                next: (data) => {
                    this.flashcards.set(data.content);
                    this.totalElements.set(data.totalElements);
                    this.loading.set(false);
                },
                error: () => this.loading.set(false)
            });
        } else {
            // Load all
            this.apiService.getFlashcards(this.currentPage(), this.pageSize()).subscribe({
                next: (data) => {
                    this.flashcards.set(data.content);
                    this.totalElements.set(data.totalElements);
                    this.loading.set(false);
                },
                error: () => this.loading.set(false)
            });
        }
    }

    onPageChange(page: number) {
        this.currentPage.set(page);
        this.loadFlashcards();
    }

    deleteFlashcard(id: number) {
        if (confirm('Bạn có chắc chắn muốn xóa flashcard này?')) {
            this.apiService.deleteFlashcard(id).subscribe(() => this.loadFlashcards());
        }
    }
}
