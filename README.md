# 🔖 Bookmark Manager

A bookmark management application with a robust NestJS backend API and modern React frontend.

### Backend service live [here](https://bookmark-manager-backend.fly.dev/api/v1/bookmarks?page=1&limit=20)

### Frontend web live [here](https://logipeace-bookmark.vercel.app)

## 📋 Features

### Frontend (React + Next.js)

- ✅ **Modern UI**: Clean, responsive design with Tailwind CSS
- ✅ **Real-time Search**: Debounced search functionality
- ✅ **Infinite Scroll**: Load more bookmarks on scroll
- ✅ **Dark/Light Theme**: Theme toggle with system preference detection
- ✅ **Form Validation**: Client-side validation with error handling
- ✅ **Loading States**: Skeleton loaders and loading indicators
- ✅ **Error Boundaries**: Graceful error handling
- ✅ **TypeScript**: Full type safety

### Backend (NestJS)

- ✅ **Complete CRUD Operations**: Create, Read, Update, Delete bookmarks
- ✅ **Advanced Pagination**: Efficient pagination with metadata
- ✅ **Input Validation**: Comprehensive validation using class-validator
- ✅ **API Documentation**: Auto-generated Swagger/OpenAPI documentation
- ✅ **Scalable Architecture**: Layered architecture with Repository pattern
- ✅ **Type Safety**: Full TypeScript implementation
- ✅ **Production Ready**: CORS, validation pipes, error handling
- ✅ **Mock Data**: 5,000 pre-generated bookmarks (in-memory storage)

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose (for containerized deployment)
- pnpm/npm or yarn

---

## 🔧 Backend Setup

### Docker Deployment (Recommended)

1. **Deploy using the provided script:**

   ```bash
   cd bookmark-be
   chmod +x deploy-be.sh
   ./deploy-be.sh
   ```

2. **Or manually with Docker Compose:**
   ```bash
   cd bookmark-be
   docker-compose up -d
   ```

### Local Development

1. **Navigate to backend directory:**

   ```bash
   cd bookmark-be
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Start development server:**

   ```bash
   pnpm run start:dev
   ```

4. **Access the application:**
   - API Base URL: `http://localhost:3001/api/v1`
   - Swagger Documentation: `http://localhost:3001/api/docs`

### API Endpoints

| Method   | Endpoint                | Description                   |
| -------- | ----------------------- | ----------------------------- |
| `POST`   | `/api/v1/bookmarks`     | Create a new bookmark         |
| `GET`    | `/api/v1/bookmarks`     | Get paginated bookmarks list  |
| `GET`    | `/api/v1/bookmarks/:id` | Get bookmark by ID            |
| `DELETE` | `/api/v1/bookmarks/:id` | Delete bookmark by ID         |
| `PUT`    | `/api/v1/bookmarks/:id` | Update bookmark by ID (bonus) |

### Example API Usage

```bash
# POST: Create bookmark
curl -X POST http://localhost:3001/api/v1/bookmarks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Google Search",
    "url": "https://www.google.com",
    "description": "Search engine for finding information"
  }'

# GET: Get bookmarks (paginated)
curl "http://localhost:3001/api/v1/bookmarks?page=1&limit=20"
```

---

## 🎨 Frontend Setup

### Docker Deployment (Recommended)

1. **Deploy using the provided script:**

   ```bash
   cd bookmark-fe
   chmod +x deploy-fe.sh
   ./deploy-fe.sh
   ```

2. **Or manually with Docker Compose:**
   ```bash
   cd bookmark-fe
   docker-compose up -d
   ```

### Local Development

1. **Navigate to frontend directory:**

   ```bash
   cd bookmark-fe
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start development server:**

   ```bash
   npm run dev
   ```

4. **Access the application:**
   - Frontend URL: `http://localhost:3000`

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test         # Run tests
```

---

### Environment Configuration

**Access the application:**

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:3001`
- API Documentation: `http://localhost:3001/api/docs`
  The applications are pre-configured for development. For production:

- Backend: Set `PORT` environment variable (default: 3001)
- Frontend: Configure API base URL in `src/configs/api.ts`

---

## 🚀 Production Deployment

### Backend Production

- Uses Node.js 18 Alpine for optimized container size
- Includes health checks
- Runs as non-root user for security
- Configured for production environment

### Frontend Production

- Built with Next.js for optimal performance
- Served via Nginx for static file serving
- Optimized bundle size and caching
- Responsive design for all devices
