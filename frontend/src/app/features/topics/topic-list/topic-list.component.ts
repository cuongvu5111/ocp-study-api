import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';

interface Topic {
  id: number;
  name: string;
  description: string;
  icon: string;
  month: number;
  estimatedDays: number;
  completedSubtopics: number;
  totalSubtopics: number;
  progressPercentage: number;
}

/**
 * Topic List component - Hiển thị danh sách 12 topics OCP.
 */
@Component({
  selector: 'app-topic-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './topic-list.component.html',
  styleUrls: ['./topic-list.component.scss']
})
export class TopicListComponent implements OnInit {
  private apiService = inject(ApiService);

  selectedMonth = signal(0);
  loading = signal(true);
  topics = signal<Topic[]>([]);

  ngOnInit() {
    this.loadTopics();
  }

  loadTopics() {
    this.loading.set(true);
    this.apiService.getTopics().subscribe({
      next: (data) => {
        this.topics.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading topics:', err);
        this.loading.set(false);
      }
    });
  }

  completedTopics = () => {
    return this.topics().filter(t => t.progressPercentage === 100).length;
  };

  filteredTopics = () => {
    const month = this.selectedMonth();
    if (month === 0) return this.topics();
    return this.topics().filter(t => t.month === month);
  };
}
