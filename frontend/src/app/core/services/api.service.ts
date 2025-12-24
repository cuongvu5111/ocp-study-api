import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

/**
 * API Service - Xử lý tất cả HTTP requests đến backend.
 * 
 * @author OCP Study Team
 * @since 1.0.0
 */
@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private http = inject(HttpClient);
    private baseUrl = environment.apiUrl;

    // ==================== TOPICS ====================

    getTopics(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/topics`);
    }

    getTopicById(id: number): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/topics/${id}`);
    }

    getTopicsByMonth(month: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/topics/month/${month}`);
    }

    // ==================== FLASHCARDS ====================

    getFlashcards(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/flashcards`);
    }

    getFlashcardsByTopic(topicId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/flashcards/topic/${topicId}`);
    }

    getFlashcardsToReview(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/flashcards/review`);
    }

    createFlashcard(flashcard: any): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/flashcards`, flashcard);
    }

    updateFlashcard(id: number, flashcard: any): Observable<any> {
        return this.http.put<any>(`${this.baseUrl}/flashcards/${id}`, flashcard);
    }

    deleteFlashcard(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/flashcards/${id}`);
    }

    markFlashcardReviewed(id: number, correct: boolean): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/flashcards/${id}/review?correct=${correct}`, {});
    }

    // ==================== PROGRESS ====================

    updateSubtopicStatus(subtopicId: number, status: string): Observable<any> {
        return this.http.post<any>(
            `${this.baseUrl}/progress/subtopic/${subtopicId}/status?status=${status}`,
            {}
        );
    }

    updateSubtopicPercentage(subtopicId: number, percentage: number): Observable<any> {
        return this.http.post<any>(
            `${this.baseUrl}/progress/subtopic/${subtopicId}/percentage?percentage=${percentage}`,
            {}
        );
    }

    getOverallProgress(): Observable<number> {
        return this.http.get<number>(`${this.baseUrl}/progress/overall`);
    }

    // ==================== DASHBOARD ====================

    getDashboard(): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/dashboard`);
    }

    recordStudySession(minutes: number): Observable<void> {
        return this.http.post<void>(
            `${this.baseUrl}/dashboard/study-session?minutes=${minutes}`,
            {}
        );
    }

    // ==================== QUIZ ====================

    getQuizQuestions(topicId?: number, limit: number = 10): Observable<any[]> {
        let url = `${this.baseUrl}/quiz/questions?limit=${limit}`;
        if (topicId) {
            url += `&topicId=${topicId}`;
        }
        return this.http.get<any[]>(url);
    }

    submitQuiz(answers: any[]): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/quiz/submit`, { answers });
    }

    getQuizHistory(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/quiz/history`);
    }
}
