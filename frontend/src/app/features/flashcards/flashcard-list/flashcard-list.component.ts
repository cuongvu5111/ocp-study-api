import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';

interface Flashcard {
  id: number;
  topicId: number;
  topicName: string;
  subtopicId?: number;
  subtopicName?: string;
  front: string;
  back: string;
  codeExample?: string;
  reviewCount: number;
  correctCount: number;
  nextReview?: string;
  createdAt: string;
}

interface Topic {
  id: number;
  name: string;
  icon: string;
}

/**
 * Flashcard List component - Quản lý flashcards với tính năng tạo mới.
 */
@Component({
  selector: 'app-flashcard-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './flashcard-list.component.html',
  styleUrls: ['./flashcard-list.component.scss']
})
export class FlashcardListComponent implements OnInit {
  private apiService = inject(ApiService);

  Math = Math; // Expose Math to template

  showCreateModal = signal(false);
  selectedCard = signal<Flashcard | null>(null);
  loading = signal(true);
  submitting = signal(false);
  errorMessage = signal('');

  flashcards = signal<Flashcard[]>([]);
  topics = signal<Topic[]>([]);

  newFlashcard = {
    topicId: '',
    front: '',
    back: '',
    codeExample: ''
  };

  ngOnInit() {
    this.loadFlashcards();
    this.loadTopics();
  }

  loadFlashcards() {
    this.loading.set(true);
    this.apiService.getFlashcards().subscribe({
      next: (data) => {
        // Handle both array and Page object response
        const flashcards = Array.isArray(data) ? data : (data.content || []);
        this.flashcards.set(flashcards);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading flashcards:', err);
        this.loading.set(false);
      }
    });
  }

  loadTopics() {
    this.apiService.getTopics().subscribe({
      next: (data) => {
        // Handle both array and Page object response
        const topics = Array.isArray(data) ? data : (data.content || []);
        this.topics.set(topics);
      },
      error: (err) => {
        console.error('Error loading topics:', err);
      }
    });
  }

  totalCards = () => {
    const cards = this.flashcards();
    return Array.isArray(cards) ? cards.length : 0;
  };
  dueCount = () => 0; // TODO: Calculate from backend
  masteredCount = () => {
    const cards = this.flashcards();
    if (!Array.isArray(cards)) return 0;
    return cards.filter(f => f.reviewCount > 0 && f.correctCount / f.reviewCount > 0.8).length;
  };

  // Detail Modal
  viewCard(card: Flashcard) {
    this.selectedCard.set(card);
  }

  closeDetailModal() {
    this.selectedCard.set(null);
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Create Modal
  openCreateModal() {
    this.showCreateModal.set(true);
    this.errorMessage.set('');
    this.resetForm();
  }

  closeCreateModal() {
    this.showCreateModal.set(false);
    this.resetForm();
  }

  resetForm() {
    this.newFlashcard = {
      topicId: '',
      front: '',
      back: '',
      codeExample: ''
    };
  }

  submitFlashcard() {
    this.submitting.set(true);
    this.errorMessage.set('');

    const flashcard = {
      topicId: Number(this.newFlashcard.topicId),
      front: this.newFlashcard.front,
      back: this.newFlashcard.back,
      codeExample: this.newFlashcard.codeExample || undefined
    };

    this.apiService.createFlashcard(flashcard).subscribe({
      next: () => {
        this.submitting.set(false);
        this.closeCreateModal();
        this.loadFlashcards(); // Reload list
      },
      error: (err) => {
        console.error('Error creating flashcard:', err);
        this.errorMessage.set('Không thể tạo flashcard. Vui lòng thử lại!');
        this.submitting.set(false);
      }
    });
  }
}
