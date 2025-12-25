import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';

interface Topic {
  id: string;
  name: string;
  description?: string;
  subtopicCount?: number;
}

/**
 * Quiz Start component - Chọn mode và bắt đầu quiz.
 */
@Component({
  selector: 'app-quiz-start',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './quiz-start.component.html',
  styleUrls: ['./quiz-start.component.scss']
})
export class QuizStartComponent implements OnInit {
  private router = inject(Router);
  private apiService = inject(ApiService);

  history = signal<any[]>([]);
  showTopicModal = signal(false);
  topics = signal<Topic[]>([]);
  loadingTopics = signal(false);

  ngOnInit() {
    this.loadHistory();
  }

  loadHistory() {
    this.apiService.getQuizHistory().subscribe({
      next: (data) => this.history.set(data),
      error: (err) => {
        console.error('Error loading quiz history:', err);
        this.history.set([]);
      }
    });
  }

  loadTopics() {
    this.loadingTopics.set(true);
    this.apiService.getTopics().subscribe({
      next: (data) => {
        this.topics.set(data);
        this.loadingTopics.set(false);
      },
      error: (err) => {
        console.error('Error loading topics:', err);
        this.loadingTopics.set(false);
      }
    });
  }

  selectMode(mode: string) {
    if (mode === 'topic') {
      // Show modal để chọn topic
      this.showTopicModal.set(true);
      this.loadTopics();
    } else {
      // Quick quiz hoặc Mock exam - navigate trực tiếp
      this.router.navigate(['/quiz/session'], {
        queryParams: { mode }
      });
    }
  }

  selectTopic(topic: Topic) {
    this.showTopicModal.set(false);
    this.router.navigate(['/quiz/session'], {
      queryParams: {
        mode: 'topic',
        topicId: topic.id
      }
    });
  }

  closeTopicModal() {
    this.showTopicModal.set(false);
  }
}

