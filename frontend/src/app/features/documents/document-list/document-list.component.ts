import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CertificationService } from '../../../core/services/certification.service';
import { ApiService } from '../../../core/services/api.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-document-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './document-list.component.html',
  styles: [`
    .doc-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;

      .header-title {
          display: flex;
          align-items: center;
          gap: 1rem;
          color: var(--color-text-primary);
          
          .material-icons-outlined {
              font-size: 2rem;
              color: var(--color-primary);
          }
          
          h1 { margin: 0; font-size: 1.75rem; }
      }
    }

    .upload-btn {
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
    }
    
    .upload-input {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      cursor: pointer;
    }

    .table-card {
        background: var(--color-bg-secondary);
        border: 1px solid var(--color-border);
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .doc-list {
        width: 100%;
        border-collapse: collapse;
        
        th {
            background: rgba(255, 255, 255, 0.03);
            text-align: left;
            padding: 1rem 1.5rem;
            color: var(--color-text-secondary);
            font-weight: 500;
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            border-bottom: 1px solid var(--color-border);
        }

        td {
            padding: 1rem 1.5rem;
            border-bottom: 1px solid var(--color-border);
            color: var(--color-text-primary);
        }

        tr:last-child td { border-bottom: none; }
        
        tr:hover td {
            background: rgba(255, 255, 255, 0.02);
        }
    }

    .col-icon { width: 50px; text-align: center; }
    .col-title { min-width: 300px; }
    .col-date { width: 150px; color: var(--color-text-secondary); }
    .col-size { width: 120px; color: var(--color-text-secondary); }
    .col-actions { width: 250px; }

    .pdf-icon {
        color: #ef4444;
        font-size: 1.5rem;
    }

    .title-text {
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 400px;
    }

    .action-group {
        display: flex;
        gap: 0.25rem;
        align-items: center;
        justify-content: flex-end;
    }

    .btn--icon {
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 10px;
        transition: all 0.2s ease;
        
        .material-icons-outlined {
            font-size: 1.25rem;
        }

        &:hover {
            background: rgba(255, 255, 255, 0.08);
            transform: translateY(-1px);
        }
    }

    .btn--danger-ghost {
        color: var(--color-text-secondary);
        &:hover {
            background: rgba(239, 68, 68, 0.15) !important;
            color: #ef4444 !important;
        }
    }

    .empty-row {
        padding: 4rem 0 !important;
    }

    .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        color: var(--color-text-muted);

        .material-icons-outlined { font-size: 3rem; opacity: 0.5; }
        p { margin: 0; }
    }

    .loading-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 4rem;
        gap: 1.5rem;
        color: var(--color-text-secondary);
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

    /* PDF Preview Modal */
    .preview-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.85);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        padding: 1rem;
        backdrop-filter: blur(4px);
    }

    .preview-container {
        background: var(--color-bg-secondary);
        width: 95vw;
        height: 95vh;
        max-width: 1400px;
        border-radius: 12px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        border: 1px solid var(--color-border);
    }

    .preview-header {
        padding: 1rem 1.5rem;
        background: rgba(255, 255, 255, 0.03);
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid var(--color-border);

        .title {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            
            .material-icons-outlined { color: #ef4444; }
            h3 { 
                margin: 0; 
                font-size: 1.1rem;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 700px;
            }
        }
    }

    .preview-body {
        flex: 1;
        background: #525659; /* Standard PDF viewer background */
        
        iframe {
            width: 100%;
            height: 100%;
            border: none;
        }
    }

    .btn-close {
        color: var(--color-text-secondary);
        &:hover { color: var(--color-text-primary); }
    }
  `]
})
export class DocumentListComponent implements OnInit {
  private apiService = inject(ApiService);
  private certService = inject(CertificationService);
  private sanitizer = inject(DomSanitizer);

  documents = signal<any[]>([]);
  loading = signal(false);

  // Preview signals
  showPreview = signal(false);
  previewUrl = signal<SafeResourceUrl | null>(null);
  previewTitle = signal('');

  apiUrl = environment.apiUrl;

  ngOnInit() {
    this.certService.selectedCertId$.subscribe(certId => {
      if (certId) {
        this.loadDocuments(certId);
      }
    });
  }

  loadDocuments(certId: string) {
    this.loading.set(true);
    this.apiService.getDocuments(certId).subscribe({
      next: (data) => {
        this.documents.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
      }
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    const certId = this.certService.getCurrentCertId();

    if (file && certId) {
      if (file.type !== 'application/pdf') {
        alert('Chỉ upload file PDF!');
        return;
      }

      this.loading.set(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('certificationId', certId);
      formData.append('title', file.name.replace('.pdf', ''));

      this.apiService.uploadDocument(formData).subscribe({
        next: (newDoc) => {
          this.documents.update(docs => [newDoc, ...docs]);
          this.loading.set(false);
          alert('Upload thành công!');
        },
        error: (err) => {
          console.error(err);
          this.loading.set(false);
          alert('Upload thất bại');
        }
      });
    }
  }

  viewDocument(doc: any) {
    const url = `${this.apiUrl}/documents/${doc.id}/file`;
    this.previewUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(url));
    this.previewTitle.set(doc.title);
    this.showPreview.set(true);
  }

  closePreview() {
    this.showPreview.set(false);
    this.previewUrl.set(null);
  }

  downloadDocument(doc: any) {
    const url = this.apiService.downloadDocument(doc.id);

    // Sử dụng fetch + blob để download với đúng tên file
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Download failed');
        }
        return response.blob();
      })
      .then(blob => {
        // Tạo URL cho blob
        const blobUrl = window.URL.createObjectURL(blob);

        // Tạo thẻ a để trigger download với tên file đúng
        const a = document.createElement('a');
        a.href = blobUrl;

        // Đặt tên file: ưu tiên title, fallback về fileName, đảm bảo có .pdf
        let fileName = doc.title || doc.fileName || 'document';
        if (!fileName.toLowerCase().endsWith('.pdf')) {
          fileName += '.pdf';
        }
        a.download = fileName;

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Giải phóng blob URL
        window.URL.revokeObjectURL(blobUrl);
      })
      .catch(error => {
        console.error('Download error:', error);
        alert('Tải tài liệu thất bại!');
      });
  }

  deleteDocument(id: string) {
    if (confirm('Bạn có chắc muốn xóa tài liệu này?')) {
      this.apiService.deleteDocument(id).subscribe({
        next: () => {
          this.documents.update(docs => docs.filter(d => d.id !== id));
        },
        error: () => alert('Xóa thất bại')
      });
    }
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('vi-VN');
  }
}
