# OCP Java SE 11 Study System - Walkthrough

## Tổng Quan

Đã tạo thành công ứng dụng ôn thi OCP Java SE 11 (1Z0-819) với đầy đủ:
- **Study Curriculum 6 tháng** với 12 topics chi tiết
- **Web Application** full-stack (Angular + Spring Boot + PostgreSQL)

---

## Cấu Trúc Project

```
d:\www\ocp\
├── frontend/                          # Angular 17+ Application
│   ├── package.json
│   ├── angular.json
│   ├── tsconfig.json
│   └── src/
│       ├── main.ts
│       ├── index.html
│       ├── styles.scss                # Design System (Dark Theme)
│       └── app/
│           ├── app.component.ts
│           ├── app.routes.ts
│           ├── app.config.ts
│           ├── core/services/
│           │   └── api.service.ts
│           ├── shared/components/
│           │   ├── sidebar/
│           │   └── header/
│           ├── features/
│           │   ├── dashboard/
│           │   ├── topics/
│           │   ├── flashcards/
│           │   └── quiz/
│           └── models/
│
├── backend/                           # Spring Boot 3.2 Application
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/ocp/study/
│       │   ├── OcpStudyApplication.java
│       │   ├── config/CorsConfig.java
│       │   ├── entity/                # 7 entities
│       │   ├── repository/            # 6 repositories
│       │   ├── service/               # 4 services
│       │   ├── controller/            # 4 controllers
│       │   └── dto/                   # 6 DTOs
│       └── resources/
│           ├── application.yml
│           └── db/migration/
│               ├── V1__create_tables.sql
│               └── V2__seed_topics.sql
│
├── docker-compose.yml                 # PostgreSQL + pgAdmin
└── README.md
```

---

## Backend Components

### Entities (7 files)
| Entity | Mô tả |
|--------|-------|
| [Topic.java](file:///d:/www/ocp/backend/src/main/java/com/ocp/study/entity/Topic.java) | 12 topics OCP |
| [Subtopic.java](file:///d:/www/ocp/backend/src/main/java/com/ocp/study/entity/Subtopic.java) | Sub-topics với priority |
| [Flashcard.java](file:///d:/www/ocp/backend/src/main/java/com/ocp/study/entity/Flashcard.java) | Spaced Repetition |
| [Question.java](file:///d:/www/ocp/backend/src/main/java/com/ocp/study/entity/Question.java) | Quiz questions |
| [QuestionOption.java](file:///d:/www/ocp/backend/src/main/java/com/ocp/study/entity/QuestionOption.java) | Answer options |
| [TopicProgress.java](file:///d:/www/ocp/backend/src/main/java/com/ocp/study/entity/TopicProgress.java) | Progress tracking |
| [StudySession.java](file:///d:/www/ocp/backend/src/main/java/com/ocp/study/entity/StudySession.java) | Streak calendar |

### REST API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/topics` | Lấy danh sách topics |
| GET | `/api/topics/{id}` | Chi tiết topic |
| GET | `/api/flashcards` | Tất cả flashcards |
| POST | `/api/flashcards` | Tạo flashcard |
| POST | `/api/flashcards/{id}/review` | Mark reviewed |
| POST | `/api/progress/subtopic/{id}/status` | Update progress |
| GET | `/api/dashboard` | Dashboard stats |

### Database Migrations
- [V1__create_tables.sql](file:///d:/www/ocp/backend/src/main/resources/db/migration/V1__create_tables.sql) - Schema
- [V2__seed_topics.sql](file:///d:/www/ocp/backend/src/main/resources/db/migration/V2__seed_topics.sql) - 12 topics + subtopics

---

## Frontend Components

### Design System
[styles.scss](file:///d:/www/ocp/frontend/src/styles.scss) bao gồm:
- CSS Variables cho colors, spacing, typography
- Dark theme mặc định
- Button, Card, Progress, Badge components
- Animations và utilities

### Feature Components
| Component | Chức năng |
|-----------|-----------|
| [Dashboard](file:///d:/www/ocp/frontend/src/app/features/dashboard/dashboard.component.ts) | Tổng quan progress, streak, calendar |
| [TopicList](file:///d:/www/ocp/frontend/src/app/features/topics/topic-list/topic-list.component.ts) | 12 topics với filter |
| [FlashcardList](file:///d:/www/ocp/frontend/src/app/features/flashcards/flashcard-list/flashcard-list.component.ts) | Quản lý flashcards |
| [FlashcardReview](file:///d:/www/ocp/frontend/src/app/features/flashcards/flashcard-review/flashcard-review.component.ts) | Review mode với flip |
| [QuizStart](file:///d:/www/ocp/frontend/src/app/features/quiz/quiz-start/quiz-start.component.ts) | Chọn quiz mode |

---

## Hướng Dẫn Chạy

### 1. Start Database
```bash
cd d:\www\ocp
docker-compose up -d
```

### 2. Run Backend
```bash
cd d:\www\ocp\backend
mvn spring-boot:run
```
- API: http://localhost:8080/api
- Swagger: http://localhost:8080/api/swagger-ui.html
- pgAdmin: http://localhost:5050

### 3. Run Frontend
```bash
cd d:\www\ocp\frontend
npm install
npm start
```
- App: http://localhost:4200

---

## 12 Topics OCP Java SE 11 (Đã Seed)

| # | Topic | Tháng | Độ ưu tiên |
|---|-------|-------|------------|
| 1 | Working with Java Data Types | 1 | ⭐⭐⭐ |
| 2 | Controlling Program Flow | 1 | ⭐⭐ |
| 3 | Java Object-Oriented Approach | 2 | ⭐⭐⭐⭐⭐ |
| 4 | Exception Handling | 3 | ⭐⭐⭐ |
| 5 | Arrays and Collections | 3 | ⭐⭐⭐⭐ |
| 6 | Lambda Expressions & Streams | 4 | ⭐⭐⭐⭐⭐ |
| 7 | Java I/O API | 5 | ⭐⭐⭐ |
| 8 | Concurrency | 5 | ⭐⭐⭐⭐ |
| 9 | Java Platform Module System | 5 | ⭐⭐⭐ |
| 10 | Database Applications with JDBC | 6 | ⭐⭐⭐ |
| 11 | Secure Coding in Java SE | 6 | ⭐⭐ |
| 12 | Annotations | 6 | ⭐⭐ |

---

## Các Bước Tiếp Theo

1. **Upgrade Node.js** lên version 18+ để chạy Angular CLI
2. **Thêm Quiz questions** vào database (V3 migration)
3. **Implement Topics Detail** page với subtopics
4. **Thêm Authentication** (optional)
5. **Deploy** lên cloud (Render, Railway, Vercel)

---

## Lưu Ý

> [!WARNING]
> Node.js version hiện tại (14.20.0) quá cũ cho Angular 17+.
> Cần upgrade lên Node.js 18+ trước khi chạy `npm install` trong frontend.

> [!TIP]
> Sử dụng **nvm** để quản lý Node.js versions:
> ```bash
> nvm install 18
> nvm use 18
> ```
