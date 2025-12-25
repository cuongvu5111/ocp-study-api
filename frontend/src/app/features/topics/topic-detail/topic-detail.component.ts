import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';

interface Topic {
  id: string;  // UUID
  name: string;
  description: string;
  icon: string;
  month: number;
  estimatedDays: number;
  subtopics: Subtopic[];
  completedSubtopics: number;
  totalSubtopics: number;
  progressPercentage: number;
}

interface Subtopic {
  id: string;  // UUID
  name: string;
  description: string;
  difficulty: number;
  estimatedDays: number;
  priority: string;
  status: string;
  completionPercentage: number;
}

/**
 * Topic Detail component - Hiển thị chi tiết topic với subtopics.
 */
@Component({
  selector: 'app-topic-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './topic-detail.component.html',
  styleUrls: ['./topic-detail.component.scss']
})
export class TopicDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private apiService = inject(ApiService);

  topic = signal<Topic | null>(null);
  loading = signal(true);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadTopic(id);
    }
  }

  loadTopic(id: string) {
    this.loading.set(true);
    this.apiService.getTopicById(id).subscribe({
      next: (data) => {
        this.topic.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading topic:', err);
        this.loading.set(false);
      }
    });
  }

  updateStatus(subtopicId: string, status: string) {
    this.apiService.updateSubtopicStatus(subtopicId, status).subscribe({
      next: () => {
        // Reload topic để cập nhật completedSubtopics count
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
          this.loadTopic(id);
        }
      },
      error: (err) => {
        console.error('Error updating status:', err);
        alert('Có lỗi xảy ra khi cập nhật!');
      }
    });
  }

  goBack() {
    this.router.navigate(['/topics']);
  }
}
