import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { AuthService } from './core/services/auth.service';

/**
 * Root component của ứng dụng OCP Study.
 * Layout: Với auth -> Sidebar + Header. Không auth -> chỉ content.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, HeaderComponent],
  template: `
    <div class="app-layout" [class.auth-layout]="!authService.isLoggedIn()">
      @if (authService.isLoggedIn()) {
      <app-sidebar />
      }
      <div class="app-main" [class.full-width]="!authService.isLoggedIn()">
        @if (authService.isLoggedIn()) {
        <app-header />
        }
        <main class="app-content" [class.centered]="!authService.isLoggedIn()">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: [`
    .app-layout {
      display: flex;
      min-height: 100vh;
    }
    
    .app-layout.auth-layout {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .app-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      margin-left: var(--sidebar-width);
      background-color: var(--color-bg-primary);
    }
    
    .app-main.full-width {
      margin-left: 0;
    }
    
    .app-content {
      flex: 1;
      padding: var(--spacing-6);
      margin-top: var(--header-height);
      overflow-y: auto;
    }
    
    .app-content.centered {
      margin-top: 0;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    @media (max-width: 1024px) {
      .app-main {
        margin-left: 0;
      }
    }
  `]
})
export class AppComponent {
  authService = inject(AuthService);
  title = 'OCP Java SE 11 Study App';
}
