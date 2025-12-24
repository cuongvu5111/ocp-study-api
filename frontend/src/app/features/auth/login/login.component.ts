import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

/**
 * Login component - Form đăng nhập.
 */
@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1>🎯 OCP Study</h1>
          <p>Đăng nhập để tiếp tục</p>
        </div>

        <form (ngSubmit)="onLogin()" class="auth-form">
          <div class="form-group">
            <label for="username">Username</label>
            <input 
              type="text" 
              id="username" 
              [(ngModel)]="username" 
              name="username"
              placeholder="Nhập username"
              required
            />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input 
              type="password" 
              id="password" 
              [(ngModel)]="password" 
              name="password"
              placeholder="Nhập password"
              required
            />
          </div>

          @if (error()) {
          <div class="error-message">{{ error() }}</div>
          }

          <button type="submit" class="btn btn--primary btn--full" [disabled]="loading()">
            @if (loading()) {
            <span class="spinner-sm"></span>
            } @else {
            Đăng nhập
            }
          </button>
        </form>

        <div class="auth-footer">
          <p>Chưa có tài khoản? <a routerLink="/register">Đăng ký</a></p>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--spacing-4);
      background: var(--gradient-dark);
    }

    .auth-card {
      width: 100%;
      max-width: 400px;
      background: var(--gradient-card);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-2xl);
      padding: var(--spacing-8);
    }

    .auth-header {
      text-align: center;
      margin-bottom: var(--spacing-8);

      h1 {
        font-size: var(--font-size-2xl);
        margin-bottom: var(--spacing-2);
      }

      p {
        color: var(--color-text-muted);
      }
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-4);
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-2);

      label {
        font-weight: 500;
        color: var(--color-text-secondary);
      }

      input {
        padding: var(--spacing-3) var(--spacing-4);
        background: var(--color-bg-secondary);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-lg);
        color: var(--color-text-primary);
        font-size: var(--font-size-base);

        &:focus {
          outline: none;
          border-color: var(--color-primary);
        }
      }
    }

    .error-message {
      padding: var(--spacing-3);
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid var(--color-error);
      border-radius: var(--radius-lg);
      color: var(--color-error);
      font-size: var(--font-size-sm);
    }

    .btn--full {
      width: 100%;
      margin-top: var(--spacing-4);
    }

    .auth-footer {
      text-align: center;
      margin-top: var(--spacing-6);
      
      p {
        color: var(--color-text-muted);
      }

      a {
        color: var(--color-primary);
        text-decoration: none;
        font-weight: 500;

        &:hover {
          text-decoration: underline;
        }
      }
    }

    .spinner-sm {
      width: 20px;
      height: 20px;
      border: 2px solid transparent;
      border-top-color: currentColor;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class LoginComponent {
    private authService = inject(AuthService);
    private router = inject(Router);

    username = '';
    password = '';
    loading = signal(false);
    error = signal<string | null>(null);

    onLogin(): void {
        if (!this.username || !this.password) {
            this.error.set('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        this.loading.set(true);
        this.error.set(null);

        this.authService.login(this.username, this.password).subscribe({
            next: (response) => {
                this.loading.set(false);
                if (response.token) {
                    this.router.navigate(['/dashboard']);
                } else {
                    this.error.set(response.message || 'Đăng nhập thất bại');
                }
            },
            error: (err) => {
                this.loading.set(false);
                this.error.set(err.error?.message || 'Đăng nhập thất bại');
            }
        });
    }
}
