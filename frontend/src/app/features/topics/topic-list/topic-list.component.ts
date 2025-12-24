import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Topic {
    id: number;
    name: string;
    description: string;
    icon: string;
    month: number;
    estimatedDays: number;
    completedSubtopics: number;
    totalSubtopics: number;
    progressPercentage: number;
}

/**
 * Topic List component - Hiển thị danh sách 12 topics OCP.
 */
@Component({
    selector: 'app-topic-list',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="topic-list">
      <header class="page-header">
        <div>
          <h1>Topics OCP Java SE 11</h1>
          <p>12 chủ đề cần master để đạt chứng chỉ 1Z0-819</p>
        </div>
        <div class="header-stats">
          <span class="stat">
            <strong>{{ completedTopics() }}</strong>/12 hoàn thành
          </span>
        </div>
      </header>
      
      <!-- Filter by Month -->
      <div class="month-filter">
        <button 
          class="filter-btn" 
          [class.active]="selectedMonth() === 0"
          (click)="selectedMonth.set(0)"
        >
          Tất cả
        </button>
        @for (m of [1, 2, 3, 4, 5, 6]; track m) {
          <button 
            class="filter-btn"
            [class.active]="selectedMonth() === m"
            (click)="selectedMonth.set(m)"
          >
            Tháng {{ m }}
          </button>
        }
      </div>
      
      <!-- Topics Grid -->
      <div class="topics-grid">
        @for (topic of filteredTopics(); track topic.id) {
          <a [routerLink]="['/topics', topic.id]" class="topic-card animate-fade-in">
            <div class="topic-header">
              <span class="topic-icon">{{ topic.icon }}</span>
              <span class="topic-month">Tháng {{ topic.month }}</span>
            </div>
            
            <h3 class="topic-name">{{ topic.name }}</h3>
            <p class="topic-description">{{ topic.description }}</p>
            
            <div class="topic-meta">
              <span class="meta-item">
                <span class="material-icons-outlined">schedule</span>
                {{ topic.estimatedDays }} ngày
              </span>
              <span class="meta-item">
                <span class="material-icons-outlined">checklist</span>
                {{ topic.completedSubtopics }}/{{ topic.totalSubtopics }}
              </span>
            </div>
            
            <div class="topic-progress">
              <div class="progress" [class.progress--success]="topic.progressPercentage === 100">
                <div 
                  class="progress__bar" 
                  [style.width.%]="topic.progressPercentage"
                ></div>
              </div>
              <span class="progress-label">{{ topic.progressPercentage }}%</span>
            </div>
          </a>
        }
      </div>
    </div>
  `,
    styles: [`
    .topic-list {
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--spacing-6);
      
      h1 {
        margin-bottom: var(--spacing-2);
      }
      
      p {
        color: var(--color-text-secondary);
        margin: 0;
      }
    }
    
    .header-stats .stat {
      padding: var(--spacing-3) var(--spacing-4);
      background: var(--gradient-primary);
      border-radius: var(--radius-lg);
      color: white;
      
      strong {
        font-size: var(--font-size-xl);
      }
    }
    
    .month-filter {
      display: flex;
      gap: var(--spacing-2);
      margin-bottom: var(--spacing-6);
      flex-wrap: wrap;
    }
    
    .filter-btn {
      padding: var(--spacing-2) var(--spacing-4);
      font-size: var(--font-size-sm);
      font-weight: 500;
      color: var(--color-text-secondary);
      background-color: var(--color-bg-card);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-full);
      cursor: pointer;
      transition: all var(--transition-fast);
      
      &:hover {
        border-color: var(--color-primary);
        color: var(--color-text-primary);
      }
      
      &.active {
        background: var(--gradient-primary);
        border-color: transparent;
        color: white;
      }
    }
    
    .topics-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--spacing-6);
    }
    
    .topic-card {
      display: flex;
      flex-direction: column;
      padding: var(--spacing-6);
      background: var(--gradient-card);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-xl);
      text-decoration: none;
      transition: all var(--transition-normal);
      
      &:hover {
        transform: translateY(-4px);
        border-color: var(--color-primary);
        box-shadow: var(--shadow-lg);
      }
    }
    
    .topic-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-4);
    }
    
    .topic-icon {
      font-size: 2rem;
    }
    
    .topic-month {
      padding: var(--spacing-1) var(--spacing-3);
      font-size: var(--font-size-xs);
      font-weight: 600;
      color: var(--color-primary-light);
      background-color: rgba(99, 102, 241, 0.2);
      border-radius: var(--radius-full);
    }
    
    .topic-name {
      font-size: var(--font-size-lg);
      margin-bottom: var(--spacing-2);
      color: var(--color-text-primary);
    }
    
    .topic-description {
      flex: 1;
      font-size: var(--font-size-sm);
      color: var(--color-text-muted);
      margin-bottom: var(--spacing-4);
      line-height: 1.5;
    }
    
    .topic-meta {
      display: flex;
      gap: var(--spacing-4);
      margin-bottom: var(--spacing-4);
    }
    
    .meta-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-1);
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
      
      .material-icons-outlined {
        font-size: 16px;
      }
    }
    
    .topic-progress {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
      
      .progress {
        flex: 1;
      }
    }
    
    .progress-label {
      font-size: var(--font-size-sm);
      font-weight: 600;
      color: var(--color-text-secondary);
      min-width: 40px;
      text-align: right;
    }
    
    @media (max-width: 1024px) {
      .topics-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    
    @media (max-width: 640px) {
      .topics-grid {
        grid-template-columns: 1fr;
      }
      
      .page-header {
        flex-direction: column;
        gap: var(--spacing-4);
      }
    }
  `]
})
export class TopicListComponent {
    selectedMonth = signal(0);
    completedTopics = signal(1);

    topics = signal<Topic[]>([
        { id: 1, name: 'Working with Java Data Types', description: 'Primitives, wrapper classes, operators, String, StringBuilder, và var keyword', icon: '📘', month: 1, estimatedDays: 8, completedSubtopics: 4, totalSubtopics: 4, progressPercentage: 100 },
        { id: 2, name: 'Controlling Program Flow', description: 'If/else, switch, loops, break, continue statements', icon: '📘', month: 1, estimatedDays: 3, completedSubtopics: 2, totalSubtopics: 3, progressPercentage: 67 },
        { id: 3, name: 'Java Object-Oriented Approach', description: 'Classes, objects, inheritance, polymorphism, interfaces, nested classes', icon: '📗', month: 2, estimatedDays: 20, completedSubtopics: 3, totalSubtopics: 7, progressPercentage: 43 },
        { id: 4, name: 'Exception Handling', description: 'Try/catch, try-with-resources, custom exceptions, assertions', icon: '📙', month: 3, estimatedDays: 7, completedSubtopics: 0, totalSubtopics: 5, progressPercentage: 0 },
        { id: 5, name: 'Arrays and Collections', description: 'Arrays, List, Set, Map, Deque, Generics, Comparator', icon: '📙', month: 3, estimatedDays: 13, completedSubtopics: 0, totalSubtopics: 5, progressPercentage: 0 },
        { id: 6, name: 'Lambda Expressions & Streams', description: 'Lambda syntax, functional interfaces, Stream API, Collectors', icon: '📕', month: 4, estimatedDays: 18, completedSubtopics: 0, totalSubtopics: 5, progressPercentage: 0 },
        { id: 7, name: 'Java I/O API', description: 'I/O Streams, Serialization, java.nio.file API', icon: '📓', month: 5, estimatedDays: 8, completedSubtopics: 0, totalSubtopics: 3, progressPercentage: 0 },
        { id: 8, name: 'Concurrency', description: 'Threads, ExecutorService, synchronization, concurrent collections', icon: '📓', month: 5, estimatedDays: 14, completedSubtopics: 0, totalSubtopics: 5, progressPercentage: 0 },
        { id: 9, name: 'Java Platform Module System', description: 'Modules, module-info.java, exports, requires, services', icon: '📓', month: 5, estimatedDays: 7, completedSubtopics: 0, totalSubtopics: 3, progressPercentage: 0 },
        { id: 10, name: 'Database Applications with JDBC', description: 'Connection, Statement, PreparedStatement, ResultSet, Transactions', icon: '📔', month: 6, estimatedDays: 5, completedSubtopics: 0, totalSubtopics: 3, progressPercentage: 0 },
        { id: 11, name: 'Secure Coding in Java SE Application', description: 'Input validation, DoS prevention, resource access security', icon: '📔', month: 6, estimatedDays: 3, completedSubtopics: 0, totalSubtopics: 3, progressPercentage: 0 },
        { id: 12, name: 'Annotations', description: 'Built-in annotations, custom annotations, annotation processing', icon: '📔', month: 6, estimatedDays: 3, completedSubtopics: 0, totalSubtopics: 3, progressPercentage: 0 },
    ]);

    filteredTopics = () => {
        const month = this.selectedMonth();
        if (month === 0) return this.topics();
        return this.topics().filter(t => t.month === month);
    };
}
