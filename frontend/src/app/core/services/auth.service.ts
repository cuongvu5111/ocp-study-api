import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../../models';

export interface AuthResponse {
    token: string;
    username: string;
    fullName?: string;
    email: string;
    role: string;
    message: string;
}

/**
 * AuthService - Quản lý authentication và JWT tokens.
 */
@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private router = inject(Router);

    private baseUrl = environment.apiUrl;
    private tokenKey = 'ocp_auth_token';
    private userKey = 'ocp_user';

    currentUser = signal<User | null>(null);
    isLoggedIn = signal<boolean>(false);

    constructor() {
        this.loadUserFromStorage();
    }

    private loadUserFromStorage(): void {
        const token = this.getToken();
        const userJson = localStorage.getItem(this.userKey);
        if (token && userJson) {
            this.currentUser.set(JSON.parse(userJson));
            this.isLoggedIn.set(true);
        }
    }

    /**
     * Login - gửi credentials và nhận JWT token
     */
    login(username: string, password: string): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, {
            username,
            password
        }).pipe(
            tap(response => {
                if (response.token) {
                    this.saveAuthData(response);
                }
            })
        );
    }

    /**
     * Register - tạo tài khoản mới
     */
    register(username: string, password: string, email?: string, fullName?: string): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/auth/register`, {
            username,
            fullName,
            password,
            email
        }).pipe(
            tap(response => {
                if (response.token) {
                    this.saveAuthData(response);
                }
            })
        );
    }

    /**
     * Logout - xóa token và user data
     */
    logout(): void {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);
        this.currentUser.set(null);
        this.isLoggedIn.set(false);
        this.router.navigate(['/login']);
    }

    /**
     * Get token from localStorage
     */
    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    /**
     * Check if current user is admin
     */
    isAdmin(): boolean {
        return this.currentUser()?.role === 'ADMIN';
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    private saveAuthData(response: AuthResponse): void {
        localStorage.setItem(this.tokenKey, response.token);
        const user: User = {
            id: 0, // Will be set from backend
            username: response.username,
            fullName: response.fullName,
            email: response.email,
            role: response.role
        };
        localStorage.setItem(this.userKey, JSON.stringify(user));
        this.currentUser.set(user);
        this.isLoggedIn.set(true);
    }
}
