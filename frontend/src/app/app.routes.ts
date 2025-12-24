import { Routes } from '@angular/router';
import { adminGuard, authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    // Auth routes (public)
    {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component')
            .then(m => m.LoginComponent),
        title: 'Đăng nhập - OCP Study'
    },
    {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register.component')
            .then(m => m.RegisterComponent),
        title: 'Đăng ký - OCP Study'
    },
    // Main routes (require login)
    {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component')
            .then(m => m.DashboardComponent),
        canActivate: [authGuard],
        title: 'Dashboard - OCP Study'
    },
    {
        path: 'topics',
        loadComponent: () => import('./features/topics/topic-list/topic-list.component')
            .then(m => m.TopicListComponent),
        canActivate: [authGuard],
        title: 'Topics - OCP Study'
    },
    {
        path: 'topics/:id',
        loadComponent: () => import('./features/topics/topic-detail/topic-detail.component')
            .then(m => m.TopicDetailComponent),
        canActivate: [authGuard],
        title: 'Topic Detail - OCP Study'
    },
    {
        path: 'flashcards',
        loadComponent: () => import('./features/flashcards/flashcard-list/flashcard-list.component')
            .then(m => m.FlashcardListComponent),
        canActivate: [authGuard],
        title: 'Flashcards - OCP Study'
    },
    {
        path: 'flashcards/review',
        loadComponent: () => import('./features/flashcards/flashcard-review/flashcard-review.component')
            .then(m => m.FlashcardReviewComponent),
        canActivate: [authGuard],
        title: 'Review Flashcards - OCP Study'
    },
    {
        path: 'quiz/session',
        loadComponent: () => import('./features/quiz/quiz-session/quiz-session.component')
            .then(m => m.QuizSessionComponent),
        canActivate: [authGuard],
        title: 'Quiz Session - OCP Study'
    },
    {
        path: 'quiz',
        loadComponent: () => import('./features/quiz/quiz-start/quiz-start.component')
            .then(m => m.QuizStartComponent),
        canActivate: [authGuard],
        title: 'Quiz - OCP Study'
    },
    // Admin routes
    {
        path: 'admin/questions/create',
        loadComponent: () => import('./features/admin/question-create/question-create.component')
            .then(m => m.QuestionCreateComponent),
        canActivate: [adminGuard],
        title: 'Tạo câu hỏi - Admin'
    },
    {
        path: 'admin/questions/import',
        loadComponent: () => import('./features/admin/question-import/question-import.component')
            .then(m => m.QuestionImportComponent),
        canActivate: [adminGuard],
        title: 'Import CSV - Admin'
    },
    {
        path: 'admin/questions',
        loadComponent: () => import('./features/admin/question-list/question-list.component')
            .then(m => m.QuestionListComponent),
        canActivate: [adminGuard],
        title: 'Quản lý câu hỏi - Admin'
    },
    {
        path: 'admin/questions/edit/:id',
        loadComponent: () => import('./features/admin/question-edit/question-edit.component')
            .then(m => m.QuestionEditComponent),
        canActivate: [adminGuard],
        title: 'Sửa câu hỏi - Admin'
    },
    {
        path: '**',
        redirectTo: 'dashboard'
    }
];
