import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CertificationService } from '../../../core/services/certification.service';
import { Certification } from '../../../models/certification.model';

@Component({
  selector: 'app-certification-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="admin-container">
      <header class="page-header">
        <div class="header-left">
            <a routerLink="/dashboard" class="btn btn--ghost btn--icon">
                <span class="material-icons-outlined">arrow_back</span>
            </a>
            <h1>Quản lý Chứng chỉ</h1>
        </div>
        <a routerLink="/admin/certifications/create" class="btn btn--primary">
          <span class="material-icons-outlined">add</span>
          Tạo mới
        </a>
      </header>

      @if (loading()) {
        <div class="loading">Loading...</div>
      }

      <div class="cards-grid">
        @for (cert of certifications(); track cert.id) {
          <div class="cert-card">
            <div class="cert-icon">
                <span class="material-icons-outlined">{{ cert.icon }}</span>
            </div>
            <div class="cert-info">
              <h3>{{ cert.name }}</h3>
              <p>{{ cert.description }}</p>
              <div class="meta">
                <span>{{ cert.durationMonths }} tháng</span>
              </div>
            </div>
            <div class="actions">
              <a [routerLink]="['/admin/certifications/edit', cert.id]" class="btn btn--sm btn--ghost">
                <span class="material-icons-outlined">edit</span> Sửa
              </a>
              <button class="btn btn--sm btn--danger-ghost" (click)="deleteCert(cert.id)">
                <span class="material-icons-outlined">delete</span> Xóa
              </button>
            </div>
          </div>
        }
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
      max-width: 1000px;
      margin: 0 auto;
      padding: 2rem;
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

    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .cert-card {
      background: var(--gradient-card);
      border: 1px solid var(--color-border);
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .cert-icon {
        width: 48px;
        height: 48px;
        background: rgba(99, 102, 241, 0.1);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--color-primary);
        
        .material-icons-outlined { font-size: 24px; }
    }

    .cert-info {
      flex: 1;
      
      h3 { margin: 0 0 0.5rem 0; }
      p { 
        color: var(--color-text-secondary); 
        font-size: 0.9rem;
        margin-bottom: 1rem;
      }
      
      .meta {
        display: flex;
        gap: 1rem;
        font-size: 0.85rem;
        color: var(--color-text-muted);
        
        span {
            background: rgba(255,255,255,0.05);
            padding: 2px 8px;
            border-radius: 4px;
        }
      }
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
      margin-top: auto;
      padding-top: 1rem;
      border-top: 1px solid var(--color-border);
    }
    
    .btn--danger-ghost {
        background: transparent;
        color: var(--color-error);
        border: none;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 0.5rem;
        border-radius: 6px;
        
        &:hover {
            background: rgba(239, 68, 68, 0.1);
        }
    }
    
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
export class CertificationListComponent implements OnInit {
  certService = inject(CertificationService);
  certifications = signal<Certification[]>([]);
  loading = signal(true);

  // Pagination
  currentPage = signal(0);
  pageSize = signal(10);
  totalElements = signal(0);

  get totalPages(): number {
    return Math.ceil(this.totalElements() / this.pageSize());
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading.set(true);
    // Need to update CertificationService to accept page args if passed from here.
    // Assuming CertificationService was updated to return Page by default or accept args?
    // Let's check Service signature. It was: getAllCertifications(pageable).
    // In Angular Service it is: getAllCertifications(): Observable<Certification[]>
    // I need to update CertificationService in Angular to accept page/size.

    // Wait, I updated ApiService but NOT CertificationService in Angular!
    // I need to update CertificationService.ts first.
    // I'll do a quick recursive call to update Service then come back here.
    // Instead of aborting, I will update Service signature in this same thought block if possible? No.
    // I will update CertificationService.ts first in next tool call.
    // Then update logic here.

    // Actually I can update the service in previous steps? No I viewed it but didn't update it to accept params.
    // I'll update component assuming service will be fixed, or fix service now?
    // I'll fix service NOW.

    // But I'm in ReplaceFileContent for Component.
    // I will write the component code assuming the service has `getAllCertifications(page, size)`.

    // But I can't leave broken code.
    // I'll update logic to call with page params, and I will strictly ensure I update the service immediately after.

    this.certService.getAllCertifications(this.currentPage(), this.pageSize()).subscribe({
      next: (data: any) => {
        // data is Page<Certification>
        this.certifications.set(data.content);
        this.totalElements.set(data.totalElements);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
    this.loadData();
  }

  deleteCert(id: number) {
    if (confirm('Bạn có chắc muốn xóa chứng chỉ này? Tất cả Topics, Questions, Flashcards liên quan sẽ bị xóa!')) {
      this.certService.deleteCertification(id).subscribe({
        next: () => this.loadData(),
        error: (err) => alert('Lỗi khi xóa chứng chỉ')
      });
    }
  }
}
