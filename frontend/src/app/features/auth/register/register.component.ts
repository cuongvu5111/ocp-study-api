import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

/**
 * Register component - Form đăng ký.
 */
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1>🎯 VNPT Study</h1>
          <p>Tạo tài khoản mới</p>
        </div>

        <form (ngSubmit)="onRegister()" class="auth-form">
          <div class="form-group">
            <label for="fullName">Họ và tên</label>
            <input 
              type="text" 
              id="fullName" 
              [(ngModel)]="fullName" 
              name="fullName"
              placeholder="Nhập họ và tên"
              required
            />
          </div>

          <div class="form-group">
            <label for="username">Tài khoản</label>
            <input 
              type="text" 
              id="username" 
              [(ngModel)]="username" 
              name="username"
              placeholder="Nhập tài khoản"
              required
            />
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              [(ngModel)]="email" 
              name="email"
              placeholder="Nhập email"
            />
          </div>

          <div class="form-group">
            <label for="password">Mật khẩu</label>
            <input 
              type="password" 
              id="password" 
              [(ngModel)]="password" 
              name="password"
              placeholder="Nhập mật khẩu (min 8 ký tự)"
              required
            />
          </div>

          @if (error()) {
          <div class="error-message">{{ error() }}</div>
          }

          @if (success()) {
          <div class="success-message">{{ success() }}</div>
          }

          <button type="submit" class="btn btn--primary btn--full" [disabled]="loading()">
            @if (loading()) {
            <span class="spinner-sm"></span>
            } @else {
            Đăng ký
            }
          </button>
        </form>

        <div class="auth-footer">
          <p>Đã có tài khoản? <a routerLink="/login">Đăng nhập</a></p>
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
      max-width: 500px;
      background: var(--gradient-card);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-2xl);
      padding: var(--spacing-10);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }

    .auth-header {
      text-align: center;
      margin-bottom: var(--spacing-8);

      h1 {
        font-size: 2.5rem;
        margin-bottom: var(--spacing-2);
      }

      p {
        color: var(--color-text-muted);
        font-size: var(--font-size-lg);
      }
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-5);
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-2);

      label {
        font-weight: 500;
        color: var(--color-text-secondary);
        font-size: var(--font-size-base);
      }

      input {
        padding: var(--spacing-4) var(--spacing-5);
        background: var(--color-bg-secondary);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-lg);
        color: var(--color-text-primary);
        font-size: var(--font-size-lg);

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

    .success-message {
      padding: var(--spacing-3);
      background: rgba(34, 197, 94, 0.1);
      border: 1px solid var(--color-success);
      border-radius: var(--radius-lg);
      color: var(--color-success);
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
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  fullName = '';
  username = '';
  email = '';
  password = '';
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);

  onRegister(): void {
    if (!this.username || !this.password) {
      this.error.set('Vui lòng nhập username và password');
      return;
    }

    if (this.password.length < 8) {
      this.error.set('Password phải có ít nhất 8 ký tự');
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.success.set(null);

    this.authService.register(this.username, this.password, this.email, this.fullName).subscribe({
      next: (response) => {
        this.loading.set(false);
        if (response.token) {
          this.success.set('Đăng ký thành công!');
          setTimeout(() => this.router.navigate(['/certifications']), 1000);
        } else {
          this.error.set(response.message || 'Đăng ký thất bại');
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Đăng ký thất bại');
      }
    });
  }
}
