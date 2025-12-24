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
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
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
