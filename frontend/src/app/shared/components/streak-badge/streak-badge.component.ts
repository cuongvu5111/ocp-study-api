import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StreakService, StreakData, DailyActivity } from '../../../core/services/streak.service';

/**
 * Component hiển thị Study Streak badge trong header
 */
@Component({
  selector: 'app-streak-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="streak-container" (click)="toggleDropdown()">
      <!-- Badge -->
      <div class="streak-badge" [class]="getStreakClass()">
        <span class="fire-icon">🔥</span>
        <span class="streak-count">{{ streakData()?.currentStreak || 0 }}</span>
      </div>

      <!-- Dropdown -->
      @if (dropdownOpen()) {
        <div class="streak-dropdown" (click)="$event.stopPropagation()">
          <div class="dropdown-header">
            <h3>Study Streak</h3>
            <button class="close-btn" (click)="toggleDropdown()">×</button>
          </div>

          @if (streakData(); as data) {
            <!-- Current Streak -->
            <div class="streak-stats">
              <div class="stat-card primary">
                <div class="stat-icon">🔥</div>
                <div class="stat-info">
                  <div class="stat-value">{{ data.currentStreak }}</div>
                  <div class="stat-label">ngày liên tục</div>
                </div>
              </div>

              <div class="stat-card">
                <div class="stat-icon">🏆</div>
                <div class="stat-info">
                  <div class="stat-value">{{ data.longestStreak }}</div>
                  <div class="stat-label">Streak dài nhất</div>
                </div>
              </div>
            </div>

            <!-- Today's Progress -->
            <div class="today-progress">
              <div class="progress-header">
                <span>Hôm nay</span>
                <span class="minutes">{{ data.minutesToday }} phút</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" [style.width.%]="getProgressPercentage(data.minutesToday)"></div>
              </div>
              @if (data.studiedToday) {
                <div class="status success">✅ Đã hoàn thành mục tiêu!</div>
              } @else {
                <div class="status warning">⚠️ Chưa học hôm nay</div>
              }
            </div>

            <!-- 7-Day Calendar -->
            <div class="calendar-section">
              <h4>Tuần này</h4>
              <div class="calendar-grid">
                @for (day of data.last7Days; track day.date) {
                  <div class="day-cell" [class.active]="day.hasActivity" [class.today]="isToday(day.date)">
                    <div class="day-name">{{ day.dayOfWeek }}</div>
                    <div class="day-status">
                      @if (day.hasActivity) {
                        <span class="check">✓</span>
                      } @else {
                        <span class="dot">•</span>
                      }
                    </div>
                    <div class="day-minutes">{{ day.minutesStudied }}m</div>
                  </div>
                }
              </div>
            </div>

            <!-- Motivation Message -->
            <div class="motivation-message">
              {{ getMotivationMessage(data.currentStreak) }}
            </div>
          }

          @if (loading()) {
            <div class="loading">Đang tải...</div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .streak-container {
      position: relative;
      cursor: pointer;
    }

    .streak-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.3s ease;
      cursor: pointer;
      
      &:hover {
        transform: scale(1.05);
      }
    }

    .fire-icon {
      font-size: 1.5rem;
      animation: flicker 2s infinite;
    }

    @keyframes flicker {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.8; }
    }

    .streak-count {
      font-size: 1.25rem;
      font-weight: 700;
      color: white;
    }

    .streak-dropdown {
      position: absolute;
      top: calc(100% + 0.5rem);
      right: 0;
      width: 400px;
      max-height: 600px;
      background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
      padding: 1.5rem;
      z-index: 1000;
    }

    .dropdown-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;

      h3 {
        margin: 0;
        font-size: 1.25rem;
        color: white;
      }

      .close-btn {
        background: none;
        border: none;
        color: rgba(255, 255, 255, 0.6);
        font-size: 2rem;
        cursor: pointer;
        padding: 0;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        transition: all 0.2s;

        &:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }
      }
    }

    .streak-stats {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .stat-card {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 1rem;
      display: flex;
      align-items: center;
      gap: 1rem;

      &.primary {
        background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.2));
        border-color: rgba(139, 92, 246, 0.3);
      }

      .stat-icon {
        font-size: 2rem;
      }

      .stat-info {
        flex: 1;
      }

      .stat-value {
        font-size: 1.75rem;
        font-weight: 700;
        color: white;
      }

      .stat-label {
        font-size: 0.875rem;
        color: rgba(255, 255, 255, 0.6);
      }
    }

    .today-progress {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      padding: 1rem;
      margin-bottom: 1.5rem;

      .progress-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
        font-size: 0.875rem;
        color: rgba(255, 255, 255, 0.8);

        .minutes {
          font-weight: 600;
          color: #10b981;
        }
      }

      .progress-bar {
        height: 8px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 0.75rem;

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #10b981, #3b82f6);
          border-radius: 4px;
          transition: width 0.3s ease;
        }
      }

      .status {
        text-align: center;
        padding: 0.5rem;
        border-radius: 8px;
        font-size: 0.875rem;
        font-weight: 500;

        &.success {
          background: rgba(16, 185, 129, 0.2);
          color: #10b981;
        }

        &.warning {
          background: rgba(245, 158, 11, 0.2);
          color: #f59e0b;
        }
      }
    }

    .calendar-section {
      margin-bottom: 1.5rem;

      h4 {
        font-size: 0.875rem;
        color: rgba(255, 255, 255, 0.6);
        margin-bottom: 1rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
    }

    .calendar-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 0.5rem;
    }

    .day-cell {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 0.75rem 0.5rem;
      text-align: center;
      transition: all 0.2s;

      &.active {
        background: rgba(16, 185, 129, 0.2);
        border-color: #10b981;
      }

      &.today {
        border-color: #8b5cf6;
        border-width: 2px;
      }

      .day-name {
        font-size: 0.75rem;
        color: rgba(255, 255, 255, 0.6);
        margin-bottom: 0.5rem;
      }

      .day-status {
        font-size: 1.25rem;
        margin-bottom: 0.25rem;

        .check {
          color: #10b981;
        }

        .dot {
          color: rgba(255, 255, 255, 0.2);
        }
      }

      .day-minutes {
        font-size: 0.75rem;
        color: rgba(255, 255, 255, 0.8);
        font-weight: 500;
      }
    }

    .motivation-message {
      background: linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(236, 72, 153, 0.15));
      border: 1px solid rgba(139, 92, 246, 0.3);
      border-radius: 12px;
      padding: 1rem;
      text-align: center;
      color: rgba(255, 255, 255, 0.9);
      font-size: 0.875rem;
      line-height: 1.5;
    }

    .loading {
      text-align: center;
      padding: 2rem;
      color: rgba(255, 255, 255, 0.6);
    }
  `]
})
export class StreakBadgeComponent implements OnInit {
  private streakService = inject(StreakService);

  streakData = signal<StreakData | null>(null);
  dropdownOpen = signal(false);
  loading = signal(false);

  ngOnInit() {
    this.loadStreak();
  }

  loadStreak() {
    this.loading.set(true);
    this.streakService.getStreak().subscribe({
      next: (data) => {
        this.streakData.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load streak:', err);
        this.loading.set(false);
      }
    });
  }

  toggleDropdown() {
    this.dropdownOpen.update(v => !v);
  }

  getStreakClass(): string {
    const streak = this.streakData()?.currentStreak || 0;
    if (streak >= 15) return 'level-4';
    if (streak >= 8) return 'level-3';
    if (streak >= 4) return 'level-2';
    return 'level-1';
  }

  getProgressPercentage(minutes: number): number {
    const goal = 30; // Daily goal: 30 minutes
    return Math.min((minutes / goal) * 100, 100);
  }

  isToday(dateStr: string): boolean {
    const today = new Date().toISOString().split('T')[0];
    return dateStr === today;
  }

  getMotivationMessage(streak: number): string {
    if (streak === 0) return '💪 Bắt đầu streak của bạn hôm nay!';
    if (streak < 3) return '🌱 Bắt đầu tốt! Tiếp tục duy trì!';
    if (streak < 7) return '🔥 Tuyệt vời! Đang xây dựng thói quen!';
    if (streak < 14) return '⭐ Xuất sắc! Streak 1 tuần!';
    if (streak < 30) return '🏆 Phi thường! Bạn là huyền thoại!';
    return '👑 VUA STREAK! Không ai có thể ngăn bạn!';
  }
}
