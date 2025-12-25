import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval } from 'rxjs';
import { switchMap, startWith } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

/**
 * Notification type enum
 */
export enum NotificationType {
    STREAK_WARNING = 'STREAK_WARNING',
    REVIEW_DUE = 'REVIEW_DUE',
    QUIZ_SUGGESTION = 'QUIZ_SUGGESTION',
    ACHIEVEMENT = 'ACHIEVEMENT',
    PROGRESS_MILESTONE = 'PROGRESS_MILESTONE'
}

/**
 * Notification interface
 */
export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    actionUrl?: string;
    isRead: boolean;
    createdAt: string;
    readAt?: string;
    relativeTime: string;
}

/**
 * Page wrapper for notifications
 */
export interface NotificationPage {
    content: Notification[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
}

/**
 * Service quản lý Notifications.
 */
@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private http = inject(HttpClient);
    private baseUrl = `${environment.apiUrl}/notifications`;

    // Signal để track unread count
    unreadCount = signal(0);

    /**
     * Lấy danh sách notifications
     */
    getNotifications(page: number = 0, size: number = 20): Observable<NotificationPage> {
        return this.http.get<NotificationPage>(this.baseUrl, {
            params: { page: page.toString(), size: size.toString() }
        });
    }

    /**
     * Lấy số lượng notification chưa đọc
     */
    getUnreadCount(): Observable<{ count: number }> {
        return this.http.get<{ count: number }>(`${this.baseUrl}/unread-count`);
    }

    /**
     * Mark notification là đã đọc
     */
    markAsRead(id: string): Observable<void> {
        return this.http.patch<void>(`${this.baseUrl}/${id}/read`, null);
    }

    /**
     * Mark tất cả notifications là đã đọc
     */
    markAllAsRead(): Observable<void> {
        return this.http.patch<void>(`${this.baseUrl}/read-all`, null);
    }

    /**
     * Xóa notification
     */
    deleteNotification(id: string): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }

    /**
     * Start polling để update unread count
     */
    startPolling(intervalMs: number = 30000) {
        return interval(intervalMs).pipe(
            startWith(0),
            switchMap(() => this.getUnreadCount())
        ).subscribe(data => {
            this.unreadCount.set(data.count);
        });
    }

    /**
     * Refresh unread count ngay lập tức
     */
    refreshUnreadCount() {
        this.getUnreadCount().subscribe(data => {
            this.unreadCount.set(data.count);
        });
    }
}
