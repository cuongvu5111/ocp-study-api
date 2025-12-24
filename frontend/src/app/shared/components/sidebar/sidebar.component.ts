import { Component, signal, inject, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  adminOnly?: boolean;
}

/**
 * Sidebar navigation component.
 * Hiển thị logo, menu điều hướng, user info và logout.
 */
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
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
        @for (item of filteredNavItems(); track item.route) {
          <a 
            [routerLink]="item.route" 
            routerLinkActive="active"
            class="nav-item"
          >
            <span class="material-icons-outlined nav-item__icon">{{ item.icon }}</span>
            <span class="nav-item__label">{{ item.label }}</span>
          </a>
        }
        
        <!-- Admin Section -->
        @if (authService.isAdmin()) {
        <div class="nav-divider">
          <span>Admin</span>
        </div>
        @for (item of adminNavItems(); track item.route) {
          <a 
            [routerLink]="item.route" 
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: true }"
            class="nav-item nav-item--admin"
          >
            <span class="material-icons-outlined nav-item__icon">{{ item.icon }}</span>
            <span class="nav-item__label">{{ item.label }}</span>
          </a>
        }
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
      overflow-y: auto;
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
    
    .nav-item--admin {
      &.active {
        background: linear-gradient(135deg, #f59e0b, #d97706);
      }
    }
    
    .nav-item__icon {
      font-size: 22px;
      color: var(--color-text-muted);
    }
    
    .nav-item__label {
      font-weight: 500;
    }
    
    .nav-divider {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
      padding: var(--spacing-4) var(--spacing-4) var(--spacing-2);
      font-size: var(--font-size-xs);
      color: var(--color-accent);
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 600;
      
      &::after {
        content: '';
        flex: 1;
        height: 1px;
        background: var(--color-border);
      }
    }
    
    .sidebar__progress {
      padding: var(--spacing-4) var(--spacing-6);
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
    
    .sidebar__user {
      padding: var(--spacing-4) var(--spacing-6);
      border-top: 1px solid var(--color-border);
    }
    
    .user-info {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
    }
    
    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--gradient-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      
      .material-icons-outlined {
        color: white;
        font-size: 20px;
      }
    }
    
    .user-details {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    
    .user-name {
      font-weight: 600;
      color: var(--color-text-primary);
      font-size: var(--font-size-sm);
    }
    
    .user-role {
      font-size: var(--font-size-xs);
      color: var(--color-accent);
      text-transform: uppercase;
    }
    
    .btn-logout {
      width: 36px;
      height: 36px;
      border-radius: var(--radius-lg);
      background: transparent;
      border: 1px solid var(--color-border);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all var(--transition-fast);
      
      .material-icons-outlined {
        font-size: 18px;
        color: var(--color-text-muted);
      }
      
      &:hover {
        background: var(--color-error);
        border-color: var(--color-error);
        
        .material-icons-outlined {
          color: white;
        }
      }
    }
    
    .btn--full {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-2);
    }
    
    @media (max-width: 1024px) {
      .sidebar {
        transform: translateX(-100%);
      }
    }
  `]
})
export class SidebarComponent {
  authService = inject(AuthService);

  navItems = signal<NavItem[]>([
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Topics', icon: 'menu_book', route: '/topics' },
    { label: 'Flashcards', icon: 'style', route: '/flashcards' },
    { label: 'Quiz', icon: 'quiz', route: '/quiz' },
  ]);

  adminNavItems = signal<NavItem[]>([
    { label: 'Tạo câu hỏi', icon: 'add_circle', route: '/admin/questions/create' },
    { label: 'Import CSV', icon: 'upload_file', route: '/admin/questions/import' },
    { label: 'Quản lý câu hỏi', icon: 'list_alt', route: '/admin/questions' },
  ]);

  filteredNavItems = computed(() => this.navItems());

  logout(): void {
    this.authService.logout();
  }
}
