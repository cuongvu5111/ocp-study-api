import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    // Auth routes
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
    // Main routes
    {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component')
            .then(m => m.DashboardComponent),
        title: 'Dashboard - OCP Study'
    },
    {
        path: 'topics',
        loadComponent: () => import('./features/topics/topic-list/topic-list.component')
            .then(m => m.TopicListComponent),
        title: 'Topics - OCP Study'
    },
    {
        path: 'topics/:id',
        loadComponent: () => import('./features/topics/topic-detail/topic-detail.component')
            .then(m => m.TopicDetailComponent),
        title: 'Topic Detail - OCP Study'
    },
    {
        path: 'flashcards',
        loadComponent: () => import('./features/flashcards/flashcard-list/flashcard-list.component')
            .then(m => m.FlashcardListComponent),
        title: 'Flashcards - OCP Study'
    },
    {
        path: 'flashcards/review',
        loadComponent: () => import('./features/flashcards/flashcard-review/flashcard-review.component')
            .then(m => m.FlashcardReviewComponent),
        title: 'Review Flashcards - OCP Study'
    },
    {
        path: 'quiz/session',
        loadComponent: () => import('./features/quiz/quiz-session/quiz-session.component')
            .then(m => m.QuizSessionComponent),
        title: 'Quiz Session - OCP Study'
    },
    {
        path: 'quiz',
        loadComponent: () => import('./features/quiz/quiz-start/quiz-start.component')
            .then(m => m.QuizStartComponent),
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
        path: '**',
        redirectTo: 'dashboard'
    }
];
