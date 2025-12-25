import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { CertificationService } from '../../../core/services/certification.service';

@Component({
  selector: 'app-flashcard-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './flashcard-create.component.html',
  styles: [`
    .admin-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }

    .page-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;

      h1 { margin: 0; }
    }

    .flashcard-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      label {
        font-weight: 500;
        color: var(--color-text-secondary);
      }

      input, textarea, select {
        padding: 0.75rem 1rem;
        background: var(--color-bg-secondary);
        border: 1px solid var(--color-border);
        border-radius: 8px;
        color: #e2e8f0;
        
        &:focus {
          outline: none;
          border-color: var(--color-primary);
        }
      }
      
      select option {
        background-color: #1e293b;
        color: #e2e8f0;
      }
    }

    .code-input {
      font-family: monospace;
      font-size: 0.9em;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 1rem;
    }

    .btn {
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        border: none;
        transition: all 0.2s;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }

    .btn--primary {
        background: var(--gradient-primary);
        color: white;
    }

    .btn--ghost {
        background: rgba(255, 255, 255, 0.1);
        color: var(--color-text-primary);
    }

    .btn--icon {
        padding: 0.5rem;
        border-radius: 50%;
        width: 40px;
        height: 40px;
    }

    .error-message {
      padding: 0.75rem;
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid var(--color-error);
      border-radius: 8px;
      color: var(--color-error);
    }

    .success-message {
      padding: 0.75rem;
      background: rgba(34, 197, 94, 0.1);
      border: 1px solid var(--color-success);
      border-radius: 8px;
      color: var(--color-success);
    }
  `]
})
export class FlashcardCreateComponent implements OnInit {
  private apiService = inject(ApiService);
  private certService = inject(CertificationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute); // Add ActivatedRoute

  certifications = signal<any[]>([]);
  topics = signal<any[]>([]);

  selectedCertId: number | null = null;
  topicId: number | null = null;
  flashcardId: number | null = null; // Track current flashcard ID
  isEditMode = signal(false);

  front = '';
  back = '';
  codeExample = '';

  loading = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);

  ngOnInit() {
    this.loadCertifications();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.flashcardId = Number(id);
      this.loadFlashcard(this.flashcardId);
    }
  }

  loadCertifications() {
    this.certService.getAllCertifications(0, 100).subscribe({
      next: (data: any) => {
        this.certifications.set(data.content || data);
      },
      error: (err) => console.error('Error loading certifications:', err)
    });
  }

  loadFlashcard(id: number) {
    this.loading.set(true);
    this.apiService.getFlashcardById(id).subscribe({
      next: (data: any) => {
        this.front = data.front;
        this.back = data.back;
        this.codeExample = data.codeExample;
        this.selectedCertId = null; // We might not know cert ID directly from flashcard response easily without extra calls or DTO change
        // But usually flashcard -> topic -> cert.
        // If DTO contains topicId, we can load topics.
        if (data.topicId) {
          this.topicId = data.topicId;
          // We need to find the cert for this topic to set selectedCertId correctly?
          // Or just load the topic to get its certId?
          this.apiService.getTopicById(data.topicId).subscribe(topic => {
            this.selectedCertId = topic.certificationId;
            this.loadTopics(this.selectedCertId!);
            this.topicId = topic.id; // Ensure consistent type
          });
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.error.set('Không thể tải flashcard');
        this.loading.set(false);
      }
    });
  }

  onCertChange() {
    this.topicId = null;
    this.topics.set([]);
    if (this.selectedCertId) {
      this.loadTopics(this.selectedCertId);
    }
  }

  loadTopics(certId: number) {
    this.apiService.getTopics(certId).subscribe({
      next: (data) => this.topics.set(data),
      error: (err) => console.error('Error loading topics:', err)
    });
  }

  onSubmit() {
    if (!this.topicId || !this.front || !this.back) {
      this.error.set('Vui lòng điền đầy đủ các trường bắt buộc (*)');
      return;
    }

    const payload = {
      topicId: Number(this.topicId),
      front: this.front,
      back: this.back,
      codeExample: this.codeExample || null
    };

    this.loading.set(true);
    this.error.set(null);
    this.success.set(null);

    if (this.isEditMode()) {
      this.apiService.updateFlashcard(this.flashcardId!, payload).subscribe({
        next: () => {
          this.loading.set(false);
          this.success.set('Cập nhật Flashcard thành công!');
          this.router.navigate(['/admin/flashcards']);
        },
        error: (err) => {
          this.loading.set(false);
          this.error.set(err.error?.message || 'Lỗi khi cập nhật Flashcard');
        }
      });
    } else {
      this.apiService.createFlashcard(payload).subscribe({
        next: () => {
          this.loading.set(false);
          this.success.set('Tạo Flashcard thành công!');
          this.resetForm();
        },
        error: (err) => {
          this.loading.set(false);
          this.error.set(err.error?.message || 'Lỗi khi tạo Flashcard');
        }
      });
    }
  }

  resetForm() {
    this.front = '';
    this.back = '';
    this.codeExample = '';
    // Keep Cert and Topic selected for faster entry
  }
}
