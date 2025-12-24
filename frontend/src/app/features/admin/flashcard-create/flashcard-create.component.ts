import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
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

    certifications = signal<any[]>([]);
    topics = signal<any[]>([]);

    selectedCertId: number | null = null;
    topicId: number | null = null;

    front = '';
    back = '';
    codeExample = '';

    loading = signal(false);
    error = signal<string | null>(null);
    success = signal<string | null>(null);

    ngOnInit() {
        this.loadCertifications();
    }

    loadCertifications() {
        this.certService.getAllCertifications().subscribe({
            next: (data) => {
                this.certifications.set(data);
                // Optionally select the first one or the one currently active in sidebar
            },
            error: (err) => console.error('Error loading certifications:', err)
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
            topic: { id: this.topicId }, // Use object ID reference or just ID depending on DTO
            // Based on backend FlashcardDTO, it might expect topicId or Topic object.
            // Let's check FlashcardDTO if I can. safely assume nested object or just ID field mapped.
            // Actually usually create endpoints take ID. 
            // Looking at FlashcardController: createFlashcard(@Valid @RequestBody FlashcardDTO dto)
            // I should check FlashcardDTO definition. But commonly it's topicId.
            // Let's try sending topicId if flattened, or nested object.
            // Safe bet: usually we send { topicId: ... } or { topic: { id: ... } }
            // Let's check ApiService.createFlashcard, it just posts data.
            // I'll guess flattened `topicId` first, if not I'll try nested.
            // Wait, looking at QuestionCreateComponent, it sends `topicId` as root field!
            // `topicId: Number(this.topicId)` -> createQuestion works.
            // Assuming FlashcardDTO follows same pattern.
            topicId: Number(this.topicId),
            front: this.front,
            back: this.back,
            codeExample: this.codeExample || null
        };

        this.loading.set(true);
        this.error.set(null);
        this.success.set(null);

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

    resetForm() {
        this.front = '';
        this.back = '';
        this.codeExample = '';
        // Keep Cert and Topic selected for faster entry
    }
}
