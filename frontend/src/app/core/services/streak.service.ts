import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * Interface cho daily activity data
 */
export interface DailyActivity {
    date: string;
    minutesStudied: number;
    flashcardsReviewed: number;
    questionsAnswered: number;
    hasActivity: boolean;
    dayOfWeek: string;
}

/**
 * Interface cho streak data
 */
export interface StreakData {
    currentStreak: number;
    longestStreak: number;
    lastStudyDate: string | null;
    last7Days: DailyActivity[];
    studiedToday: boolean;
    minutesToday: number;
    totalDaysStudied: number;
}

/**
 * Service quản lý Study Streak.
 */
@Injectable({
    providedIn: 'root'
})
export class StreakService {
    private http = inject(HttpClient);
    private baseUrl = `${environment.apiUrl}/streak`;

    /**
     * Lấy thông tin streak của user
     */
    getStreak(): Observable<StreakData> {
        return this.http.get<StreakData>(this.baseUrl);
    }

    /**
     * Lấy lịch sử hoạt động N ngày gần nhất
     */
    getHistory(days: number = 30): Observable<DailyActivity[]> {
        return this.http.get<DailyActivity[]>(`${this.baseUrl}/history`, {
            params: { days: days.toString() }
        });
    }

    /**
     * Ghi nhận hoạt động học tập (manual)
     */
    recordActivity(minutes: number = 0, flashcards: number = 0, questions: number = 0): Observable<void> {
        return this.http.post<void>(`${this.baseUrl}/record`, null, {
            params: {
                minutes: minutes.toString(),
                flashcards: flashcards.toString(),
                questions: questions.toString()
            }
        });
    }
}
