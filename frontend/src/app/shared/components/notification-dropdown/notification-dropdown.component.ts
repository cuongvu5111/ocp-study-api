import { Component, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NotificationService, Notification, NotificationType } from '../../../core/services/notification.service';
import { Subscription } from 'rxjs';

/**
 * Component hiển thị Notification dropdown trong header
 */
@Component({
    selector: 'app-notification-dropdown',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="notification-container">
      <!-- Bell Button -->
      <button class="notification-btn" (click)="toggleDropdown()" title="Thông báo">
        <span class="material-icons-outlined">notifications</span>
        @if (notificationService.unreadCount() > 0) {
          <span class="notification-badge">{{ notificationService.unreadCount() }}</span>
        }
      </button>

      <!-- Dropdown -->
      @if (dropdownOpen()) {
        <div class="notification-dropdown" (click)="$event.stopPropagation()">
          <!-- Header -->
          <div class="dropdown-header">
            <h3>Thông báo ({{ notificationService.unreadCount() }})</h3>
            @if (notificationService.unreadCount() > 0) {
              <button class="mark-all-btn" (click)="markAllAsRead()">
                Đánh dấu tất cả đã đọc
              </button>
            }
          </div>

          <!-- Notification List -->
          <div class="notification-list">
            @if (loading()) {
              <div class="loading-state">
                <span class="material-icons-outlined spin">sync</span>
                <p>Đang tải...</p>
              </div>
            } @else if (notifications().length === 0) {
              <div class="empty-state">
                <span class="material-icons-outlined">notifications_none</span>
                <p>Không có thông báo mới</p>
              </div>
            } @else {
              @for (notification of notifications(); track notification.id) {
                <div 
                  class="notification-item"
                  [class.unread]="!notification.isRead"
                  (click)="handleNotificationClick(notification)"
                >
                  <div class="notification-icon" [class]="getIconClass(notification.type)">
                    <span class="material-icons-outlined">{{ getIcon(notification.type) }}</span>
                  </div>
                  
                  <div class="notification-content">
                    <div class="notification-title">{{ notification.title }}</div>
                    <div class="notification-message">{{ notification.message }}</div>
                    <div class="notification-time">{{ notification.relativeTime }}</div>
                  </div>

                  @if (!notification.isRead) {
                    <div class="unread-dot"></div>
                  }
                </div>
              }
            }
          </div>

          <!-- Footer -->
          @if (notifications().length > 0) {
            <div class="dropdown-footer">
              <button class="view-all-btn" (click)="viewAll()">
                Xem tất cả
              </button>
            </div>
          }
        </div>
      }
    </div>
  `,
    styles: [`
    .notification-container {
      position: relative;
    }

    .notification-btn {
      position: relative;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: none;
      border: none;
      color: rgba(255, 255, 255, 0.8);
      cursor: pointer;
      border-radius: 8px;
      transition: all 0.2s;

      &:hover {
        background: rgba(255, 255, 255, 0.1);
        color: white;
      }

      .material-icons-outlined {
        font-size: 24px;
      }
    }

    .notification-badge {
      position: absolute;
      top: -2px;
      right: -2px;
      min-width: 18px;
      height: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 4px;
      font-size: 10px;
      font-weight: 600;
      color: white;
      background: #ef4444;
      border-radius: 10px;
    }

    .notification-dropdown {
      position: absolute;
      top: calc(100% + 0.5rem);
      right: 0;
      width: 400px;
      max-height: 600px;
      display: flex;
      flex-direction: column;
      background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
      z-index: 1000;
      animation: slideDown 0.2s ease-out;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .dropdown-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.25rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);

      h3 {
        margin: 0;
        font-size: 1rem;
        font-weight: 600;
        color: white;
      }

      .mark-all-btn {
        background: none;
        border: none;
        color: #8b5cf6;
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
        transition: color 0.2s;

        &:hover {
          color: #a78bfa;
        }
      }
    }

    .notification-list {
      flex: 1;
      overflow-y: auto;
      max-height: 450px;

      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 3px;
      }
    }

    .notification-item {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1rem 1.25rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      cursor: pointer;
      transition: background 0.2s;
      position: relative;

      &:hover {
        background: rgba(255, 255, 255, 0.05);
      }

      &.unread {
        background: rgba(139, 92, 246, 0.05);
      }

      &:last-child {
        border-bottom: none;
      }
    }

    .notification-icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 10px;
      flex-shrink: 0;

      &.streak {
        background: rgba(245, 158, 11, 0.2);
        color: #f59e0b;
      }

      &.review {
        background: rgba(59, 130, 246, 0.2);
        color: #3b82f6;
      }

      &.quiz {
        background: rgba(16, 185, 129, 0.2);
        color: #10b981;
      }

      &.achievement {
        background: rgba(236, 72, 153, 0.2);
        color: #ec4899;
      }

      &.milestone {
        background: rgba(139, 92, 246, 0.2);
        color: #8b5cf6;
      }

      .material-icons-outlined {
        font-size: 20px;
      }
    }

    .notification-content {
      flex: 1;
      min-width: 0;
    }

    .notification-title {
      font-size: 0.9375rem;
      font-weight: 600;
      color: white;
      margin-bottom: 0.25rem;
    }

    .notification-message {
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.6);
      line-height: 1.4;
      margin-bottom: 0.5rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .notification-time {
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.4);
    }

    .unread-dot {
      width: 8px;
      height: 8px;
      background: #8b5cf6;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .loading-state, .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem 2rem;
      text-align: center;
      color: rgba(255, 255, 255, 0.6);

      .material-icons-outlined {
        font-size: 48px;
        margin-bottom: 1rem;
        opacity: 0.5;
      }

      .spin {
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }

      p {
        margin: 0;
        font-size: 0.875rem;
      }
    }

    .dropdown-footer {
      padding: 0.75rem 1.25rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);

      .view-all-btn {
        width: 100%;
        padding: 0.75rem;
        background: rgba(139, 92, 246, 0.1);
        border: 1px solid rgba(139, 92, 246, 0.3);
        border-radius: 8px;
        color: #a78bfa;
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
          background: rgba(139, 92, 246, 0.2);
          border-color: rgba(139, 92, 246, 0.5);
        }
      }
    }
  `]
})
export class NotificationDropdownComponent implements OnInit, OnDestroy {
    notificationService = inject(NotificationService);
    private router = inject(Router);

    dropdownOpen = signal(false);
    notifications = signal<Notification[]>([]);
    loading = signal(false);

    private pollingSubscription?: Subscription;

    ngOnInit() {
        // Start polling for unread count
        this.pollingSubscription = this.notificationService.startPolling();

        // Load initial notifications
        this.loadNotifications();
    }

    ngOnDestroy() {
        this.pollingSubscription?.unsubscribe();
    }

    toggleDropdown() {
        this.dropdownOpen.update(v => !v);
        if (this.dropdownOpen()) {
            this.loadNotifications();
        }
    }

    loadNotifications() {
        this.loading.set(true);
        this.notificationService.getNotifications(0, 10).subscribe({
            next: (page) => {
                this.notifications.set(page.content);
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Failed to load notifications:', err);
                this.loading.set(false);
            }
        });
    }

    handleNotificationClick(notification: Notification) {
        // Mark as read
        if (!notification.isRead) {
            this.notificationService.markAsRead(notification.id).subscribe(() => {
                notification.isRead = true;
                this.notificationService.refreshUnreadCount();
            });
        }

        // Navigate if has actionUrl
        if (notification.actionUrl) {
            this.router.navigate([notification.actionUrl]);
            this.dropdownOpen.set(false);
        }
    }

    markAllAsRead() {
        this.notificationService.markAllAsRead().subscribe(() => {
            this.notifications.update(list => list.map(n => ({ ...n, isRead: true })));
            this.notificationService.refreshUnreadCount();
        });
    }

    viewAll() {
        this.router.navigate(['/notifications']);
        this.dropdownOpen.set(false);
    }

    getIcon(type: NotificationType): string {
        const icons: Record<NotificationType, string> = {
            [NotificationType.STREAK_WARNING]: 'local_fire_department',
            [NotificationType.REVIEW_DUE]: 'school',
            [NotificationType.QUIZ_SUGGESTION]: 'quiz',
            [NotificationType.ACHIEVEMENT]: 'emoji_events',
            [NotificationType.PROGRESS_MILESTONE]: 'flag'
        };
        return icons[type] || 'notifications';
    }

    getIconClass(type: NotificationType): string {
        const classes: Record<NotificationType, string> = {
            [NotificationType.STREAK_WARNING]: 'streak',
            [NotificationType.REVIEW_DUE]: 'review',
            [NotificationType.QUIZ_SUGGESTION]: 'quiz',
            [NotificationType.ACHIEVEMENT]: 'achievement',
            [NotificationType.PROGRESS_MILESTONE]: 'milestone'
        };
        return classes[type] || '';
    }
}
