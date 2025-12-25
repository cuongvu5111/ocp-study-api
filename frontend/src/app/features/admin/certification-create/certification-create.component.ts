import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
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
      color: #e2e8f0;
      
      &:focus {
        outline: none;
        border-color: var(--color-primary);
      }
    }

    select option {
      background-color: #1e293b;
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
export class CertificationCreateComponent implements OnInit {
  private fb = inject(FormBuilder);
  private certService = inject(CertificationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Steps
  currentStep = signal(1);
  loading = signal(false);

  // Edit mode
  isEditMode = signal(false);
  certId = signal<string | null>(null);

  // Constants
  readonly icons = [
    'school', 'code', 'terminal', 'bug_report', 'cast_for_education',
    'verified', 'military_tech', 'psychology', 'auto_stories', 'history_edu',
    'menu_book', 'library_books', 'build', 'developer_mode', 'dns'
  ];

  readonly months = [1, 2, 3, 4, 5, 6];

  activeMonth = signal(1);

  form = this.fb.group({
    name: ['', Validators.required],
    code: ['', Validators.required],
    description: ['', Validators.required],
    icon: ['school', Validators.required],
    durationMonths: [6, [Validators.required, Validators.min(1), Validators.max(12)]],
    level: ['Intermediate', Validators.required],
    startDate: [''],
    endDate: [{ value: '', disabled: true }],
    topics: this.fb.array([])
  });

  get topicsAry() {
    return this.form.get('topics') as FormArray;
  }

  get topics() {
    return this.form.get('topics') as FormArray;
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.certId.set(id);
      this.loadCertification(id);
    } else {
      // Initialize with one topic if new
      this.addTopic(1);
    }

    // Setup auto-calculation for endDate
    this.setupDateCalculation();
  }

  setupDateCalculation() {
    // Listen to changes in startDate and durationMonths
    this.form.get('startDate')?.valueChanges.subscribe(() => this.calculateEndDate());
    this.form.get('durationMonths')?.valueChanges.subscribe(() => this.calculateEndDate());
  }

  calculateEndDate() {
    const startDate = this.form.get('startDate')?.value;
    const durationMonths = this.form.get('durationMonths')?.value;

    if (startDate && durationMonths) {
      const start = new Date(startDate);
      const end = new Date(start);
      end.setMonth(end.getMonth() + durationMonths);

      // Format to YYYY-MM-DD
      const endDateStr = end.toISOString().split('T')[0];
      this.form.get('endDate')?.setValue(endDateStr, { emitEvent: false });
    }
  }

  loadCertification(id: string) {
    this.loading.set(true);
    this.certService.getCertificationById(id).subscribe({
      next: (cert: any) => { // Use specific type if available
        this.form.patchValue({
          name: cert.name,
          code: cert.code || '',
          description: cert.description,
          icon: cert.icon || 'school',
          durationMonths: cert.durationMonths || 6,
          level: cert.level || 'Intermediate',
          startDate: cert.startDate || '',
          endDate: cert.endDate || ''
        });

        // Clear existing topics first
        while (this.topics.length !== 0) {
          this.topics.removeAt(0);
        }

        // Add topics from response
        if (cert.topics && Array.isArray(cert.topics)) {
          cert.topics.forEach((t: any) => {
            const group = this.fb.group({
              id: [t.id], // Keep ID for updates
              name: [t.name, Validators.required],
              description: [t.description],
              icon: [t.icon || 'menu_book'],
              month: [t.month || 1]
            });
            this.topics.push(group);
          });
        }
        this.loading.set(false);
      },
      error: (err: any) => {
        console.error(err);
        this.loading.set(false);
        alert('Không thể tải thông tin chứng chỉ');
        this.router.navigate(['/admin/certifications']);
      }
    });
  }

  topicsByMonth(month: number) {
    // This is probably not needed if using getTopicsForMonth in template
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
    const indices: number[] = [];
    for (let i = 0; i < controls.length; i++) {
      // cast to any or abstractcontrol to check value
      const ctrlMonth = controls[i].get('month')?.value;
      if (ctrlMonth === month) {
        indices.push(i);
      }
    }
    return indices;
  }

  getTopicControl(index: number) {
    return this.topics.at(index) as FormGroup;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const formVal = this.form.value;

    const payload = {
      ...formVal,
    };

    if (this.isEditMode()) {
      this.certService.updateCertification(this.certId()!, payload).subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/admin/certifications']); // Go back to list
        },
        error: (err: any) => {
          console.error(err);
          this.loading.set(false);
          alert('Lỗi khi cập nhật chứng chỉ');
        }
      });
    } else {
      this.certService.createCertification(payload).subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/admin/certifications']);
        },
        error: (err: any) => {
          console.error(err);
          this.loading.set(false);
          alert('Lỗi khi tạo chứng chỉ');
        }
      });
    }
  }

  get monthsArray() {
    const duration = this.form.get('durationMonths')?.value || 0;
    return Array.from({ length: duration }, (_, i) => i + 1);
  }
}
