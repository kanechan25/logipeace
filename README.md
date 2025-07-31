# 🔖 Bookmark Manager Backend

A robust, production-ready backend API for managing bookmarks built with NestJS, TypeScript, and following enterprise-level architecture patterns.

## 📋 Features

- ✅ **Complete CRUD Operations**: Create, Read, Update, Delete bookmarks
- ✅ **Advanced Pagination**: Efficient pagination with metadata
- ✅ **Input Validation**: Comprehensive validation using class-validator
- ✅ **API Documentation**: Auto-generated Swagger/OpenAPI documentation
- ✅ **Scalable Architecture**: Layered architecture with Repository pattern
- ✅ **Type Safety**: Full TypeScript implementation
- ✅ **Production Ready**: CORS, validation pipes, error handling
- ✅ **Mock Data**: 5,000 pre-generated bookmarks (in-memory storage)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm/npm or yarn

### Installation

1. **Clone and install dependencies:**

   ```bash
   npm install
   ```

2. **Start the development server:**

   ```bash
   npm run start:dev
   ```

3. **Access the application:**
   - API Base URL: `http://localhost:3001/api/v1`
   - Swagger Documentation: `http://localhost:3001/api/docs`

## 📚 API Endpoints

### Bookmarks

| Method   | Endpoint                | Description                  |
| -------- | ----------------------- | ---------------------------- |
| `POST`   | `/api/v1/bookmarks`     | Create a new bookmark        |
| `GET`    | `/api/v1/bookmarks`     | Get paginated bookmarks list |
| `GET`    | `/api/v1/bookmarks/:id` | Get bookmark by ID           |
| `DELETE` | `/api/v1/bookmarks/:id` | Delete bookmark by ID        |
| `PUT`    | `/api/v1/bookmarks/:id` | Update bookmark by ID        |

### Example Usage

#### Create Bookmark

```bash
curl -X POST http://localhost:3001/api/v1/bookmarks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Google Search",
    "url": "https://www.google.com",
    "description": "Search engine for finding information"
  }'
```

#### Get Bookmarks (Paginated)

```bash
curl "http://localhost:3001/api/v1/bookmarks?page=1&limit=20"
```

#### Delete Bookmark

```bash
curl -X DELETE http://localhost:3001/api/v1/bookmarks/{bookmark-id}
```

## 🏗️ Architecture

### Layered Architecture

```
├── Controllers/     # HTTP request/response handling
├── Services/        # Business logic layer
├── Repositories/    # Data access layer
├── DTOs/           # Data transfer objects
├── Entities/       # Domain models
└── Interfaces/     # Contracts and abstractions
```

### Key Design Patterns

- **Repository Pattern**: Abstracts data storage implementation
- **Dependency Injection**: Loose coupling between components
- **DTO Pattern**: Input validation and data transformation
- **Decorator Pattern**: Validation, documentation, and metadata

## 📁 Project Structure

```
src/
├── modules/bookmarks/
│   ├── bookmarks.module.ts          # Module configuration
│   ├── bookmarks.controller.ts      # API endpoints
│   ├── bookmarks.service.ts         # Business logic
│   ├── dto/
│   │   ├── create-bookmark.dto.ts   # Input validation
│   │   └── pagination-query.dto.ts  # Pagination params
│   ├── entities/
│   │   └── bookmark.entity.ts       # Domain model
│   ├── interfaces/
│   │   └── bookmark-repository.interface.ts  # Repository contract
│   └── repositories/
│       └── in-memory-bookmark.repository.ts  # In-memory storage
├── main.ts                          # Application bootstrap
└── app.module.ts                    # Root module
```

## 🔧 Development

### Available Scripts

```bash
# Development
npm run start:dev      # Start with hot reload
npm run start:debug    # Start with debug mode

# Production
npm run build          # Build for production
npm run start:prod     # Start production server

```
