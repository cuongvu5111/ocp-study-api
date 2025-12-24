import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';

/**
 * Admin component - Import câu hỏi từ CSV.
 */
@Component({
    selector: 'app-question-import',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    template: `
    <div class="admin-container">
      <header class="page-header">
        <a routerLink="/dashboard" class="btn btn--ghost btn--icon">
          <span class="material-icons-outlined">arrow_back</span>
        </a>
        <h1>Import câu hỏi từ CSV</h1>
      </header>

      <!-- Download Template -->
      <section class="template-section">
        <h3>📥 Tải template CSV</h3>
        <p>Download template và điền câu hỏi theo format:</p>
        <button class="btn btn--secondary" (click)="downloadTemplate()">
          <span class="material-icons-outlined">download</span>
          Tải template
        </button>
      </section>

      <!-- Upload Section -->
      <section class="upload-section">
        <h3>📤 Upload file CSV</h3>
        
        <div class="dropzone" 
             [class.dragover]="isDragover()"
             (dragover)="onDragOver($event)"
             (dragleave)="isDragover.set(false)"
             (drop)="onDrop($event)">
          <input 
            type="file" 
            #fileInput
            accept=".csv"
            (change)="onFileSelect($event)"
            hidden
          />
          <span class="material-icons-outlined">cloud_upload</span>
          <p>Kéo thả file CSV vào đây hoặc</p>
          <button class="btn btn--primary" (click)="fileInput.click()">
            Chọn file
          </button>
        </div>

        @if (selectedFile()) {
        <div class="file-info">
          <span class="material-icons-outlined">description</span>
          <span>{{ selectedFile()?.name }}</span>
          <button class="btn btn--ghost btn--icon" (click)="clearFile()">
            <span class="material-icons-outlined">close</span>
          </button>
        </div>
        }
      </section>

      <!-- Preview -->
      @if (previewData().length > 0) {
      <section class="preview-section">
        <h3>👁️ Preview ({{ previewData().length }} câu)</h3>
        <div class="preview-table">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Topic ID</th>
                <th>Câu hỏi</th>
                <th>Độ khó</th>
              </tr>
            </thead>
            <tbody>
              @for (row of previewData().slice(0, 5); track $index; let i = $index) {
              <tr>
                <td>{{ i + 1 }}</td>
                <td>{{ row.topicId }}</td>
                <td>{{ row.content | slice:0:50 }}...</td>
                <td>{{ row.difficulty }}</td>
              </tr>
              }
              @if (previewData().length > 5) {
              <tr>
                <td colspan="4" class="more-rows">+ {{ previewData().length - 5 }} câu nữa...</td>
              </tr>
              }
            </tbody>
          </table>
        </div>
      </section>
      }

      @if (error()) {
      <div class="error-message">{{ error() }}</div>
      }

      @if (success()) {
      <div class="success-message">{{ success() }}</div>
      }

      <!-- Import Button -->
      @if (selectedFile()) {
      <div class="form-actions">
        <button 
          class="btn btn--primary btn--lg" 
          [disabled]="loading()"
          (click)="importFile()"
        >
          @if (loading()) { 
          <span class="spinner-sm"></span>
          Đang import...
          } @else {
          <span class="material-icons-outlined">upload</span>
          Import {{ previewData().length }} câu hỏi
          }
        </button>
      </div>
      }
    </div>
  `,
    styles: [`
    .admin-container {
      max-width: 900px;
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

    section {
      background: var(--gradient-card);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-xl);
      padding: var(--spacing-6);
      margin-bottom: var(--spacing-6);

      h3 {
        margin: 0 0 var(--spacing-4);
      }

      p {
        color: var(--color-text-muted);
        margin-bottom: var(--spacing-4);
      }
    }

    .dropzone {
      border: 2px dashed var(--color-border);
      border-radius: var(--radius-xl);
      padding: var(--spacing-10);
      text-align: center;
      cursor: pointer;
      transition: all var(--transition-fast);

      &:hover, &.dragover {
        border-color: var(--color-primary);
        background: rgba(99, 102, 241, 0.05);
      }

      .material-icons-outlined {
        font-size: 48px;
        color: var(--color-text-muted);
        margin-bottom: var(--spacing-4);
      }

      p {
        margin-bottom: var(--spacing-4);
      }
    }

    .file-info {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
      padding: var(--spacing-3) var(--spacing-4);
      background: var(--color-bg-tertiary);
      border-radius: var(--radius-lg);
      margin-top: var(--spacing-4);
    }

    .preview-table {
      overflow-x: auto;

      table {
        width: 100%;
        border-collapse: collapse;

        th, td {
          padding: var(--spacing-3);
          text-align: left;
          border-bottom: 1px solid var(--color-border);
        }

        th {
          background: var(--color-bg-tertiary);
          font-weight: 600;
        }

        .more-rows {
          text-align: center;
          color: var(--color-text-muted);
          font-style: italic;
        }
      }
    }

    .error-message {
      padding: var(--spacing-4);
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid var(--color-error);
      border-radius: var(--radius-lg);
      color: var(--color-error);
      margin-bottom: var(--spacing-6);
    }

    .success-message {
      padding: var(--spacing-4);
      background: rgba(34, 197, 94, 0.1);
      border: 1px solid var(--color-success);
      border-radius: var(--radius-lg);
      color: var(--color-success);
      margin-bottom: var(--spacing-6);
    }

    .form-actions {
      display: flex;
      justify-content: center;
    }

    .btn--lg {
      padding: var(--spacing-4) var(--spacing-8);
      font-size: var(--font-size-lg);
    }

    .spinner-sm {
      width: 20px;
      height: 20px;
      border: 2px solid transparent;
      border-top-color: currentColor;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
      margin-right: var(--spacing-2);
    }

    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class QuestionImportComponent {
    private apiService = inject(ApiService);

    selectedFile = signal<File | null>(null);
    previewData = signal<any[]>([]);
    isDragover = signal(false);
    loading = signal(false);
    error = signal<string | null>(null);
    success = signal<string | null>(null);

    downloadTemplate() {
        const csvContent = `topic_id,content,code_snippet,question_type,difficulty,explanation,option_a,option_b,option_c,option_d,correct_answer
4,"Stream nào là intermediate operation?","","SINGLE_CHOICE",2,"filter là intermediate, collect là terminal","filter()","collect()","forEach()","count()","A"
5,"Functional interface có bao nhiêu abstract method?","","SINGLE_CHOICE",1,"Functional interface chỉ có duy nhất 1 abstract method","1","2","0","Nhiều","A"`;

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'questions_template.csv';
        link.click();
    }

    onDragOver(event: DragEvent) {
        event.preventDefault();
        this.isDragover.set(true);
    }

    onDrop(event: DragEvent) {
        event.preventDefault();
        this.isDragover.set(false);
        const files = event.dataTransfer?.files;
        if (files?.length) {
            this.handleFile(files[0]);
        }
    }

    onFileSelect(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files?.length) {
            this.handleFile(input.files[0]);
        }
    }

    handleFile(file: File) {
        if (!file.name.endsWith('.csv')) {
            this.error.set('Vui lòng chọn file CSV');
            return;
        }

        this.selectedFile.set(file);
        this.error.set(null);
        this.success.set(null);

        // Parse preview
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            this.parseCSV(text);
        };
        reader.readAsText(file);
    }

    parseCSV(text: string) {
        const lines = text.split('\n').filter(l => l.trim());
        const headers = lines[0].split(',');

        const data = lines.slice(1).map(line => {
            const values = this.parseCSVLine(line);
            return {
                topicId: values[0],
                content: values[1],
                codeSnippet: values[2],
                questionType: values[3],
                difficulty: values[4],
                explanation: values[5],
                optionA: values[6],
                optionB: values[7],
                optionC: values[8],
                optionD: values[9],
                correctAnswer: values[10]
            };
        });

        this.previewData.set(data);
    }

    parseCSVLine(line: string): string[] {
        const result: string[] = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        result.push(current.trim());
        return result;
    }

    clearFile() {
        this.selectedFile.set(null);
        this.previewData.set([]);
        this.error.set(null);
        this.success.set(null);
    }

    importFile() {
        if (!this.selectedFile()) return;

        this.loading.set(true);
        this.error.set(null);

        const formData = new FormData();
        formData.append('file', this.selectedFile()!);

        this.apiService.importQuestionsCSV(formData).subscribe({
            next: (response) => {
                this.loading.set(false);
                this.success.set(`Import thành công ${response.imported || this.previewData().length} câu hỏi!`);
                this.clearFile();
            },
            error: (err) => {
                this.loading.set(false);
                this.error.set(err.error?.message || 'Lỗi khi import file');
            }
        });
    }
}
