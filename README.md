# OCP Study App

Ứng dụng ôn thi chứng chỉ OCP Java SE 11 Developer (1Z0-819).

## 📖 Documentation

- **[Implementation Plan](docs/implementation_plan.md)** - Kế hoạch chi tiết 6 tháng học OCP + Architecture design
- **[Walkthrough](docs/walkthrough.md)** - Hướng dẫn setup và tổng quan components

## Tech Stack

- **Frontend**: Angular 17+ (Standalone Components)
- **Backend**: Spring Boot 3.2
- **Database**: PostgreSQL 15+

## Prerequisites

- Node.js 18+
- Java 17+
- Docker & Docker Compose

## Quick Start

### 1. Start Database

```bash
docker-compose up -d
```

### 2. Run Backend

```bash
cd backend
./mvnw spring-boot:run
```

API sẽ chạy tại: http://localhost:8080/api
Swagger UI: http://localhost:8080/api/swagger-ui.html

### 3. Run Frontend

```bash
cd frontend
npm install
npm start
```

App sẽ chạy tại: http://localhost:4200

## Features

- 📚 **12 Topics OCP** với subtopics chi tiết
- 📊 **Progress Tracking** theo dõi tiến độ học
- 🎴 **Flashcards** với Spaced Repetition
- 📝 **Quiz Mode** luyện đề thi
- 📅 **Streak Calendar** động lực học mỗi ngày

## Project Structure

```
ocp/
├── frontend/          # Angular Application
├── backend/           # Spring Boot API
└── docker-compose.yml # PostgreSQL setup
```

## License

MIT
