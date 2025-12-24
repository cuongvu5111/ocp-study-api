import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

/**
 * Dashboard component - Trang chính hiển thị tổng quan tiến độ học.
 */
@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="dashboard">
      <!-- Hero Section -->
      <section class="dashboard__hero">
        <div class="hero-content">
          <h1>Chào mừng trở lại! 👋</h1>
          <p>Tiếp tục hành trình chinh phục OCP Java SE 11</p>
        </div>
        <div class="hero-stats">
          <div class="stat-card stat-card--primary">
            <span class="stat-value">{{ overallProgress() }}%</span>
            <span class="stat-label">Hoàn thành</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">{{ daysStreak() }}</span>
            <span class="stat-label">Ngày streak</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">{{ flashcardsDue() }}</span>
            <span class="stat-label">Cards cần ôn</span>
          </div>
        </div>
      </section>
      
      <!-- Quick Actions -->
      <section class="dashboard__actions">
        <h2 class="section-title">Bắt đầu ngay</h2>
        <div class="action-grid">
          <a routerLink="/flashcards/review" class="action-card action-card--review">
            <span class="action-icon">🎴</span>
            <div class="action-info">
              <h3>Review Flashcards</h3>
              <p>{{ flashcardsDue() }} cards đang chờ</p>
            </div>
            <span class="material-icons-outlined">arrow_forward</span>
          </a>
          
          <a routerLink="/quiz" class="action-card action-card--quiz">
            <span class="action-icon">📝</span>
            <div class="action-info">
              <h3>Làm Quiz</h3>
              <p>Kiểm tra kiến thức</p>
            </div>
            <span class="material-icons-outlined">arrow_forward</span>
          </a>
          
          <a routerLink="/topics" class="action-card action-card--study">
            <span class="action-icon">📚</span>
            <div class="action-info">
              <h3>Tiếp tục học</h3>
              <p>{{ currentTopic() }}</p>
            </div>
            <span class="material-icons-outlined">arrow_forward</span>
          </a>
        </div>
      </section>
      
      <!-- Progress by Month -->
      <section class="dashboard__progress">
        <h2 class="section-title">Tiến độ theo tháng</h2>
        <div class="month-grid">
          @for (month of months(); track month.number) {
            <div class="month-card" [class.month-card--active]="month.isActive">
              <div class="month-header">
                <span class="month-icon">{{ month.icon }}</span>
                <div class="month-info">
                  <h3>Tháng {{ month.number }}</h3>
                  <span class="month-phase">{{ month.phase }}</span>
                </div>
              </div>
              <div class="month-topics">
                @for (topic of month.topics; track topic) {
                  <span class="topic-tag">{{ topic }}</span>
                }
              </div>
              <div class="month-progress">
                <div class="progress">
                  <div class="progress__bar" [style.width.%]="month.progress"></div>
                </div>
                <span class="progress-text">{{ month.progress }}%</span>
              </div>
            </div>
          }
        </div>
      </section>
      
      <!-- Study Calendar (Heatmap) -->
      <section class="dashboard__calendar">
        <h2 class="section-title">Lịch học tập</h2>
        <div class="calendar-container">
          <div class="calendar-heatmap">
            @for (day of calendarDays(); track $index) {
              <div 
                class="calendar-day" 
                [class.has-activity]="day.hasActivity"
                [class.today]="day.isToday"
                [title]="day.date + ': ' + day.minutes + ' phút'"
              ></div>
            }
          </div>
          <div class="calendar-legend">
            <span>Ít</span>
            <div class="legend-scale">
              <div class="legend-item level-0"></div>
              <div class="legend-item level-1"></div>
              <div class="legend-item level-2"></div>
              <div class="legend-item level-3"></div>
              <div class="legend-item level-4"></div>
            </div>
            <span>Nhiều</span>
          </div>
        </div>
      </section>
      
      <!-- Exam Info -->
      <section class="dashboard__exam">
        <div class="exam-card">
          <div class="exam-header">
            <span class="material-icons-outlined">school</span>
            <h2>Thông tin kỳ thi</h2>
          </div>
          <div class="exam-details">
            <div class="exam-detail">
              <span class="detail-label">Exam Code</span>
              <span class="detail-value">1Z0-819</span>
            </div>
            <div class="exam-detail">
              <span class="detail-label">Thời gian</span>
              <span class="detail-value">90 phút</span>
            </div>
            <div class="exam-detail">
              <span class="detail-label">Số câu hỏi</span>
              <span class="detail-value">50 câu</span>
            </div>
            <div class="exam-detail">
              <span class="detail-label">Điểm đạt</span>
              <span class="detail-value highlight">68%</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
    styles: [`
    .dashboard {
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .section-title {
      font-size: var(--font-size-xl);
      margin-bottom: var(--spacing-6);
      color: var(--color-text-primary);
    }
    
    // Hero Section
    .dashboard__hero {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-8);
      background: var(--gradient-card);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-2xl);
      margin-bottom: var(--spacing-8);
    }
    
    .hero-content h1 {
      font-size: var(--font-size-3xl);
      margin-bottom: var(--spacing-2);
    }
    
    .hero-content p {
      color: var(--color-text-secondary);
      margin: 0;
    }
    
    .hero-stats {
      display: flex;
      gap: var(--spacing-4);
    }
    
    .stat-card {
      background-color: var(--color-bg-secondary);
      padding: var(--spacing-5);
      border-radius: var(--radius-xl);
      text-align: center;
      min-width: 120px;
      
      &--primary {
        background: var(--gradient-primary);
      }
    }
    
    .stat-value {
      display: block;
      font-size: var(--font-size-2xl);
      font-weight: 700;
      color: var(--color-text-primary);
    }
    
    .stat-label {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
      
      .stat-card--primary & {
        color: rgba(255, 255, 255, 0.8);
      }
    }
    
    // Quick Actions
    .dashboard__actions {
      margin-bottom: var(--spacing-8);
    }
    
    .action-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--spacing-6);
    }
    
    .action-card {
      display: flex;
      align-items: center;
      gap: var(--spacing-4);
      padding: var(--spacing-5);
      background: var(--gradient-card);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-xl);
      text-decoration: none;
      transition: all var(--transition-normal);
      
      &:hover {
        transform: translateY(-2px);
        border-color: var(--color-primary);
        box-shadow: var(--shadow-lg);
      }
      
      &--review { border-left: 4px solid var(--color-primary); }
      &--quiz { border-left: 4px solid var(--color-secondary); }
      &--study { border-left: 4px solid var(--color-accent); }
    }
    
    .action-icon {
      font-size: 2.5rem;
    }
    
    .action-info {
      flex: 1;
      
      h3 {
        font-size: var(--font-size-lg);
        margin-bottom: var(--spacing-1);
      }
      
      p {
        font-size: var(--font-size-sm);
        color: var(--color-text-muted);
        margin: 0;
      }
    }
    
    .action-card .material-icons-outlined {
      color: var(--color-text-muted);
    }
    
    // Progress by Month
    .dashboard__progress {
      margin-bottom: var(--spacing-8);
    }
    
    .month-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--spacing-4);
    }
    
    .month-card {
      padding: var(--spacing-5);
      background: var(--gradient-card);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-xl);
      
      &--active {
        border-color: var(--color-primary);
        box-shadow: var(--shadow-glow);
      }
    }
    
    .month-header {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
      margin-bottom: var(--spacing-4);
    }
    
    .month-icon {
      font-size: 1.5rem;
    }
    
    .month-info h3 {
      font-size: var(--font-size-base);
      margin-bottom: var(--spacing-1);
    }
    
    .month-phase {
      font-size: var(--font-size-xs);
      color: var(--color-primary-light);
    }
    
    .month-topics {
      display: flex;
      flex-wrap: wrap;
      gap: var(--spacing-2);
      margin-bottom: var(--spacing-4);
    }
    
    .topic-tag {
      padding: var(--spacing-1) var(--spacing-2);
      font-size: var(--font-size-xs);
      background-color: var(--color-bg-secondary);
      border-radius: var(--radius-sm);
      color: var(--color-text-secondary);
    }
    
    .month-progress {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
      
      .progress {
        flex: 1;
      }
    }
    
    .progress-text {
      font-size: var(--font-size-sm);
      font-weight: 600;
      color: var(--color-text-secondary);
    }
    
    // Calendar Heatmap
    .dashboard__calendar {
      margin-bottom: var(--spacing-8);
    }
    
    .calendar-container {
      padding: var(--spacing-6);
      background: var(--gradient-card);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-xl);
    }
    
    .calendar-heatmap {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 4px;
      margin-bottom: var(--spacing-4);
    }
    
    .calendar-day {
      aspect-ratio: 1;
      background-color: var(--color-bg-secondary);
      border-radius: var(--radius-sm);
      
      &.has-activity {
        background-color: var(--color-primary);
      }
      
      &.today {
        border: 2px solid var(--color-accent);
      }
    }
    
    .calendar-legend {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: var(--spacing-2);
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
    }
    
    .legend-scale {
      display: flex;
      gap: 2px;
    }
    
    .legend-item {
      width: 12px;
      height: 12px;
      border-radius: 2px;
      
      &.level-0 { background-color: var(--color-bg-tertiary); }
      &.level-1 { background-color: rgba(99, 102, 241, 0.3); }
      &.level-2 { background-color: rgba(99, 102, 241, 0.5); }
      &.level-3 { background-color: rgba(99, 102, 241, 0.7); }
      &.level-4 { background-color: var(--color-primary); }
    }
    
    // Exam Info
    .dashboard__exam {
      margin-bottom: var(--spacing-8);
    }
    
    .exam-card {
      padding: var(--spacing-6);
      background: var(--gradient-card);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-xl);
    }
    
    .exam-header {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
      margin-bottom: var(--spacing-6);
      
      .material-icons-outlined {
        font-size: 28px;
        color: var(--color-accent);
      }
      
      h2 {
        font-size: var(--font-size-xl);
        margin: 0;
      }
    }
    
    .exam-details {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: var(--spacing-4);
    }
    
    .exam-detail {
      text-align: center;
      padding: var(--spacing-4);
      background-color: var(--color-bg-secondary);
      border-radius: var(--radius-lg);
    }
    
    .detail-label {
      display: block;
      font-size: var(--font-size-sm);
      color: var(--color-text-muted);
      margin-bottom: var(--spacing-2);
    }
    
    .detail-value {
      font-size: var(--font-size-xl);
      font-weight: 700;
      color: var(--color-text-primary);
      
      &.highlight {
        color: var(--color-success);
      }
    }
    
    // Responsive
    @media (max-width: 1024px) {
      .dashboard__hero {
        flex-direction: column;
        text-align: center;
        gap: var(--spacing-6);
      }
      
      .action-grid, .month-grid {
        grid-template-columns: 1fr;
      }
      
      .exam-details {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
    overallProgress = signal(15);
    daysStreak = signal(5);
    flashcardsDue = signal(12);
    currentTopic = signal('Lambda & Streams');

    months = signal([
        {
            number: 1,
            phase: 'Foundation',
            icon: '📘',
            topics: ['Data Types', 'Control Flow'],
            progress: 100,
            isActive: false
        },
        {
            number: 2,
            phase: 'OOP Deep Dive',
            icon: '📗',
            topics: ['OOP', 'Interfaces'],
            progress: 75,
            isActive: true
        },
        {
            number: 3,
            phase: 'Core',
            icon: '📙',
            topics: ['Exceptions', 'Collections'],
            progress: 0,
            isActive: false
        },
        {
            number: 4,
            phase: 'Advanced',
            icon: '📕',
            topics: ['Lambda', 'Streams'],
            progress: 0,
            isActive: false
        },
        {
            number: 5,
            phase: 'Expert',
            icon: '📓',
            topics: ['I/O', 'Concurrency', 'Modules'],
            progress: 0,
            isActive: false
        },
        {
            number: 6,
            phase: 'Final',
            icon: '📔',
            topics: ['JDBC', 'Security', 'Mock Exams'],
            progress: 0,
            isActive: false
        },
    ]);

    calendarDays = signal(this.generateCalendarDays());

    ngOnInit() {
        // Load data from API when ready
    }

    private generateCalendarDays() {
        const days = [];
        const today = new Date();

        for (let i = 27; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);

            days.push({
                date: date.toLocaleDateString('vi-VN'),
                minutes: Math.random() > 0.5 ? Math.floor(Math.random() * 120) : 0,
                hasActivity: Math.random() > 0.4,
                isToday: i === 0
            });
        }

        return days;
    }
}
