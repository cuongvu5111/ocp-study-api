import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
    label: string;
    icon: string;
    route: string;
}

/**
 * Sidebar navigation component.
 * Hiển thị logo và menu điều hướng chính.
 */
@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [RouterLink, RouterLinkActive],
    template: `
    <aside class="sidebar">
      <!-- Logo -->
      <div class="sidebar__logo">
        <span class="logo-icon">☕</span>
        <div class="logo-text">
          <span class="logo-title">OCP Study</span>
          <span class="logo-subtitle">Java SE 11</span>
        </div>
      </div>
      
      <!-- Navigation -->
      <nav class="sidebar__nav">
        @for (item of navItems(); track item.route) {
          <a 
            [routerLink]="item.route" 
            routerLinkActive="active"
            class="nav-item"
          >
            <span class="material-icons-outlined nav-item__icon">{{ item.icon }}</span>
            <span class="nav-item__label">{{ item.label }}</span>
          </a>
        }
      </nav>
      
      <!-- Progress Summary -->
      <div class="sidebar__progress">
        <div class="progress-header">
          <span>Tiến độ tổng thể</span>
          <span class="progress-value">0%</span>
        </div>
        <div class="progress">
          <div class="progress__bar" style="width: 0%"></div>
        </div>
        <p class="progress-detail">0/12 topics hoàn thành</p>
      </div>
      
      <!-- Footer -->
      <div class="sidebar__footer">
        <div class="exam-info">
          <span class="material-icons-outlined">event</span>
          <div>
            <span class="exam-label">Kỳ thi mục tiêu</span>
            <span class="exam-date">1Z0-819</span>
          </div>
        </div>
      </div>
    </aside>
  `,
    styles: [`
    .sidebar {
      position: fixed;
      top: 0;
      left: 0;
      width: var(--sidebar-width);
      height: 100vh;
      background: var(--gradient-card);
      border-right: 1px solid var(--color-border);
      display: flex;
      flex-direction: column;
      z-index: 100;
    }
    
    .sidebar__logo {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
      padding: var(--spacing-6);
      border-bottom: 1px solid var(--color-border);
    }
    
    .logo-icon {
      font-size: 2rem;
    }
    
    .logo-text {
      display: flex;
      flex-direction: column;
    }
    
    .logo-title {
      font-size: var(--font-size-lg);
      font-weight: 700;
      color: var(--color-text-primary);
    }
    
    .logo-subtitle {
      font-size: var(--font-size-xs);
      color: var(--color-primary-light);
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    .sidebar__nav {
      flex: 1;
      padding: var(--spacing-4);
      display: flex;
      flex-direction: column;
      gap: var(--spacing-2);
    }
    
    .nav-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
      padding: var(--spacing-3) var(--spacing-4);
      color: var(--color-text-secondary);
      border-radius: var(--radius-lg);
      transition: all var(--transition-fast);
      text-decoration: none;
      
      &:hover {
        background-color: var(--color-bg-card-hover);
        color: var(--color-text-primary);
      }
      
      &.active {
        background: var(--gradient-primary);
        color: white;
        box-shadow: var(--shadow-md);
        
        .nav-item__icon {
          color: white;
        }
      }
    }
    
    .nav-item__icon {
      font-size: 22px;
      color: var(--color-text-muted);
    }
    
    .nav-item__label {
      font-weight: 500;
    }
    
    .sidebar__progress {
      padding: var(--spacing-6);
      border-top: 1px solid var(--color-border);
    }
    
    .progress-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: var(--spacing-2);
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
    }
    
    .progress-value {
      font-weight: 600;
      color: var(--color-primary-light);
    }
    
    .progress-detail {
      margin-top: var(--spacing-2);
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
    }
    
    .sidebar__footer {
      padding: var(--spacing-4) var(--spacing-6);
      border-top: 1px solid var(--color-border);
    }
    
    .exam-info {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
      color: var(--color-text-secondary);
      
      .material-icons-outlined {
        color: var(--color-accent);
      }
      
      div {
        display: flex;
        flex-direction: column;
      }
      
      .exam-label {
        font-size: var(--font-size-xs);
        color: var(--color-text-muted);
      }
      
      .exam-date {
        font-weight: 600;
        color: var(--color-text-primary);
      }
    }
    
    @media (max-width: 1024px) {
      .sidebar {
        transform: translateX(-100%);
      }
    }
  `]
})
export class SidebarComponent {
    navItems = signal<NavItem[]>([
        { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
        { label: 'Topics', icon: 'menu_book', route: '/topics' },
        { label: 'Flashcards', icon: 'style', route: '/flashcards' },
        { label: 'Quiz', icon: 'quiz', route: '/quiz' },
    ]);
}
