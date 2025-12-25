import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { CertificationService } from '../../../core/services/certification.service';

@Component({
    selector: 'app-admin-topic-list',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    template: `
    <div class="admin-container">
      <header class="page-header">
        <div class="header-left">
            <a routerLink="/dashboard" class="btn btn--ghost btn--icon">
                <span class="material-icons-outlined">arrow_back</span>
            </a>
            <h1>Quản lý Topics</h1>
        </div>
        <a routerLink="/admin/topics/create" class="btn btn--primary">
          <span class="material-icons-outlined">add</span>
          Tạo Topic
        </a>
      </header>

      <!-- Filter by Cert -->
      <div class="filter-bar">
        <select [(ngModel)]="selectedCertId" (change)="onFilterChange()" class="form-select">
            <option [ngValue]="null">-- Tất cả Chứng chỉ --</option>
            @for (cert of certifications(); track cert.id) {
                <option [value]="cert.id">{{ cert.name }}</option>
            }
        </select>
      </div>

      @if (loading()) {
        <div class="loading">Loading...</div>
      }

      <div class="table-container">
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Tên Topic</th>
                    <th>Tháng học</th>
                    <th>Chứng chỉ</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                @for (topic of topics(); track topic.id) {
                    <tr>
                        <td>{{ topic.id }}</td>
                        <td>
                            <div class="fw-bold">{{ topic.name }}</div>
                            <small class="text-muted">{{ topic.description }}</small>
                        </td>
                        <td>Tháng {{ topic.month }}</td>
                        <td>{{ getCertName(topic.certificationId) }}</td>
                        <td class="actions">
                            <button class="btn btn--sm btn--ghost" (click)="deleteTopic(topic.id)">
                                <span class="material-icons-outlined">delete</span>
                            </button>
                        </td>
                    </tr>
                }
                @empty {
                    <tr><td colspan="5" class="text-center">Chưa có topic nào.</td></tr>
                }
            </tbody>
        </table>
      </div>

      <!-- Pagination Controls -->
       @if (totalPages() > 1) {
        <div class="pagination">
            <button class="btn btn--secondary" [disabled]="currentPage() === 0" (click)="onPageChange(currentPage() - 1)">
                Previous
            </button>
            <span>Page {{ currentPage() + 1 }} of {{ totalPages() }}</span>
            <button class="btn btn--secondary" [disabled]="currentPage() >= totalPages() - 1" (click)="onPageChange(currentPage() + 1)">
                Next
            </button>
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
        
        .form-select {
            padding: 0.5rem 1rem;
            border-radius: 8px;
            background: var(--color-bg-secondary);
            color: var(--color-text-primary);
            border: 1px solid var(--color-border);
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
    
    .actions {
        display: flex;
        gap: 0.5rem;
    }
    
    .text-center { text-align: center; }
    .text-muted { color: var(--color-text-secondary); }
    .fw-bold { font-weight: 600; }
    
    .pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1rem;
        margin-top: 2rem;
        
        span {
            font-weight: 500;
        }
    }
  `]
})
export class TopicListComponent implements OnInit {
    apiService = inject(ApiService);
    certService = inject(CertificationService);

    topics = signal<any[]>([]);
    certifications = signal<any[]>([]);
    loading = signal(false);

    // Pagination state
    currentPage = signal(0);
    pageSize = signal(10);
    totalElements = signal(0);
    totalPages = signal(0);

    selectedCertId: number | null = null;

    ngOnInit() {
        this.loadCertifications();
        this.loadTopics();
    }

    loadCertifications() {
        this.certService.getAllCertifications(0, 100).subscribe((data: any) => {
            this.certifications.set(data.content || data);
        });
    }

    loadTopics() {
        this.loading.set(true);
        this.apiService.getTopics(this.selectedCertId || undefined, this.currentPage(), this.pageSize()).subscribe({
            next: (data) => {
                this.topics.set(data.content);
                this.totalElements.set(data.totalElements);
                this.totalPages.set(data.totalPages);
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }

    onPageChange(page: number) {
        if (page >= 0 && page < this.totalPages()) {
            this.currentPage.set(page);
            this.loadTopics();
        }
    }

    onFilterChange() {
        this.currentPage.set(0); // Reset to first page on filter change
        this.loadTopics();
    }

    getCertName(id: number) {
        const cert = this.certifications().find(c => c.id === id);
        return cert ? cert.name : 'Unknown';
    }

    deleteTopic(id: number) {
        if (confirm('Xóa topic này sẽ xóa hết câu hỏi và flashcard bên trong?')) {
            this.apiService.deleteTopic(id).subscribe(() => this.loadTopics());
        }
    }
}
