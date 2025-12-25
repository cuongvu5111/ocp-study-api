/**
 * Interface cho User.
 */
export interface User {
    id: string;
    username: string;
    fullName?: string;
    email?: string;
    role: string;
}

/**
 * Interface cho Topic từ API.
 */
export interface Topic {
    id: string;
    name: string;
    description: string;
    icon: string;
    month: number;
    orderIndex: number;
    estimatedDays: number;
    subtopics: Subtopic[];
    completedSubtopics: number;
    totalSubtopics: number;
    progressPercentage: number;
}

/**
 * Interface cho Subtopic.
 */
export interface Subtopic {
    id: string;
    topicId: string;
    name: string;
    description: string;
    difficulty: number;
    estimatedDays: number;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    orderIndex: number;
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
    completionPercentage: number;
}

/**
 * Interface cho Flashcard.
 */
export interface Flashcard {
    id: string;
    topicId: string;
    topicName: string;
    subtopicId?: string;
    subtopicName?: string;
    front: string;
    back: string;
    codeExample?: string;
    reviewCount: number;
    correctCount: number;
    nextReview?: string;
    createdAt: string;
}

/**
 * Interface cho Question (Quiz).
 */
export interface Question {
    id: string;
    topicId: string;
    topicName: string;
    content: string;
    codeSnippet?: string;
    questionType: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE';
    options: QuestionOption[];
    explanation?: string;
    difficulty: number;
}

export interface QuestionOption {
    id: string;
    optionKey: string;
    content: string;
    isCorrect?: boolean;
}

/**
 * Interface cho Dashboard data.
 */
export interface Dashboard {
    overallProgress: number;
    completedTopics: number;
    totalTopics: number;
    completedSubtopics: number;
    totalSubtopics: number;
    totalMinutesStudied: number;
    studyDays: number;
    currentStreak: number;
    totalFlashcards: number;
    flashcardsDue: number;
    totalQuestions: number;
    quizzesTaken: number;
    averageQuizScore: number;
    studyCalendar: StudyDay[];
    todaySubtopics: Subtopic[];
}

export interface StudyDay {
    date: string;
    minutesStudied: number;
    flashcardsReviewed: number;
    questionsAnswered: number;
    hasActivity: boolean;
}

/**
 * Interface cho Quiz submission.
 */
export interface QuizAnswer {
    questionId: string;
    selectedOptions: string[];
}

export interface QuizResult {
    score: number;
    totalQuestions: number;
    percentage: number;
    results: QuestionResult[];
}

export interface QuestionResult {
    questionId: string;
    questionContent: string;
    selectedOptions: string[];
    correctOptions: string[];
    isCorrect: boolean;
    explanation: string;
}

