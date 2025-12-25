import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
      padding: 1rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .upload-btn {
      position: relative;
      overflow: hidden;
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

    .doc-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .doc-card {
      background: var(--gradient-card);
      border: 1px solid var(--color-border);
      border-radius: 12px;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      transition: transform 0.2s;

      &:hover {
        transform: translateY(-2px);
        border-color: var(--color-primary);
      }
    }

    .doc-icon {
      font-size: 3rem;
      color: #ef4444; /* PDF Color */
      align-self: center;
    }

    .doc-info {
      text-align: center;
      
      h3 {
        font-size: 1rem;
        margin: 0 0 0.5rem 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .meta {
        font-size: 0.8rem;
        color: var(--color-text-secondary);
      }
    }

    .doc-actions {
        margin-top: auto;
        display: flex;
        gap: 0.5rem;

        button {
            flex: 1;
        }
    }
    
    .loading-overlay {
        position: fixed;
        top:0; left:0; right:0; bottom:0;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }
  `]
})
export class DocumentListComponent implements OnInit {
  private apiService = inject(ApiService);
  private certService = inject(CertificationService);

  documents = signal<any[]>([]);
  loading = signal(false);

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
    window.open(url, '_blank');
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
