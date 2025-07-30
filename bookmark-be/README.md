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
- ✅ **Mock Data**: 5,000 pre-generated bookmarks for testing

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone and install dependencies:**

   ```bash
   npm install
   ```

2. **Environment setup:**

   ```bash
   cp .env.example .env
   # Edit .env with your preferred settings
   ```

3. **Start the development server:**

   ```bash
   npm run start:dev
   ```

4. **Access the application:**
   - API Base URL: `http://localhost:3001/api/v1`
   - Swagger Documentation: `http://localhost:3001/api/docs`

## 📚 API Endpoints

### Bookmarks

| Method   | Endpoint                       | Description                  |
| -------- | ------------------------------ | ---------------------------- |
| `POST`   | `/api/v1/bookmarks`            | Create a new bookmark        |
| `GET`    | `/api/v1/bookmarks`            | Get paginated bookmarks list |
| `GET`    | `/api/v1/bookmarks/:id`        | Get bookmark by ID           |
| `DELETE` | `/api/v1/bookmarks/:id`        | Delete bookmark by ID        |
| `PUT`    | `/api/v1/bookmarks/:id`        | Update bookmark by ID        |
| `GET`    | `/api/v1/bookmarks/meta/stats` | Get bookmark statistics      |

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

## ⚙️ Configuration

### Environment Variables

| Variable            | Default                 | Description             |
| ------------------- | ----------------------- | ----------------------- |
| `PORT`              | `3001`                  | Server port             |
| `NODE_ENV`          | `development`           | Environment mode        |
| `FRONTEND_URL`      | `http://localhost:3000` | CORS origin             |
| `DEFAULT_PAGE_SIZE` | `20`                    | Default pagination size |
| `MAX_PAGE_SIZE`     | `100`                   | Maximum pagination size |

### CORS Configuration

The API is pre-configured to work with a frontend running on `localhost:3000`. Update CORS settings in `main.ts` for production use.

## 🧪 Data Storage

### In-Memory Storage

- Uses `Map` for O(1) lookups by ID
- Maintains insertion order with array for pagination
- Pre-populated with 5,000 diverse mock bookmarks
- Newest bookmarks appear first (reverse chronological)

### Mock Data Categories

- Technology, News, Social Media, Entertainment
- Education, Shopping, Sports, Health, Finance, Travel

## 🔧 Development

### Available Scripts

```bash
# Development
npm run start:dev      # Start with hot reload
npm run start:debug    # Start with debug mode

# Production
npm run build          # Build for production
npm run start:prod     # Start production server

# Code Quality
npm run lint           # Run ESLint
npm run format         # Format with Prettier
npm run test           # Run unit tests
npm run test:e2e       # Run e2e tests
```

### Code Quality Tools

- **ESLint**: Code linting with TypeScript rules
- **Prettier**: Code formatting with consistent style
- **Class Validator**: Runtime DTO validation
- **TypeScript**: Static type checking

## 📖 API Documentation

Interactive API documentation is available at `/api/docs` when the server is running.

Features:

- Complete endpoint documentation
- Request/response schemas
- Try-it-out functionality
- Model definitions
- Example payloads

## 🚀 Production Deployment

### Build for Production

```bash
npm run build
npm run start:prod
```

### Docker Support (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3001
CMD ["node", "dist/main"]
```

## 🛠️ Extending the Application

### Adding New Endpoints

1. Add methods to `IBookmarkRepository` interface
2. Implement in `InMemoryBookmarkRepository`
3. Add business logic to `BookmarksService`
4. Create new endpoint in `BookmarksController`

### Switching to Database

1. Create new repository implementation (e.g., `PostgresBookmarkRepository`)
2. Update provider in `BookmarksModule`
3. No changes needed in service or controller layers

## 🤝 Contributing

1. Follow the existing code style and patterns
2. Add tests for new features
3. Update documentation as needed
4. Ensure all linting passes

## 📄 License

This project is licensed under the MIT License.

---

## 🚀 Features Implemented

✅ RESTful API with NestJS  
✅ TypeScript with strict typing  
✅ Input validation with class-validator  
✅ Comprehensive error handling  
✅ Pagination with metadata  
✅ Swagger API documentation  
✅ CORS configuration  
✅ Repository pattern for scalability  
✅ 5,000 mock bookmarks  
✅ Production-ready architecture

Ready for production deployment! 🎉
