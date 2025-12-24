import { Component, signal, computed } from '@angular/core';

/**
 * Header component.
 * Hiển thị tiêu đề trang, search bar và user actions.
 */
@Component({
    selector: 'app-header',
    standalone: true,
    imports: [],
    template: `
    <header class="header">
      <div class="header__left">
        <button class="btn btn--ghost btn--icon mobile-menu">
          <span class="material-icons-outlined">menu</span>
        </button>
        <h1 class="header__title">{{ pageTitle() }}</h1>
      </div>
      
      <div class="header__center">
        <div class="search-box">
          <span class="material-icons-outlined search-icon">search</span>
          <input 
            type="text" 
            class="search-input" 
            placeholder="Tìm kiếm topics, flashcards..."
          />
          <kbd class="search-shortcut">⌘K</kbd>
        </div>
      </div>
      
      <div class="header__right">
        <!-- Streak Badge -->
        <div class="streak-badge" title="Study streak">
          <span class="material-icons-outlined">local_fire_department</span>
          <span class="streak-count">{{ streak() }}</span>
        </div>
        
        <!-- Notifications -->
        <button class="btn btn--ghost btn--icon" title="Thông báo">
          <span class="material-icons-outlined">notifications</span>
          @if (notifications() > 0) {
            <span class="notification-badge">{{ notifications() }}</span>
          }
        </button>
        
        <!-- User Avatar -->
        <div class="user-avatar" title="Tài khoản">
          <span>👤</span>
        </div>
      </div>
    </header>
  `,
    styles: [`
    .header {
      position: fixed;
      top: 0;
      right: 0;
      left: var(--sidebar-width);
      height: var(--header-height);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 var(--spacing-6);
      background-color: rgba(15, 15, 35, 0.85);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid var(--color-border);
      z-index: 50;
    }
    
    .header__left {
      display: flex;
      align-items: center;
      gap: var(--spacing-4);
    }
    
    .mobile-menu {
      display: none;
    }
    
    .header__title {
      font-size: var(--font-size-xl);
      font-weight: 600;
    }
    
    .header__center {
      flex: 1;
      max-width: 480px;
      margin: 0 var(--spacing-6);
    }
    
    .search-box {
      position: relative;
      display: flex;
      align-items: center;
    }
    
    .search-icon {
      position: absolute;
      left: var(--spacing-4);
      color: var(--color-text-muted);
      font-size: 20px;
    }
    
    .search-input {
      width: 100%;
      padding: var(--spacing-3) var(--spacing-4);
      padding-left: calc(var(--spacing-4) + 28px);
      padding-right: calc(var(--spacing-4) + 40px);
      background-color: var(--color-bg-secondary);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      color: var(--color-text-primary);
      font-size: var(--font-size-sm);
      transition: all var(--transition-fast);
      
      &::placeholder {
        color: var(--color-text-muted);
      }
      
      &:focus {
        outline: none;
        border-color: var(--color-primary);
        background-color: var(--color-bg-tertiary);
      }
    }
    
    .search-shortcut {
      position: absolute;
      right: var(--spacing-3);
      padding: var(--spacing-1) var(--spacing-2);
      font-size: var(--font-size-xs);
      font-family: var(--font-mono);
      color: var(--color-text-muted);
      background-color: var(--color-bg-tertiary);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
    }
    
    .header__right {
      display: flex;
      align-items: center;
      gap: var(--spacing-4);
    }
    
    .streak-badge {
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
      padding: var(--spacing-2) var(--spacing-3);
      background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
      border-radius: var(--radius-full);
      color: white;
      font-weight: 600;
      font-size: var(--font-size-sm);
      
      .material-icons-outlined {
        font-size: 18px;
      }
    }
    
    .btn--icon {
      position: relative;
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
      background-color: var(--color-error);
      border-radius: var(--radius-full);
    }
    
    .user-avatar {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--gradient-primary);
      border-radius: var(--radius-full);
      font-size: 20px;
      cursor: pointer;
      transition: transform var(--transition-fast);
      
      &:hover {
        transform: scale(1.05);
      }
    }
    
    @media (max-width: 1024px) {
      .header {
        left: 0;
      }
      
      .mobile-menu {
        display: flex;
      }
      
      .header__center {
        display: none;
      }
    }
  `]
})
export class HeaderComponent {
    pageTitle = signal('Dashboard');
    streak = signal(5);
    notifications = signal(3);
}
