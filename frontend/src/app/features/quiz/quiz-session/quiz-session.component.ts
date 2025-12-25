import { Component, OnInit, OnDestroy, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';

// Frontend Question format
interface Question {
    id: string;
    topicId: string;
    topicName: string;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation?: string;
    codeSnippet?: string;
    difficulty: number;
}

// API Response format
interface ApiQuestion {
    id: string;
    topicId: string;
    topicName: string;
    content: string;
    options: { id: string; optionKey: string; content: string; isCorrect: boolean }[];
    explanation?: string;
    codeSnippet?: string;
    difficulty: number;
}

/**
 * Quiz Session component - Làm quiz với timer và chấm điểm.
 */
@Component({
    selector: 'app-quiz-session',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './quiz-session.component.html',
    styleUrls: ['./quiz-session.component.scss']
})
export class QuizSessionComponent implements OnInit, OnDestroy {
    private apiService = inject(ApiService);
    private route = inject(ActivatedRoute);
    private timerInterval: any;

    loading = signal(true);
    questions = signal<Question[]>([]);
    currentIndex = signal(0);
    answers = signal<(number | undefined)[]>([]);
    showResult = signal(false);

    // Timer (seconds)
    totalTime = signal(600); // 10 minutes default
    remainingTime = signal(600);
    elapsedTime = signal(0);

    // Computed
    currentQuestion = computed(() => {
        const qs = this.questions();
        const idx = this.currentIndex();
        return qs.length > 0 ? qs[idx] : null;
    });

    correctCount = computed(() => {
        const qs = this.questions();
        const ans = this.answers();
        return qs.reduce((count, q, i) => {
            return count + (ans[i] === q.correctAnswer ? 1 : 0);
        }, 0);
    });

    score = computed(() => {
        const total = this.questions().length;
        return total > 0 ? Math.round((this.correctCount() / total) * 100) : 0;
    });

    ngOnInit() {
        const mode = this.route.snapshot.queryParamMap.get('mode') || 'quick';
        const topicId = this.route.snapshot.queryParamMap.get('topicId');

        let limit = 10;
        if (mode === 'mock') {
            limit = 50;
            this.totalTime.set(5400); // 90 minutes
            this.remainingTime.set(5400);
        }

        this.loadQuestions(topicId || undefined, limit);
    }

    ngOnDestroy() {
        this.stopTimer();
    }

    loadQuestions(topicId?: string, limit = 10) {
        this.loading.set(true);
        this.apiService.getQuizQuestions(topicId, limit).subscribe({
            next: (data: ApiQuestion[]) => {
                if (data.length === 0) {
                    // Mock data nếu API không có câu hỏi
                    this.questions.set(this.getMockQuestions());
                } else {
                    // Transform API response to frontend format
                    const transformed = data.map(q => this.transformApiQuestion(q));
                    this.questions.set(transformed);
                }
                this.answers.set(new Array(this.questions().length).fill(undefined));
                this.loading.set(false);
                this.startTimer();
            },
            error: (err) => {
                console.error('Error loading questions:', err);
                // Use mock data on error
                this.questions.set(this.getMockQuestions());
                this.answers.set(new Array(this.questions().length).fill(undefined));
                this.loading.set(false);
                this.startTimer();
            }
        });
    }

    /**
     * Transform API question format to frontend format
     */
    transformApiQuestion(apiQ: ApiQuestion): Question {
        // Find correct answer index
        let correctIndex = 0;
        const options = apiQ.options.map((opt, idx) => {
            if (opt.isCorrect) {
                correctIndex = idx;
            }
            return opt.content;
        });

        return {
            id: apiQ.id,
            topicId: apiQ.topicId,
            topicName: apiQ.topicName,
            question: apiQ.content,
            options: options,
            correctAnswer: correctIndex,
            explanation: apiQ.explanation,
            codeSnippet: apiQ.codeSnippet,
            difficulty: apiQ.difficulty
        };
    }

    getMockQuestions(): Question[] {
        return [
            {
                id: '1',
                topicId: '4',
                topicName: 'Lambda & Streams',
                question: 'Functional Interface là gì trong Java?',
                options: [
                    'Interface có nhiều abstract methods',
                    'Interface chỉ có duy nhất 1 abstract method',
                    'Interface không có method nào',
                    'Interface chỉ có static methods'
                ],
                correctAnswer: 1,
                difficulty: 1
            },
            {
                id: '2',
                topicId: '4',
                topicName: 'Lambda & Streams',
                question: 'Đoạn code sau sẽ output gì?',
                codeSnippet: 'List<Integer> nums = Arrays.asList(1, 2, 3);\nnums.stream()\n    .filter(n -> n > 1)\n    .forEach(System.out::println);',
                options: ['1 2 3', '2 3', '1', 'Compilation error'],
                correctAnswer: 1,
                difficulty: 2
            },
            {
                id: '3',
                topicId: '3',
                topicName: 'Exceptions',
                question: 'Checked Exception nào KHÔNG cần khai báo trong throws clause?',
                options: [
                    'IOException',
                    'SQLException',
                    'RuntimeException',
                    'FileNotFoundException'
                ],
                correctAnswer: 2,
                explanation: 'RuntimeException và subclasses là unchecked exceptions, không cần khai báo.',
                difficulty: 2
            },
            {
                id: '4',
                topicId: '6',
                topicName: 'Collections',
                question: 'HashMap vs TreeMap, cái nào có lookup time O(log n)?',
                options: [
                    'HashMap',
                    'TreeMap',
                    'Cả hai',
                    'Không cái nào'
                ],
                correctAnswer: 1,
                difficulty: 1
            },
            {
                id: '5',
                topicId: '8',
                topicName: 'Concurrency',
                question: 'Keyword nào đảm bảo visibility giữa các threads?',
                options: [
                    'static',
                    'final',
                    'volatile',
                    'transient'
                ],
                correctAnswer: 2,
                difficulty: 3
            }
        ];
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            const remaining = this.remainingTime();
            if (remaining > 0) {
                this.remainingTime.set(remaining - 1);
                this.elapsedTime.update(t => t + 1);
            } else {
                this.submitQuiz();
            }
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
    }

    formatTime(seconds: number): string {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    selectAnswer(optionIndex: number) {
        const current = [...this.answers()];
        current[this.currentIndex()] = optionIndex;
        this.answers.set(current);
    }

    prevQuestion() {
        if (this.currentIndex() > 0) {
            this.currentIndex.update(i => i - 1);
        }
    }

    nextQuestion() {
        if (this.currentIndex() < this.questions().length - 1) {
            this.currentIndex.update(i => i + 1);
        }
    }

    goToQuestion(index: number) {
        this.currentIndex.set(index);
    }

    submitQuiz() {
        this.stopTimer();
        this.showResult.set(true);

        // Prepare submission với đúng format backend expect
        const quizMode = this.route.snapshot.queryParamMap.get('mode') || 'quick';
        const topicId = this.route.snapshot.queryParamMap.get('topicId');

        const submission = {
            quizType: quizMode === 'mock' ? 'MOCK_EXAM' : quizMode === 'topic' ? 'TOPIC_QUIZ' : 'QUICK_QUIZ',
            topicId: topicId ? topicId : null,
            topicName: null, // TODO: get from topic if available
            totalQuestions: this.questions().length,
            correctAnswers: this.correctCount(),
            scorePercentage: this.score(),
            timeSpent: this.elapsedTime()
        };

        this.apiService.submitQuiz(submission).subscribe({
            next: (res) => console.log('Quiz saved:', res),
            error: (err) => console.error('Error submitting quiz:', err)
        });
    }

    restartQuiz() {
        this.showResult.set(false);
        this.currentIndex.set(0);
        this.answers.set(new Array(this.questions().length).fill(undefined));
        this.remainingTime.set(this.totalTime());
        this.elapsedTime.set(0);
        this.startTimer();
    }
}
