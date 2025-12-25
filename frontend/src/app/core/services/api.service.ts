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

    getTopics(certificationId?: string, page?: number, size?: number): Observable<any> {
        let url = `${this.baseUrl}/topics`;
        const params: any = {};
        if (certificationId) params.certificationId = certificationId;
        if (page !== undefined) params.page = page;
        if (size !== undefined) params.size = size;

        return this.http.get<any>(url, { params });
    }

    getTopicById(id: string): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/topics/${id}`);
    }

    getTopicsByMonth(month: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/topics/month/${month}`);
    }

    createTopic(data: any): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/topics`, data);
    }

    updateTopic(id: string, data: any): Observable<any> {
        return this.http.put<any>(`${this.baseUrl}/topics/${id}`, data);
    }

    deleteTopic(id: string): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/topics/${id}`);
    }

    // ==================== FLASHCARDS ====================

    getFlashcards(page?: number, size?: number): Observable<any> {
        let params: any = {};
        if (page !== undefined) params.page = page;
        if (size !== undefined) params.size = size;
        return this.http.get<any>(`${this.baseUrl}/flashcards`, { params });
    }

    getFlashcardsByTopic(topicId: string, page?: number, size?: number): Observable<any> {
        let params: any = {};
        if (page !== undefined) params.page = page;
        if (size !== undefined) params.size = size;
        return this.http.get<any>(`${this.baseUrl}/flashcards/topic/${topicId}`, { params });
    }

    getFlashcardsToReview(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/flashcards/review`);
    }

    getFlashcardById(id: string): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/flashcards/${id}`);
    }

    createFlashcard(flashcard: any): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/flashcards`, flashcard);
    }

    updateFlashcard(id: string, flashcard: any): Observable<any> {
        return this.http.put<any>(`${this.baseUrl}/flashcards/${id}`, flashcard);
    }
    deleteFlashcard(id: string): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/flashcards/${id}`);
    }

    markFlashcardReviewed(id: string, correct: boolean): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/flashcards/${id}/review?correct=${correct}`, {});
    }

    // ==================== PROGRESS ====================

    updateSubtopicStatus(subtopicId: string, status: string): Observable<any> {
        return this.http.post<any>(
            `${this.baseUrl}/progress/subtopic/${subtopicId}/status?status=${status}`,
            {}
        );
    }

    updateSubtopicPercentage(subtopicId: string, percentage: number): Observable<any> {
        return this.http.post<any>(
            `${this.baseUrl}/progress/subtopic/${subtopicId}/percentage?percentage=${percentage}`,
            {}
        );
    }

    getOverallProgress(): Observable<number> {
        return this.http.get<number>(`${this.baseUrl}/progress/overall`);
    }

    // ==================== DASHBOARD ====================

    getDashboard(certificationId?: string): Observable<any> {
        let url = `${this.baseUrl}/dashboard`;
        if (certificationId) {
            url += `?certificationId=${certificationId}`;
        }
        return this.http.get<any>(url);
    }

    recordStudySession(minutes: number): Observable<void> {
        return this.http.post<void>(
            `${this.baseUrl}/dashboard/study-session?minutes=${minutes}`,
            {}
        );
    }

    // ==================== QUIZ ====================

    getQuizQuestions(topicId?: string, limit: number = 10): Observable<any[]> {
        let url = `${this.baseUrl}/quiz/questions?limit=${limit}`;
        if (topicId) {
            url += `&topicId=${topicId}`;
        }
        return this.http.get<any[]>(url);
    }

    submitQuiz(submission: any): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/quiz/submit`, submission);
    }

    getQuizHistory(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/quiz/history`);
    }

    // ==================== ADMIN ====================

    getQuestions(page?: number, size?: number): Observable<any> { // Returns Page<Question>
        let params: any = {};
        if (page !== undefined) params.page = page;
        if (size !== undefined) params.size = size;
        return this.http.get<any>(`${this.baseUrl}/admin/questions`, { params });
    }

    getQuestionById(id: string): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/admin/questions/${id}`);
    }

    createQuestion(data: any): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/admin/questions`, data);
    }

    updateQuestion(id: string, data: any): Observable<any> {
        return this.http.put<any>(`${this.baseUrl}/admin/questions/${id}`, data);
    }

    deleteQuestion(id: string): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/admin/questions/${id}`);
    }

    importQuestionsCSV(formData: FormData): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/admin/questions/import-csv`, formData);
    }

    // ==================== DOCUMENTS ====================

    getDocuments(certificationId: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/documents?certificationId=${certificationId}`);
    }

    uploadDocument(formData: FormData): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/documents`, formData);
    }

    deleteDocument(id: string): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/documents/${id}`);
    }

    downloadDocument(docId: string): string {
        return `${this.baseUrl}/documents/${docId}/file?download=true`;
    }
}
