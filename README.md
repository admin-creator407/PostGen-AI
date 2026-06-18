# PostGen AI

Create high-performing LinkedIn content in seconds.

PostGen AI is a full-stack AI-powered content creation platform that helps users generate engaging LinkedIn posts, rewrite existing content, and create LinkedIn carousel outlines using Google's Gemini AI.

Built with a modern MERN architecture, Redis caching, Docker containerization, and Nginx reverse proxying.

---

## Overview

PostGen AI streamlines LinkedIn content creation by leveraging AI to generate professional posts tailored to different tones and lengths. The platform also supports content rewriting, carousel generation, content history management, and favorites.

The application demonstrates modern full-stack development practices including authentication, caching, containerization, and scalable deployment architecture.

---

## Features

### Authentication

- User Registration
- User Login
- JWT Authentication
- Protected Routes
- User Profile

### AI Content Generation

- Generate LinkedIn Posts
- Rewrite Existing Posts
- Generate LinkedIn Carousel Content
- Multiple Tone Options
- Multiple Length Options

### Content Management

- Save Generated Posts
- Search History
- Delete Posts
- Reuse Previous Posts
- Favorite Important Posts

### Performance Optimization

- Redis Caching
- Redis-Based Rate Limiting
- Optimized API Responses

### Infrastructure

- Dockerized Application
- Nginx Reverse Proxy
- MongoDB Atlas Integration
- Environment-Based Configuration

### User Experience

- Modern SaaS Interface
- Light and Dark Theme
- Responsive Design
- Clean Typography
- Smooth User Experience

---

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- TanStack Query
- Axios
- React Router DOM

### Backend

- Node.js
- Express.js
- JWT Authentication
- Mongoose

### Database

- MongoDB Atlas

### AI

- Google Gemini API

### Infrastructure

- Redis
- Docker
- Docker Compose
- Nginx

---

## Project Structure

```bash
PostGen-AI/
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   └── types/
│   │
│   └── Dockerfile
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
│   │
│   └── Dockerfile
│
├── nginx/
│   └── nginx.conf
│
└── docker-compose.yml
```

---

## Getting Started

### Clone the Repository

```bash
git clone <repository-url>
cd PostGen-AI
```

### Install Dependencies

Frontend

```bash
cd frontend
npm install
```

Backend

```bash
cd backend
npm install
```

---

## Environment Variables

Create a `.env` file inside the backend directory.

```env
PORT=5000

MONGO_URI=your_mongodb_atlas_uri

JWT_SECRET=your_jwt_secret

GEMINI_API_KEY=your_gemini_api_key

REDIS_URL=redis://redis:6379
```

Create a `.env` file inside the frontend directory.

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Redis Implementation

### Caching

Generated AI responses are cached using Redis.

```text
User Request
      ↓
Check Redis Cache
      ↓
Cache Hit → Return Response
      ↓
Cache Miss
      ↓
Gemini API
      ↓
Store Response in Redis
      ↓
Return Response
```

### Rate Limiting

To prevent abuse:

```text
10 AI generations per minute per user
```

Requests exceeding the limit receive:

```http
429 Too Many Requests
```

---

## Running With Docker

Build and start all services:

```bash
docker compose up --build
```

Services:

- Frontend
- Backend
- Redis
- Nginx

---

## Nginx Reverse Proxy

Nginx acts as a reverse proxy between the client and backend services.

Responsibilities:

- Route API requests
- Improve scalability
- Centralize traffic management
- Enable production-ready deployment

---

## Future Improvements

- Export Content as Markdown
- Multiple Post Variations
- AI Content Scheduling
- Team Collaboration
- LinkedIn Direct Publishing
- Advanced Analytics

---

## Screenshots

Include screenshots of:

- Login Page
- Generate Post Page
- Rewrite Page
- Carousel Generator
- History Page
- Light Theme
- Dark Theme

---

## Learning Outcomes

This project demonstrates:

- MERN Stack Development
- Authentication and Authorization
- REST API Design
- MongoDB Atlas Integration
- Redis Caching
- Rate Limiting
- Docker Containerization
- Nginx Configuration
- AI Integration with Gemini
- Modern React Development
- TypeScript Fundamentals

---

## Author

Built as a full-stack MERN project to explore AI-powered content generation, scalable architecture, and modern web development practices.
