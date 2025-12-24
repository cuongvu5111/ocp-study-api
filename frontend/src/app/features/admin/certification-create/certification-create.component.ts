import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CertificationService } from '../../../core/services/certification.service';

@Component({
  selector: 'app-certification-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './certification-create.component.html',
  styles: [`
    .create-cert-container {
      padding: 2rem;
      max-width: 1000px;
      margin: 0 auto;
    }
    
    .card {
      background: var(--gradient-card);
      border: 1px solid var(--color-border);
      border-radius: 12px;
      padding: 2rem;
    }

    .form-section {
      margin-bottom: 2rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid var(--color-border);
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: var(--color-text-secondary);
    }

    input, textarea, select {
      width: 100%;
      padding: 0.75rem;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--color-border);
      color: #e2e8f0; /* Clearly visible light text */
      
      &:focus {
        outline: none;
        border-color: var(--color-primary);
      }
    }

    select option {
        background-color: #1e293b; /* Dark background for dropdown options */
        color: #e2e8f0;
        padding: 10px;
    }

    .month-section {
      background: rgba(255, 255, 255, 0.03);
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
    }

    .topic-item {
      display: grid;
      grid-template-columns: 2fr 3fr 1fr auto;
      gap: 1rem;
      align-items: end;
      margin-bottom: 1rem;
      padding: 1rem;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 6px;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: all 0.2s;
    }

    .btn-primary {
      background: var(--gradient-primary);
      color: white;
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.1);
      color: var(--color-text-primary);
    }

    .btn-danger {
        background: rgba(239, 68, 68, 0.2);
        color: #fca5a5;
        padding: 0.5rem;
    }

    .header-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .icon-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
        gap: 0.5rem;
    }

    .icon-option {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid var(--color-border);
        cursor: pointer;
        transition: all 0.2s;
        
        &:hover {
            background: rgba(255, 255, 255, 0.1);
        }

        &.selected {
            background: var(--color-primary);
            border-color: var(--color-primary);
            color: white;
        }

        .material-icons-outlined {
            font-size: 20px;
        }
    }

    .icon-preview {
        width: 42px;
        height: 42px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid var(--color-border);
    }
  `]
})
export class CertificationCreateComponent {
  private fb = inject(FormBuilder);
  private certService = inject(CertificationService);
  private router = inject(Router);

  form: FormGroup;
  loading = signal(false);
  activeMonth = signal(1);

  readonly icons = [
    'school', 'menu_book', 'auto_stories', 'library_books', // Study
    'code', 'laptop', 'terminal', 'developer_mode', // Coding
    'cloud', 'dns', 'security', 'memory', 'storage', // Infra
    'quiz', 'question_mark', 'task_alt', 'grade', // Exam
    'rocket', 'stars', 'verified', 'language' // Misc
  ];

  constructor() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      description: [''],
      icon: ['school'],
      durationMonths: [3, Validators.required], // Default 3 months
      topics: this.fb.array([])
    });

    // Initialize initial active month topics container? 
    // Actually we will filter topics by month in the template or maintain a single array and filter.
    // Let's use a simpler approach: A FormArray of Topics, each having a 'month' field.
  }

  get topics() {
    return this.form.get('topics') as FormArray;
  }

  topicsByMonth(month: number) {
    // Helper to get controls for a specific month for view
    // Since FormArray is linear, we iterate.
    // However, Angular FormArray in template best works with direct iteration.
    // We will do a filter in the template or just show all and group visually?
    // Better: Helper method to add topic specifically for a month
    return [];
  }

  addTopic(month: number) {
    const topicGroup = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      icon: ['menu_book'],
      month: [month]
    });
    this.topics.push(topicGroup);
  }

  removeTopic(index: number) {
    this.topics.removeAt(index);
  }

  getTopicsForMonth(month: number) {
    const controls = this.topics.controls;
    const indices = [];
    for (let i = 0; i < controls.length; i++) {
      if (controls[i].get('month')?.value === month) {
        indices.push(i);
      }
    }
    return indices;
  }

  getTopicControl(index: number) {
    return this.topics.at(index) as FormGroup;
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.loading.set(true);
    const formData = this.form.value;

    this.certService.createCertification(formData).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/certifications']);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
        alert('Lỗi khi tạo chứng chỉ');
      }
    });
  }

  get monthsArray() {
    const duration = this.form.get('durationMonths')?.value || 0;
    return Array.from({ length: duration }, (_, i) => i + 1);
  }
}
