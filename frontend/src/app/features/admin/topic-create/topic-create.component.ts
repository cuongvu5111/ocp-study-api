import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { CertificationService } from '../../../core/services/certification.service';

@Component({
  selector: 'app-topic-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="admin-container">
      <header class="page-header">
        <h1>Tạo Topic Mới</h1>
      </header>

      <form [formGroup]="topicForm" (ngSubmit)="onSubmit()" class="form-container">
        
        <!-- Certification Selection -->
        <div class="form-group">
            <label class="form-label">Thuộc Chứng chỉ <span class="text-danger">*</span></label>
            <select formControlName="certificationId" class="form-control">
                <option [ngValue]="null">-- Chọn Chứng chỉ --</option>
                @for (cert of certifications(); track cert.id) {
                    <option [value]="cert.id">{{ cert.name }}</option>
                }
            </select>
            @if (topicForm.get('certificationId')?.invalid && topicForm.get('certificationId')?.touched) {
                <div class="error-msg">Vui lòng chọn chứng chỉ.</div>
            }
        </div>

        <div class="form-group">
          <label class="form-label">Tên Topic <span class="text-danger">*</span></label>
          <input type="text" formControlName="name" class="form-control" placeholder="Nhập tên topic">
          @if (topicForm.get('name')?.invalid && topicForm.get('name')?.touched) {
            <div class="error-msg">Tên topic là bắt buộc.</div>
          }
        </div>

        <div class="form-group">
          <label class="form-label">Mô tả</label>
          <textarea formControlName="description" class="form-control" rows="3" placeholder="Mô tả ngắn gọn"></textarea>
        </div>

        <div class="row">
            <div class="col">
                <div class="form-group">
                    <label class="form-label">Icon (Material Icon)</label>
                    <input type="text" formControlName="icon" class="form-control" placeholder="e.g. code">
                </div>
            </div>
            <div class="col">
                <div class="form-group">
                    <label class="form-label">Tháng học</label>
                    <input type="number" formControlName="month" class="form-control" min="1" max="6">
                </div>
            </div>
        </div>
        
        <!-- Subtopics Section -->
        <div class="subtopics-section">
            <div class="section-header">
                <h3>Subtopics</h3>
                <button type="button" class="btn btn--secondary btn--sm" (click)="addSubtopic()">
                    <span class="material-icons-outlined">add</span>
                    Thêm Subtopic
                </button>
            </div>
            
            <div formArrayName="subtopics" class="subtopics-list">
                @for (subtopic of subtopics.controls; track $index) {
                    <div [formGroupName]="$index" class="subtopic-card">
                        <div class="card-header">
                            <span class="card-title">Subtopic {{ $index + 1 }}</span>
                            <button type="button" class="btn btn--ghost btn--sm" (click)="removeSubtopic($index)">
                                <span class="material-icons-outlined">delete</span>
                            </button>
                        </div>
                        
                        <div class="card-body">
                            <div class="form-group">
                                <label class="form-label">Tên subtopic <span class="text-danger">*</span></label>
                                <input type="text" formControlName="name" class="form-control" placeholder="Nhập tên subtopic">
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">Mô tả</label>
                                <textarea formControlName="description" class="form-control" rows="2"></textarea>
                            </div>
                            
                            <div class="row">
                                <div class="col">
                                    <div class="form-group">
                                        <label class="form-label">Độ khó (1-5)</label>
                                        <input type="number" formControlName="difficulty" class="form-control" min="1" max="5">
                                    </div>
                                </div>
                                <div class="col">
                                    <div class="form-group">
                                        <label class="form-label">Số ngày học</label>
                                        <input type="number" formControlName="estimatedDays" class="form-control" min="1">
                                    </div>
                                </div>
                                <div class="col">
                                    <div class="form-group">
                                        <label class="form-label">Ưu tiên</label>
                                        <select formControlName="priority" class="form-control">
                                            <option value="LOW">Thấp</option>
                                            <option value="MEDIUM">Trung bình</option>
                                            <option value="HIGH">Cao</option>
                                            <option value="CRITICAL">Rất cao</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                @empty {
                    <div class="empty-subtopics">
                        <p>Chưa có subtopic nào. Click "Thêm Subtopic" để thêm mới.</p>
                    </div>
                }
            </div>
        </div>
        
        
        <div class="form-actions">
          <a routerLink="/admin/topics" class="btn btn--ghost">Hủy</a>
          <button type="submit" class="btn btn--primary" [disabled]="topicForm.invalid || submitting()">
            {{ submitting() ? 'Đang tạo...' : 'Tạo Topic' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .admin-container {
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }
    .page-header {
      margin-bottom: 2rem;
      h1 { margin: 0; }
    }
    .form-container {
        background: var(--color-bg-secondary);
        padding: 2rem;
        border-radius: 12px;
        border: 1px solid var(--color-border);
    }
    .form-group {
      margin-bottom: 1.5rem;
    }
    .form-label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: var(--color-text-primary);
    }
    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid var(--color-border);
      border-radius: 8px;
      background: var(--color-bg-primary);
      color: var(--color-text-primary);
      
      &:focus {
        outline: none;
        border-color: var(--color-primary);
      }
    }
    .row {
        display: flex;
        gap: 1rem;
        .col { flex: 1; }
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 2rem;
    }
    .text-danger { color: #ef4444; }
    .error-msg {
      color: #ef4444;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
    
    .subtopics-section {
        margin-top: 2rem;
        padding-top: 2rem;
        border-top: 1px solid var(--color-border);
    }
    
    .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        
        h3 { margin: 0; font-size: 1.25rem; }
    }
    
    .subtopics-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    
    .subtopic-card {
        background: var(--color-bg-primary);
        border: 1px solid var(--color-border);
        border-radius: 8px;
        overflow: hidden;
    }
    
    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background: rgba(99, 102, 241, 0.05);
        border-bottom: 1px solid var(--color-border);
    }
    
    .card-title {
        font-weight: 600;
        color: var(--color-primary);
    }
    
    .card-body {
        padding: 1rem;
    }
    
    .empty-subtopics {
        text-align: center;
        padding: 2rem;
        color: var(--color-text-secondary);
        background: var(--color-bg-primary);
        border: 1px dashed var(--color-border);
        border-radius: 8px;
    }
    
    .btn--sm {
        padding: 0.5rem 0.75rem;
        font-size: 0.875rem;
    }
  `]
})
export class TopicCreateComponent {
  fb = inject(FormBuilder);
  router = inject(Router);
  apiService = inject(ApiService);
  certService = inject(CertificationService);

  certifications = signal<any[]>([]);
  submitting = signal(false);

  topicForm = this.fb.group({
    certificationId: [null, Validators.required],
    name: ['', Validators.required],
    description: [''],
    icon: ['topic'],
    month: [1, [Validators.required, Validators.min(1), Validators.max(12)]],
    subtopics: this.fb.array([])
  });

  get subtopics(): FormArray {
    return this.topicForm.get('subtopics') as FormArray;
  }

  addSubtopic() {
    const subtopicGroup = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      difficulty: [1, [Validators.required, Validators.min(1), Validators.max(5)]],
      estimatedDays: [1, [Validators.required, Validators.min(1)]],
      priority: ['MEDIUM', Validators.required],
      orderIndex: [this.subtopics.length]
    });
    this.subtopics.push(subtopicGroup);
  }

  removeSubtopic(index: number) {
    this.subtopics.removeAt(index);
    // Update order indices
    this.subtopics.controls.forEach((control, i) => {
      control.get('orderIndex')?.setValue(i);
    });
  }

  constructor() {
    this.loadCertifications();
  }

  loadCertifications() {
    // Request all certifications in a single page for dropdown
    this.certService.getAllCertifications(0, 100).subscribe((data: any) => {
      // Handle paginated response
      this.certifications.set(data.content || data);
    });
  }

  onSubmit() {
    if (this.topicForm.valid) {
      this.submitting.set(true);
      const val = this.topicForm.value;

      // Construct CreateTopicRequest payload
      // Ideally backend accepts CreateTopicRequest. 
      // But typically creating a topic standalone might need a specific endpoint or just "updateCert"
      // Wait, ApiService.createTopic(data) calls POST /topics.
      // Let's check TopicController POST /topics.
      // TopicController currently has GET only?

      // Let's check TopicController again.
      this.apiService.createTopic(val).subscribe({
        next: () => {
          alert('Tạo topic thành công!');
          this.router.navigate(['/admin/topics']);
        },
        error: (err) => {
          console.error(err);
          alert('Có lỗi xảy ra.');
          this.submitting.set(false);
        }
      });
    }
  }
}
