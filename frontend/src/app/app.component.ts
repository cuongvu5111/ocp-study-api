import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { HeaderComponent } from './shared/components/header/header.component';

/**
 * Root component của ứng dụng OCP Study.
 * Layout gồm Sidebar bên trái và main content bên phải.
 */
@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, SidebarComponent, HeaderComponent],
    template: `
    <div class="app-layout">
      <app-sidebar />
      <div class="app-main">
        <app-header />
        <main class="app-content">
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
    
    .app-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      margin-left: var(--sidebar-width);
      background-color: var(--color-bg-primary);
    }
    
    .app-content {
      flex: 1;
      padding: var(--spacing-6);
      margin-top: var(--header-height);
      overflow-y: auto;
    }
    
    @media (max-width: 1024px) {
      .app-main {
        margin-left: 0;
      }
    }
  `]
})
export class AppComponent {
    title = 'OCP Java SE 11 Study App';
}
