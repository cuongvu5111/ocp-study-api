import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
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
        path: 'quiz',
        loadComponent: () => import('./features/quiz/quiz-start/quiz-start.component')
            .then(m => m.QuizStartComponent),
        title: 'Quiz - OCP Study'
    },
    {
        path: '**',
        redirectTo: 'dashboard'
    }
];
